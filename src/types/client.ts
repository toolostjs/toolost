import { Scope, TokenResponse } from "./oauth";

/** Public constructor options for `TooLostClient`. */
export interface TooLostClientOptions {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes?: Scope[];
  accessToken?: string;
  refreshToken?: string;
  autoRefresh?: boolean;
  retry?: number;
  baseURL?: string;
  authURL?: string;
  tokenURL?: string;
  registerURL?: string;
  fetch?: typeof fetch;
}

/** Internal token cache maintained by the client instance. */
export interface StoredTokenState {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: "Bearer";
}

/** Emitted before a request is sent. */
export interface RequestEvent {
  method: string;
  path: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  attempt: number;
}

/** Emitted after a response is received. */
export interface ResponseEvent {
  method: string;
  path: string;
  url: string;
  status: number;
  ok: boolean;
  durationMs: number;
}

/** Emitted when request processing fails. */
export interface ErrorEvent {
  method: string;
  path: string;
  url: string;
  status?: number;
  message: string;
}

/** Emitted after the client refreshes OAuth tokens. */
export interface TokenRefreshEvent {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

/** Event-to-payload map used by the client event API. */
export type TooLostClientEventMap = {
  request: RequestEvent;
  response: ResponseEvent;
  error: ErrorEvent;
  tokenRefresh: TokenRefreshEvent;
};

/** Supported HTTP methods in the internal REST layer. */
export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Primitive query value type. */
export type QueryPrimitive = string | number | boolean;

/** Query value type accepted by request helpers. */
export type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined;

/**
 * Request options used by manager methods and the core request API.
 */
export interface RequestOptions {
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: Record<string, string>;
  retry?: number;
  skipAuth?: boolean;
}

/** Internal callback type used by OAuth manager to persist token updates. */
export interface TokenUpdater {
  (token: TokenResponse): void;
}
