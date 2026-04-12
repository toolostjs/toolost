# Testing and Quality

## Tooling

- TypeScript (`strict` mode)
- Vitest
- Prettier

## Scripts

From `package.json`:

- `npm run build` -> compile TypeScript to `dist`
- `npm run typecheck` -> strict TS no-emit check
- `npm run test` -> execute unit tests with Vitest
- `npm run lint` -> Prettier check pass
- `npm run format` -> Prettier write pass
- `npm run prepublishOnly` -> build + typecheck + lint

## Current Test Suite

## `tests/oauth.test.ts`

Covers OAuth manager basics:

- authorization URL assembly
- required query parameter behavior
- PKCE verifier/challenge generation shape and length

## `tests/client.test.ts`

Covers client core behavior:

- request envelope unwrapping (`{ data: ... }`)
- bearer header injection with access token
- automatic 401 refresh-and-retry flow
- token update propagation (`accessToken`/`refreshToken`)
- `tokenRefresh` event emission

## `tests/managers.test.ts`

Covers endpoint mapping by manager:

- Releases manager route and method mapping
- Tracks manager route and method mapping
- Preferences manager route and method mapping
- Lookup and User manager route and method mapping
- query serialization checks for selected endpoints

## Quality Characteristics

- Public SDK surface is strongly typed and exported for consumer use.
- Request methods preserve endpoint-specific request and response signatures.
- Runtime errors are normalized into `TooLostAPIError` for non-2xx API responses.
- Retry and refresh behavior is deterministic and covered at core-flow level.

## Current Gaps

These are known opportunities for stronger assurance:

- no live integration tests against Toolost sandbox/real API
- no contract snapshot tests for full response object shapes
- no fuzz/property tests for query serialization edge cases
- no dedicated concurrency stress tests for `inflightRefresh` behavior
- no explicit performance benchmarks

## Recommended Next Tests

1. Add integration tests behind environment-gated credentials.
2. Add focused retry tests validating backoff timing and retry stop conditions.
3. Add tests for `skipAuth`, custom headers, and body serialization edge cases.
4. Add regression tests for alias methods to ensure parity with canonical methods.
5. Add schema-level validation tests for critical manager payloads.

## CI Guidance

A minimal CI quality gate should run:

1. `npm ci`
2. `npm run typecheck`
3. `npm test`
4. `npm run build`
