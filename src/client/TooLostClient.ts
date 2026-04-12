import { LookupManager } from "../managers/LookupManager";
import { PreferencesManager } from "../managers/PreferencesManager";
import { ReleasesManager } from "../managers/ReleasesManager";
import { TracksManager } from "../managers/TracksManager";
import { UserManager } from "../managers/UserManager";
import { OAuthManager } from "../oauth/OAuthManager";
import { REST } from "../rest/REST";
import { APIResponse } from "../types/api";
import {
  HTTPMethod,
  RequestOptions,
  StoredTokenState,
  TooLostClientEventMap,
  TooLostClientOptions,
} from "../types/client";
import { TokenResponse } from "../types/oauth";
import { TooLostAPIError } from "../utils/errors";
import { unwrapData } from "../utils/helpers";
import {
  DEFAULT_AUTH_URL,
  DEFAULT_BASE_URL,
  DEFAULT_REGISTER_URL,
  DEFAULT_TOKEN_URL,
} from "./constants";
import { TypedEventEmitter } from "./TypedEventEmitter";

/**
 * Main SDK client for interacting with the Too Lost API.
 */
export class TooLostClient extends TypedEventEmitter<TooLostClientEventMap> {
  public readonly oauth: OAuthManager;
  public readonly user: UserManager;
  public readonly releases: ReleasesManager;
  public readonly tracks: TracksManager;
  public readonly preferences: PreferencesManager;
  public readonly lookup: LookupManager;

  private readonly rest: REST;
  private readonly tokenState: StoredTokenState;
  private readonly autoRefresh: boolean;
  private inflightRefresh?: Promise<void>;

  /**
   * Creates a new Too Lost API client.
   */
  public constructor(options: TooLostClientOptions) {
    super();

    if (!options.clientId) {
      throw new Error("TooLostClient requires a clientId");
    }

    if (!options.redirectUri) {
      throw new Error("TooLostClient requires a redirectUri");
    }

    const fetchImpl = options.fetch ?? globalThis.fetch;
    if (!fetchImpl) {
      throw new Error("Fetch API is not available in this environment");
    }

    this.tokenState = {
      accessToken: options.accessToken,
      refreshToken: options.refreshToken,
      tokenType: "Bearer",
    };
    this.autoRefresh = options.autoRefresh ?? true;

    this.oauth = new OAuthManager({
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      redirectUri: options.redirectUri,
      scopes: options.scopes ?? [],
      authURL: options.authURL ?? DEFAULT_AUTH_URL,
      tokenURL: options.tokenURL ?? DEFAULT_TOKEN_URL,
      registerURL: options.registerURL ?? DEFAULT_REGISTER_URL,
      fetchImpl,
      updateTokens: (token) => this.setTokens(token),
    });

    this.rest = new REST({
      baseURL: options.baseURL ?? DEFAULT_BASE_URL,
      retry: options.retry ?? 2,
      fetchImpl,
      getAccessToken: () => this.tokenState.accessToken,
      emitRequest: (event) => {
        this.emit("request", event);
      },
      emitResponse: (event) => {
        this.emit("response", event);
      },
      emitError: (event) => {
        if (this.listenerCount("error") > 0) {
          this.emit("error", event);
        }
      },
    });

    this.user = new UserManager(this);
    this.releases = new ReleasesManager(this);
    this.tracks = new TracksManager(this);
    this.preferences = new PreferencesManager(this);
    this.lookup = new LookupManager(this);
  }

  /** Currently active access token, if set. */
  public get accessToken(): string | undefined {
    return this.tokenState.accessToken;
  }

  /** Currently active refresh token, if set. */
  public get refreshToken(): string | undefined {
    return this.tokenState.refreshToken;
  }

  /**
   * Sets the access token manually and optionally records expiry.
   */
  public setAccessToken(accessToken: string, expiresIn?: number): void {
    this.tokenState.accessToken = accessToken;
    this.tokenState.tokenType = "Bearer";

    if (expiresIn) {
      this.tokenState.expiresAt = Date.now() + expiresIn * 1000;
    }
  }

  /**
   * Sets the refresh token manually.
   */
  public setRefreshToken(refreshToken: string): void {
    this.tokenState.refreshToken = refreshToken;
  }

  /**
   * Sets both access and refresh tokens, updates expiry, and emits `tokenRefresh`.
   */
  public setTokens(token: TokenResponse): void {
    this.tokenState.accessToken = token.accessToken;
    this.tokenState.refreshToken = token.refreshToken;
    this.tokenState.tokenType = token.tokenType;
    this.tokenState.expiresAt = Date.now() + token.expiresIn * 1000;

    this.emit("tokenRefresh", {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresAt: this.tokenState.expiresAt,
    });
  }

  /**
   * Executes a request through the REST layer with optional auto-refresh behavior.
   */
  public async request<T>(
    method: HTTPMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    await this.refreshBeforeRequest(options);

    try {
      return await this.rest.request<T>(method, path, options);
    } catch (error) {
      if (this.shouldRetryAfterRefresh(error, options)) {
        await this.refreshAccessToken();
        return this.rest.request<T>(method, path, options);
      }

      throw error;
    }
  }

  /**
   * Executes a request and unwraps API envelopes that include a top-level `data` field.
   */
  public async requestData<T>(
    method: HTTPMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const response = await this.request<APIResponse<T> | T>(
      method,
      path,
      options,
    );
    return unwrapData(response);
  }

  private async refreshBeforeRequest(options: RequestOptions): Promise<void> {
    if (!this.autoRefresh || options.skipAuth) {
      return;
    }

    if (!this.tokenState.refreshToken || !this.tokenState.expiresAt) {
      return;
    }

    const expiresSoon = this.tokenState.expiresAt - Date.now() <= 30_000;
    if (expiresSoon) {
      await this.refreshAccessToken();
    }
  }

  private shouldRetryAfterRefresh(
    error: unknown,
    options: RequestOptions,
  ): boolean {
    if (
      !this.autoRefresh ||
      options.skipAuth ||
      !this.tokenState.refreshToken
    ) {
      return false;
    }

    return error instanceof TooLostAPIError && error.status === 401;
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.tokenState.refreshToken) {
      throw new TooLostAPIError(
        401,
        "Cannot refresh token: missing refresh token",
      );
    }

    if (!this.inflightRefresh) {
      this.inflightRefresh = (async () => {
        await this.oauth.refreshToken(this.tokenState.refreshToken as string);
      })().finally(() => {
        this.inflightRefresh = undefined;
      });
    }

    await this.inflightRefresh;
  }
}
