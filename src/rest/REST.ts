import {
  ErrorEvent,
  HTTPMethod,
  RequestEvent,
  RequestOptions,
  ResponseEvent,
} from "../types/client";
import { TooLostAPIError } from "../utils/errors";
import { buildURL } from "../utils/helpers";

interface RESTOptions {
  baseURL: string;
  retry: number;
  fetchImpl: typeof fetch;
  getAccessToken: () => string | undefined;
  emitRequest?: (event: RequestEvent) => void;
  emitResponse?: (event: ResponseEvent) => void;
  emitError?: (event: ErrorEvent) => void;
}

/**
 * Internal REST transport used by managers and OAuth-aware client requests.
 */
export class REST {
  private options: RESTOptions;

  public constructor(options: RESTOptions) {
    this.options = options;
  }

  public setBaseURL(baseURL: string): void {
    this.options.baseURL = baseURL;
  }

  /**
   * Executes an HTTP request with retry and normalized error behavior.
   */
  public async request<T>(
    method: HTTPMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = buildURL(this.options.baseURL, path, options.query);
    const maxRetries = options.retry ?? this.options.retry;

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      if (!options.skipAuth) {
        const token = this.options.getAccessToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const requestEvent: RequestEvent = {
        method,
        path,
        url,
        headers,
        body: options.body,
        attempt: attempt + 1,
      };
      this.options.emitRequest?.(requestEvent);

      const startedAt = Date.now();

      try {
        const response = await this.options.fetchImpl(url, {
          method,
          headers,
          body: this.serializeBody(options.body),
        });

        const responseBody = await this.parseResponseBody(response);
        const responseEvent: ResponseEvent = {
          method,
          path,
          url,
          status: response.status,
          ok: response.ok,
          durationMs: Date.now() - startedAt,
        };
        this.options.emitResponse?.(responseEvent);

        if (!response.ok) {
          const apiError = new TooLostAPIError(
            response.status,
            this.readErrorMessage(responseBody, response.statusText),
            responseBody,
          );

          if (attempt < maxRetries && this.shouldRetryStatus(response.status)) {
            await this.delay(this.backoffFor(attempt));
            continue;
          }

          this.options.emitError?.({
            method,
            path,
            url,
            status: response.status,
            message: apiError.message,
          });
          throw apiError;
        }

        return responseBody as T;
      } catch (error) {
        if (attempt < maxRetries && this.isRetryableNetworkError(error)) {
          await this.delay(this.backoffFor(attempt));
          continue;
        }

        const message =
          error instanceof Error ? error.message : "Unknown request error";
        this.options.emitError?.({
          method,
          path,
          url,
          message,
        });
        throw error;
      }
    }

    throw new TooLostAPIError(500, "Unexpected request retry failure");
  }

  private serializeBody(body: unknown): string | undefined {
    if (body === undefined || body === null) {
      return undefined;
    }

    if (typeof body === "string") {
      return body;
    }

    return JSON.stringify(body);
  }

  private async parseResponseBody(response: Response): Promise<unknown> {
    const raw = await response.text();
    if (!raw) {
      return undefined;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  private shouldRetryStatus(status: number): boolean {
    return status >= 500 || status === 429;
  }

  private isRetryableNetworkError(error: unknown): boolean {
    return error instanceof Error && !(error instanceof TooLostAPIError);
  }

  private readErrorMessage(body: unknown, fallback: string): string {
    if (body && typeof body === "object") {
      const maybeMessage = (body as Record<string, unknown>).message;
      if (typeof maybeMessage === "string" && maybeMessage.length > 0) {
        return maybeMessage;
      }

      const maybeError = (body as Record<string, unknown>).error;
      if (typeof maybeError === "string" && maybeError.length > 0) {
        return maybeError;
      }
    }

    return fallback || "Request failed";
  }

  private backoffFor(attempt: number): number {
    return Math.min(1000 * (attempt + 1), 3000);
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
