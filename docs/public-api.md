# Public API Surface

This document lists the package-level exports from `src/index.ts`.

## Class Exports

- `TooLostClient`
- `OAuthManager`
- `UserManager`
- `ReleasesManager`
- `TracksManager`
- `PreferencesManager`
- `LookupManager`

## Error Export

- `TooLostAPIError`

## Utility Export

- `normalizeUserResource`

Converts a raw `UserResource` payload to normalized `User` shape.

## Type Exports

### Normalized model types

- `User`

### API contract types

- `export type * from "./types/api"`

Includes all request/response and utility types from the API type modules.

### Client runtime types

- `TooLostClientOptions`
- `RequestEvent`
- `ResponseEvent`
- `ErrorEvent`
- `TokenRefreshEvent`

### OAuth types

- `AuthorizationURLOptions`
- `ExchangeCodeOptions`
- `PKCEPair`
- `Scope`
- `TokenRequestOptions`
- `TokenResponse`
