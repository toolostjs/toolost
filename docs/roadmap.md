# Roadmap

This roadmap is implementation-focused guidance for evolving the SDK from the current `1.0.x` baseline.

## Principles

- Keep endpoint parity with Toolost API as top priority.
- Preserve strong type safety and predictable runtime behavior.
- Prefer backward-compatible additions over breaking changes.
- Keep method naming consistent while maintaining useful aliases.

## Near-Term (v1.1)

- Expand test coverage for retry timing, `skipAuth`, and request edge cases.
- Add more granular docs examples for release lifecycle and preference workflows.
- Add helper APIs for common pagination patterns.
- Improve error metadata guidance and troubleshooting examples.

## Mid-Term (v1.2-v1.4)

- Add optional integration test harness for sandbox/real API validation.
- Introduce opt-in runtime validators for critical write payloads.
- Add richer analytics/catalog/audience manager surfaces as API endpoints are finalized.
- Add request-level middleware/hooks for advanced observability and custom logging.

## Long-Term (v2.0 candidates)

- Evaluate ESM-first distribution strategy with dual package support where needed.
- Consider generated endpoint clients from canonical API schema when available.
- Introduce first-class pagination iterator helpers for list endpoints.
- Evaluate breaking cleanup of deprecated aliases after migration window.

## Documentation Roadmap

- Add endpoint-by-endpoint request/response examples from real API payloads.
- Add migration guides for each minor/major release.
- Add cookbook recipes for common workflows:
  - onboarding OAuth
  - release creation and submission
  - track replacement and validations
  - preference synchronization

## Contribution Roadmap

- Add contributor conventions for endpoint additions:
  - required tests
  - required JSDoc updates
  - required docs updates
- Add release checklist automation for version bumps and changelog validation.

## Compatibility Policy (Proposed)

- Patch releases: bug fixes, type corrections, docs updates.
- Minor releases: backward-compatible endpoint/type additions.
- Major releases: breaking API surface or behavior changes, with migration docs.

## Note

Roadmap items depend on upstream Toolost API evolution and may be reprioritized.
