# Events, Errors, and Retries

## Event System

`TooLostClient` extends a typed event emitter with four event channels:

- `request`
- `response`
- `error`
- `tokenRefresh`

## Event Listener Methods

```ts
client.on(eventName, listener);
client.once(eventName, listener);
client.off(eventName, listener);
```

## Event Payloads

### `request`

```ts
interface RequestEvent {
  method: string;
  path: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  attempt: number;
}
```

### `response`

```ts
interface ResponseEvent {
  method: string;
  path: string;
  url: string;
  status: number;
  ok: boolean;
  durationMs: number;
}
```

### `error`

```ts
interface ErrorEvent {
  method: string;
  path: string;
  url: string;
  status?: number;
  message: string;
}
```

### `tokenRefresh`

```ts
interface TokenRefreshEvent {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
```

## Important Event Semantics

- `error` is emitted for API or network failures observed by the REST layer.
- `error` emission is guarded in `TooLostClient`: if no `error` listeners are registered, it does not emit.
- `response` is emitted for every fetch response, including non-2xx responses.
- `request.attempt` increases when retry logic re-sends the request.

## Error Types

## `TooLostAPIError`

```ts
class TooLostAPIError extends Error {
  readonly status: number;
  readonly body?: unknown;
}
```

Thrown for non-2xx API responses and specific token refresh constraints.

### Message extraction strategy

For non-2xx responses, message is selected in order:

1. `body.message`
2. `body.error`
3. `response.statusText`
4. fallback `"Request failed"`

## Retry Behavior

Retry is implemented in `REST.request`.

### Default retries

- Client default: `2`
- Per-request override: `RequestOptions.retry`

### Retry conditions

Request retries occur when either is true:

- response status is `>= 500`
- response status is `429`
- fetch throws non-`TooLostAPIError` error (network/runtime fetch failure)

### Backoff schedule

Backoff by attempt index (`attempt` is zero-based inside REST):

- attempt 0 -> 1000 ms
- attempt 1 -> 2000 ms
- attempt 2+ -> capped at 3000 ms

Formula:

```ts
Math.min(1000 * (attempt + 1), 3000);
```

## Token Refresh Behavior

## Pre-request refresh

Before each request, client may refresh if:

- `autoRefresh` is enabled
- `skipAuth` is false
- `refreshToken` exists
- `expiresAt` is known
- token expires within 30 seconds

## 401 refresh-and-retry

After request failure, client retries once when:

- error is `TooLostAPIError`
- status is `401`
- `autoRefresh` enabled
- `skipAuth` false
- refresh token available

The original request is then re-sent after refresh.

## Refresh deduplication

Concurrent refresh triggers share a single in-flight promise (`inflightRefresh`) to avoid duplicate token refresh requests.

## Practical Guidance

- Register at least one `error` listener for production observability.
- Keep write operations idempotent when possible if using retry.
- Set explicit per-request retry to `0` for non-repeatable calls when needed.
