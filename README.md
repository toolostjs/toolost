<div align="center">
  <img src="https://raw.githubusercontent.com/toolostjs/toolost/main/assets/toolost-sdk-logo.svg" alt="toolost sdk logo" width="120" />
  <h1>toolost</h1>
  <p>Community-baked JavaScript/TypeScript SDK for the Too Lost Developer API.</p>
  <a href="https://www.npmjs.com/package/toolost"><img src="https://img.shields.io/npm/v/toolost?style=for-the-badge&color=000000" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/toolost"><img src="https://img.shields.io/npm/dm/toolost?style=for-the-badge&color=000000" alt="npm downloads" /></a>
  <a href="https://github.com/toolostjs/toolost"><img src="https://img.shields.io/github/stars/toolostjs/toolost?style=for-the-badge&color=000000" alt="GitHub stars" /></a>
</div>

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

## Documentation

For full documentation, see the [SDK Documentation](https://toolost.js.org). This README provides a quick overview and examples to get you started. For detailed API reference, guides, and advanced usage, please refer to the SDK documentation.

## Quick Start

You need to request API access from Too Lost: https://toolost.com/developers
Once you have your client ID and secret, you can use the SDK to authenticate and make requests:

```ts
import { TooLostClient } from "toolost";

const client = new TooLostClient({
  clientId: process.env.TOOLOST_CLIENT_ID!,
  clientSecret: process.env.TOOLOST_CLIENT_SECRET,
  redirectUri: "http://localhost:3000/callback",
  scopes: ["read:profile", "read:catalog"],
  autoRefresh: true,
  retry: 2,
});

const { codeVerifier, codeChallenge } = client.oauth.generatePKCE();
const authorizationURL = client.oauth.getAuthorizationURL({
  state: "my-csrf-state",
  codeChallenge,
});

console.log("Visit:", authorizationURL);

// After redirect, exchange your authorization code:
// const token = await client.oauth.exchangeCode({ code, codeVerifier });

const me = await client.user.getMe();
console.log(me.username);
```

## Managers

```ts
client.user;
client.releases;
client.tracks;
client.preferences;
client.lookup;
```

## Type-safe Operations

```ts
import {
  CreateReleaseRequest,
  SubmitReleaseRequest,
  TrackFileKind,
} from "toolost";

const draftRelease: CreateReleaseRequest = {
  type: "Album",
  title: "Midnight Echoes",
  participants: [{ name: "Nova Waves", role: ["primary"] }],
};

const release = await client.releases.create(draftRelease);

const upload = await client.tracks.uploadURL(release.id, {
  kind: "audio" satisfies TrackFileKind,
  fileName: "track-main.flac",
  contentType: "audio/flac",
});

// Upload to `upload.uploadUrl` with raw binary via PUT, then attach fileKey:
await client.tracks.updateFile(release.id, 98341, {
  kind: "audio",
  fileKey: upload.fileKey,
});

const submitPayload: SubmitReleaseRequest = {
  acceptTerms: true,
  confirmRights: true,
  confirmYoutubeRights: true,
};

await client.releases.submit(release.id, submitPayload);
```

## OAuth

```ts
client.oauth.getAuthorizationURL(options);
client.oauth.exchangeCode(code, options);
client.oauth.refreshToken(refreshToken);
client.oauth.generatePKCE();
```

## Events

```ts
client.on("request", (event) => console.log("request", event));
client.on("response", (event) => console.log("response", event));
client.on("error", (event) => console.error("error", event));
client.on("tokenRefresh", (event) => console.log("tokenRefresh", event));
```

## Error Handling

Requests throw `TooLostAPIError` for non-2xx API responses.

```ts
import { TooLostAPIError } from "toolost";

try {
  await client.user.getMe();
} catch (error) {
  if (error instanceof TooLostAPIError) {
    console.error(error.status, error.message);
  }
}
```

## Development

```bash
pnpm install
pnpm run typecheck
pnpm run build
pnpm run test
```

## Contributing

- Contribution guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](./SECURITY.md)
- Support: [SUPPORT.md](./SUPPORT.md)

## About

This is a community-built client for the Too Lost API: https://toolost.com/developers

Not affiliated with Too Lost.
