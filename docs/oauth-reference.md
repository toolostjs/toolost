# OAuth Reference

## Class: OAuthManager

`OAuthManager` handles OAuth URL generation, token exchange, token refresh, and PKCE helpers.

## Constants (instance fields)

- `AUTH_URL`
- `TOKEN_URL`
- `REGISTER_URL`

These values are sourced from `TooLostClient` options or defaults.

## Methods

### `getAuthorizationURL`

```ts
getAuthorizationURL(options?: AuthorizationURLOptions): string
```

Builds the OAuth authorization URL with:

- `response_type=code`
- `client_id`
- `redirect_uri`
- optional `scope`
- optional `state`
- optional PKCE params (`code_challenge`, `code_challenge_method=S256`)

### `exchangeCode`

```ts
exchangeCode(code: string, options?: TokenRequestOptions): Promise<TokenResponse>
exchangeCode(options: ExchangeCodeOptions): Promise<TokenResponse>
```

Exchanges authorization code for tokens via `application/x-www-form-urlencoded` request to token URL.

Handles both overloads for DX:

- positional `code`
- object style

### `refreshToken`

```ts
refreshToken(refreshToken: string): Promise<TokenResponse>
```

Refreshes access token with grant type `refresh_token`.

### `generatePKCE`

```ts
generatePKCE(): PKCEPair
```

Creates:

- `codeVerifier` using secure random bytes
- `codeChallenge` using SHA-256 then URL-safe base64

## Token Normalization Behavior

Token responses are normalized from either camelCase or snake_case fields:

- `accessToken` or `access_token`
- `refreshToken` or `refresh_token`
- `expiresIn` or `expires_in`
- `tokenType` or `token_type`

Result is always returned as:

```ts
{
  tokenType: "Bearer",
  accessToken,
  refreshToken,
  expiresIn,
  scope?,
}
```

## Error Behavior

OAuth failures throw `TooLostAPIError` with:

- HTTP status
- best-effort message from `error_description`, `message`, or `error`
- raw payload in `body`

## Scope Type

Current scope union in SDK:

- `read:profile`
- `read:releases`
- `write:releases`
- `read:preferences`
- `write:preferences`
- `read:catalog`
- `read:analytics`
- `read:earnings`
- `read:audience`
