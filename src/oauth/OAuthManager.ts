import { createHash, randomBytes } from "crypto";
import { TokenUpdater } from "../types/client";
import {
  AuthorizationURLOptions,
  ExchangeCodeOptions,
  PKCEPair,
  Scope,
  TokenRequestOptions,
  TokenResponse,
} from "../types/oauth";
import { TooLostAPIError } from "../utils/errors";
import { base64URLEncode } from "../utils/helpers";

interface OAuthManagerOptions {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes: Scope[];
  authURL: string;
  tokenURL: string;
  registerURL: string;
  fetchImpl: typeof fetch;
  updateTokens?: TokenUpdater;
}

/**
 * Manages OAuth authorization URL generation, token exchange, refresh, and PKCE helpers.
 */
export class OAuthManager {
  public readonly AUTH_URL: string;
  public readonly TOKEN_URL: string;
  public readonly REGISTER_URL: string;

  private readonly options: OAuthManagerOptions;

  public constructor(options: OAuthManagerOptions) {
    this.options = options;
    this.AUTH_URL = options.authURL;
    this.TOKEN_URL = options.tokenURL;
    this.REGISTER_URL = options.registerURL;
  }

  /**
   * Builds the OAuth authorization URL.
   */
  public getAuthorizationURL(options: AuthorizationURLOptions = {}): string {
    const url = new URL(this.AUTH_URL);
    const scopes = options.scopes ?? this.options.scopes;

    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", this.options.clientId);
    url.searchParams.set("redirect_uri", this.options.redirectUri);

    if (scopes.length > 0) {
      url.searchParams.set("scope", scopes.join(" "));
    }

    if (options.state) {
      url.searchParams.set("state", options.state);
    }

    if (options.codeChallenge) {
      url.searchParams.set("code_challenge", options.codeChallenge);
      url.searchParams.set("code_challenge_method", "S256");
    }

    return url.toString();
  }

  /**
   * Exchanges an authorization code for access and refresh tokens.
   */
  public async exchangeCode(
    code: string,
    options?: TokenRequestOptions,
  ): Promise<TokenResponse>;
  public async exchangeCode(
    options: ExchangeCodeOptions,
  ): Promise<TokenResponse>;
  public async exchangeCode(
    firstArg: string | ExchangeCodeOptions,
    secondArg?: TokenRequestOptions,
  ): Promise<TokenResponse> {
    const exchangeOptions = this.normalizeExchangeCodeInput(
      firstArg,
      secondArg,
    );

    const form = new URLSearchParams({
      grant_type: "authorization_code",
      code: exchangeOptions.code,
      client_id: this.options.clientId,
      redirect_uri: exchangeOptions.redirectUri ?? this.options.redirectUri,
    });

    if (this.options.clientSecret) {
      form.set("client_secret", this.options.clientSecret);
    }

    if (exchangeOptions.codeVerifier) {
      form.set("code_verifier", exchangeOptions.codeVerifier);
    }

    return this.requestToken(form);
  }

  /**
   * Refreshes an access token using a refresh token.
   */
  public async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const form = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.options.clientId,
    });

    if (this.options.clientSecret) {
      form.set("client_secret", this.options.clientSecret);
    }

    return this.requestToken(form);
  }

  /**
   * Generates a PKCE verifier/challenge pair.
   */
  public generatePKCE(): PKCEPair {
    const codeVerifier = base64URLEncode(randomBytes(64));
    const codeChallenge = base64URLEncode(
      createHash("sha256").update(codeVerifier).digest(),
    );

    return { codeVerifier, codeChallenge };
  }

  private async requestToken(form: URLSearchParams): Promise<TokenResponse> {
    const response = await this.options.fetchImpl(this.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new TooLostAPIError(
        response.status,
        this.readTokenError(payload, response.statusText),
        payload,
      );
    }

    const token = this.normalizeTokenResponse(payload);
    this.options.updateTokens?.(token);
    return token;
  }

  private normalizeExchangeCodeInput(
    firstArg: string | ExchangeCodeOptions,
    secondArg?: TokenRequestOptions,
  ): ExchangeCodeOptions {
    if (typeof firstArg === "string") {
      return {
        code: firstArg,
        codeVerifier: secondArg?.codeVerifier,
        redirectUri: secondArg?.redirectUri,
      };
    }

    return firstArg;
  }

  private normalizeTokenResponse(payload: unknown): TokenResponse {
    if (!payload || typeof payload !== "object") {
      throw new TooLostAPIError(500, "Invalid token response payload", payload);
    }

    const body = payload as Record<string, unknown>;
    const tokenType =
      this.pickString(body, "tokenType") ?? this.pickString(body, "token_type");
    const accessToken =
      this.pickString(body, "accessToken") ??
      this.pickString(body, "access_token");
    const refreshToken =
      this.pickString(body, "refreshToken") ??
      this.pickString(body, "refresh_token");
    const expiresIn =
      this.pickNumber(body, "expiresIn") ?? this.pickNumber(body, "expires_in");

    if (!accessToken || !refreshToken || !expiresIn) {
      throw new TooLostAPIError(
        500,
        "Token response missing required fields",
        payload,
      );
    }

    return {
      tokenType: tokenType === "Bearer" ? "Bearer" : "Bearer",
      accessToken,
      refreshToken,
      expiresIn,
      scope: this.pickString(body, "scope"),
    };
  }

  private readTokenError(payload: unknown, fallback: string): string {
    if (payload && typeof payload === "object") {
      const body = payload as Record<string, unknown>;
      const message =
        this.pickString(body, "error_description") ??
        this.pickString(body, "message");
      if (message) {
        return message;
      }

      const error = this.pickString(body, "error");
      if (error) {
        return error;
      }
    }

    return fallback || "OAuth request failed";
  }

  private pickString(
    body: Record<string, unknown>,
    key: string,
  ): string | undefined {
    const value = body[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  }

  private pickNumber(
    body: Record<string, unknown>,
    key: string,
  ): number | undefined {
    const value = body[key];
    return typeof value === "number" ? value : undefined;
  }
}
