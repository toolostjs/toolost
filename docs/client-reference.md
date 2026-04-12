# Client Reference

## Class: TooLostClient

`TooLostClient` is the main SDK entry point.

```ts
new TooLostClient(options: TooLostClientOptions)
```

## Constructor Options

| Option         | Type           | Required | Description                                                          |
| -------------- | -------------- | -------: | -------------------------------------------------------------------- |
| `clientId`     | `string`       |      yes | OAuth client ID.                                                     |
| `clientSecret` | `string`       |       no | OAuth client secret (optional for PKCE public clients).              |
| `redirectUri`  | `string`       |      yes | OAuth redirect URI.                                                  |
| `scopes`       | `Scope[]`      |       no | Scope list used by OAuth URL generation.                             |
| `accessToken`  | `string`       |       no | Initial access token.                                                |
| `refreshToken` | `string`       |       no | Initial refresh token.                                               |
| `autoRefresh`  | `boolean`      |       no | Enables refresh-on-expiry and refresh-on-401 logic. Default: `true`. |
| `retry`        | `number`       |       no | Default REST retry count. Default: `2`.                              |
| `baseURL`      | `string`       |       no | API base URL override. Default: `https://api.toolost.com/v1`.        |
| `authURL`      | `string`       |       no | OAuth authorize URL override.                                        |
| `tokenURL`     | `string`       |       no | OAuth token URL override.                                            |
| `registerURL`  | `string`       |       no | OAuth registration URL override.                                     |
| `fetch`        | `typeof fetch` |       no | Custom fetch implementation.                                         |

## Exposed Managers and Services

- `client.oauth: OAuthManager`
- `client.user: UserManager`
- `client.releases: ReleasesManager`
- `client.tracks: TracksManager`
- `client.preferences: PreferencesManager`
- `client.lookup: LookupManager`

## Token Accessors and Mutators

### `accessToken`

```ts
get accessToken(): string | undefined
```

### `refreshToken`

```ts
get refreshToken(): string | undefined
```

### `setAccessToken`

```ts
setAccessToken(accessToken: string, expiresIn?: number): void
```

If `expiresIn` is provided, internal `expiresAt` is computed and used by pre-request auto-refresh checks.

### `setRefreshToken`

```ts
setRefreshToken(refreshToken: string): void
```

### `setTokens`

```ts
setTokens(token: TokenResponse): void
```

Sets access/refresh tokens, computes expiry, and emits `tokenRefresh`.

## Request Methods

### `request`

```ts
request<T>(method: HTTPMethod, path: string, options?: RequestOptions): Promise<T>
```

Low-level request API used by managers.

### `requestData`

```ts
requestData<T>(method: HTTPMethod, path: string, options?: RequestOptions): Promise<T>
```

Same as `request`, but unwraps `{ data: T }` payloads.

## Event API

`TooLostClient` extends a typed emitter (`TypedEventEmitter`) with:

- `on`
- `once`
- `off`
- `emit`

### Event Names and Payloads

- `request: RequestEvent`
- `response: ResponseEvent`
- `error: ErrorEvent`
- `tokenRefresh: TokenRefreshEvent`

Example:

```ts
client.on("request", (event) => {
  console.log(event.method, event.url, event.attempt);
});

client.on("tokenRefresh", (event) => {
  console.log("new token expiresAt", event.expiresAt);
});
```

## Auto Refresh and Retry Logic

### Pre-request refresh

Executed before each request when all are true:

- `autoRefresh === true`
- `options.skipAuth !== true`
- `refreshToken` exists
- `expiresAt` exists
- `expiresAt - now <= 30000`

### 401 recovery

When a request throws `TooLostAPIError` with status `401`, the client:

1. refreshes tokens (if allowed and refresh token exists)
2. retries the original request once

### In-flight refresh deduplication

Concurrent refresh attempts share a single internal promise to avoid duplicate refresh calls.

## Notes

- The client always requires a valid fetch implementation (global or injected).
- Error event emission is guarded: it emits only when there are `error` listeners.
- All manager methods ultimately rely on this client behavior.
