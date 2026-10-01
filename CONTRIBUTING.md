# Contributing to toolost

Thank you for investing time in the project.

## Before you start

- Read the [Code of Conduct](./CODE_OF_CONDUCT.md).
- Search existing issues before opening a new one.
- For larger changes, open an issue first to align on approach.

## Development setup

### Prerequisites

- Node.js 20+
- pnpm 9+

### Install dependencies

```bash
pnpm install
```

### Useful commands

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
```

## Pull requests

1. Fork the repository and create a topic branch from `main`.
2. Keep changes focused and include tests when behavior changes.
3. Ensure lint, typecheck, tests, and build pass locally.
4. Fill out the pull request template completely.
5. Link related issues in your PR description.

## Commit messages

Use clear, imperative commit messages that describe intent.

Examples:

- `fix: guard missing OAuth token in refresh flow`
- `feat: add release lookup helper`
- `docs: clarify token refresh behavior`

## Releases

Releases are published from GitHub Releases via workflow automation:

- Stable release (`prerelease: false`) publishes to npm with `latest` tag.
- Pre-release (`prerelease: true`) publishes to npm with `dev` tag.

Make sure the GitHub release tag matches `package.json` version (for example,
`v1.2.3` for `1.2.3`).
