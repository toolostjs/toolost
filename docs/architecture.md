# Architecture

## High-Level Design

The SDK is organized into clear layers:

1. `TooLostClient`: orchestration, token state, manager wiring.
2. `OAuthManager`: OAuth URL generation, code exchange, token refresh, PKCE utilities.
3. `REST`: HTTP transport, retries, auth header application, error normalization.
4. `Managers`: endpoint-level domain APIs.
5. `Types`: request/response contracts organized by domain.

## Runtime Flow

### Standard request flow

1. Manager method calls `BaseManager.request` or `BaseManager.requestData`.
2. `TooLostClient.request` runs pre-request refresh check.
3. `REST.request` builds URL, headers, emits events, executes fetch.
4. Response body is parsed.
5. Non-2xx responses become `TooLostAPIError`.
6. `requestData` unwraps `{ data: ... }` responses automatically.

### Auto refresh behavior

The client can refresh in two ways:

1. Pre-request refresh:
   - Happens only when `autoRefresh` is true.
   - Requires a known `expiresAt` and `refreshToken`.
   - Triggers when token expires in <= 30 seconds.
2. 401 recovery:
   - If request fails with `TooLostAPIError` status 401.
   - Requires `autoRefresh` and `refreshToken`.
   - Performs one refresh and retries the request.

## Eventing Model

The client extends a typed event emitter and supports:

- `request`
- `response`
- `error`
- `tokenRefresh`

Event listener methods:

- `on`
- `once`
- `off`
- `emit`

## Module Layout

- `src/client`: client runtime and typed event emitter.
- `src/oauth`: OAuth manager.
- `src/rest`: REST transport.
- `src/managers`: domain managers.
- `src/types`: SDK type system and API contracts.
- `src/structures`: normalized output models.
- `src/utils`: shared runtime helpers and errors.

## Type Architecture

API types are split by domain under `src/types/api/`:

- `common.ts`
- `enums.ts`
- `shared.ts`
- `user.ts`
- `releases.ts`
- `tracks.ts`
- `preferences.ts`
- `lookup.ts`
- `deprecated.ts`

Public compatibility is preserved through:

- `src/types/api.ts` (barrel)
- `src/types/api/index.ts` (domain barrel)
