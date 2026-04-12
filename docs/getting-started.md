# Getting Started

## Prerequisites

- Node.js with global `fetch` support (Node 18+ recommended).
- A Toolost OAuth application with:
  - `clientId`
  - optional `clientSecret` (PKCE public clients may omit it)
  - `redirectUri`

## Installation

```bash
npm install toolost
# or
yarn add toolost
# or
pnpm add toolost
# or
bun add toolost
```

## Create a Client

```ts
import { TooLostClient } from "toolost";

const client = new TooLostClient({
  clientId: process.env.TOOLOST_CLIENT_ID!,
  clientSecret: process.env.TOOLOST_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/callback",
  scopes: ["read:profile", "read:releases", "write:releases"],
  autoRefresh: true,
  retry: 2,
});
```

## OAuth + PKCE Flow

### 1) Generate PKCE values and auth URL

```ts
const { codeVerifier, codeChallenge } = client.oauth.generatePKCE();

const authorizationURL = client.oauth.getAuthorizationURL({
  state: "csrf-token",
  codeChallenge,
});
```

### 2) Exchange code for tokens

```ts
const token = await client.oauth.exchangeCode({
  code: "AUTHORIZATION_CODE",
  codeVerifier,
});

// Tokens are automatically applied to the client by OAuthManager -> TooLostClient.
```

### 3) Use authenticated managers

```ts
const me = await client.user.getMe();
const releases = await client.releases.list({ page: 1, perPage: 20 });
```

## Core Usage Examples

### User profile

```ts
const normalized = await client.user.getMe();
const raw = await client.user.getMeRaw();
```

### Create and submit a release

```ts
const release = await client.releases.create({
  type: "Album",
  title: "Midnight Echoes",
  participants: [{ name: "Nova Waves", role: ["primary"] }],
});

await client.releases.submit(release.id, {
  acceptTerms: true,
  confirmRights: true,
  confirmYoutubeRights: true,
});
```

### Track upload lifecycle

```ts
const upload = await client.tracks.uploadURL(release.id, {
  kind: "audio",
  fileName: "track-main.flac",
  contentType: "audio/flac",
});

// Upload binary data to upload.uploadUrl via external PUT request.

await client.tracks.updateFile(release.id, 98341, {
  kind: "audio",
  fileKey: upload.fileKey,
});
```

### Preferences search

```ts
const spotifyMatches = await client.preferences.searchSpotify("Nova Waves", 5);

const unified = await client.preferences.searchArtistPlatform({
  platform: "spotify",
  term: "Nova Waves",
  limit: 5,
});
```

## Helpful Runtime Features

- Automatic bearer token injection.
- Optional auto-refresh behavior when token expiry is known.
- 401 refresh-and-retry behavior when `refreshToken` exists.
- Retry for transient failures (`>=500`, `429`, and network errors).
- Event hooks for request/response/error/token refresh.
