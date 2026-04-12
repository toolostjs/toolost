/**
 * OAuth scopes supported by the Too Lost API.
 */
export type Scope =
  | "read:profile"
  | "read:releases"
  | "write:releases"
  | "read:preferences"
  | "write:preferences"
  | "read:catalog"
  | "read:analytics"
  | "read:earnings"
  | "read:audience";

/** Options for generating the authorization URL. */
export interface AuthorizationURLOptions {
  state?: string;
  scopes?: Scope[];
  codeChallenge?: string;
}

/** Options for exchanging an OAuth authorization code for tokens. */
export interface ExchangeCodeOptions {
  code: string;
  codeVerifier?: string;
  redirectUri?: string;
}

/** PKCE verifier/challenge pair. */
export interface PKCEPair {
  codeVerifier: string;
  codeChallenge: string;
}

/**
 * Normalized OAuth token payload returned by the SDK.
 *
 * The API may return either snake_case or camelCase fields. The SDK normalizes
 * values to this shape.
 */
export interface TokenResponse {
  tokenType: "Bearer";
  expiresIn: number;
  accessToken: string;
  refreshToken: string;
  scope?: string;
}

/** Additional options for token exchange requests. */
export interface TokenRequestOptions {
  codeVerifier?: string;
  redirectUri?: string;
}
