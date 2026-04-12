# Toolost SDK Documentation

This documentation describes the full current behavior of the Toolost JavaScript/TypeScript SDK as implemented in this repository.

## Documentation Map

- [Getting Started](./getting-started.md)
- [Architecture](./architecture.md)
- [Public API Surface](./public-api.md)
- [Client Reference](./client-reference.md)
- [OAuth Reference](./oauth-reference.md)
- [Manager Reference](./manager-reference.md)
- [Endpoint Matrix](./endpoint-matrix.md)
- [Type System](./type-system.md)
- [Events, Errors, and Retries](./events-errors-retries.md)
- [Testing and Quality](./testing-and-quality.md)
- [Roadmap](./roadmap.md)

## Current SDK Capabilities

- OAuth 2.0 Authorization Code flow helpers with PKCE support.
- Configurable API client with token management and event hooks.
- Auto-refresh and retry behavior for authenticated API requests.
- Full manager surface for User, Releases, Tracks, Preferences, and Lookup endpoints.
- Strong TypeScript models for request and response payloads.
- Normalized user model conversion from raw API payloads.
- Endpoint-aware manager tests and client behavior tests.

## Scope of This Documentation

This docs suite covers:

- Every currently exported class and public method.
- Endpoint mappings currently implemented in managers.
- Event payloads and error semantics.
- Request lifecycle behavior (retries, refresh, auth headers).
- Type module structure and deprecated aliases.
- Current testing coverage and known gaps.
- Forward-looking roadmap for SDK evolution.

## Versioning Note

This reflects the current repository implementation (package version `1.0.1`).
Future releases may add or adjust manager methods as the Toolost API evolves.
