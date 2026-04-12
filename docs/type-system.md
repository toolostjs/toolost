# Type System

The SDK exports a fully typed API surface from `src/index.ts`, including:

- manager request/response contracts
- client runtime event and request types
- OAuth request/token types
- normalized and raw user models

## Public Type Export Surface

### API contracts

```ts
export type * from "./types/api";
```

This includes all exports from:

- `src/types/api/common.ts`
- `src/types/api/enums.ts`
- `src/types/api/shared.ts`
- `src/types/api/user.ts`
- `src/types/api/releases.ts`
- `src/types/api/tracks.ts`
- `src/types/api/preferences.ts`
- `src/types/api/lookup.ts`
- `src/types/api/deprecated.ts`

### Client types

From `src/types/client.ts`:

- `TooLostClientOptions`
- `RequestEvent`
- `ResponseEvent`
- `ErrorEvent`
- `TokenRefreshEvent`
- `HTTPMethod`
- `QueryPrimitive`
- `QueryValue`
- `RequestOptions`

### OAuth types

From `src/types/oauth.ts`:

- `Scope`
- `AuthorizationURLOptions`
- `ExchangeCodeOptions`
- `PKCEPair`
- `TokenResponse`
- `TokenRequestOptions`

### Normalized user model

```ts
export type { User } from "./structures/User";
```

`User` is the camelCase projection of `UserResource`.

## API Types by Module

## `common.ts`

Core envelope and primitive utility types:

- `APIResponse<T>`
- `MessageResponse`
- `MessageDataResponse<T>`
- `UnauthenticatedResponse`
- `ValidationErrorResponse`
- `ValidationResultData`
- `EntityId`
- `JSONValue`, `JSONObject`, `JSONArray`
- `PaginationOptions`

## `enums.ts`

Domain unions:

- `ReleaseStatus`
- `ReleaseType`
- `TrackFileKind`
- `ArtistPlatform`
- `ArtistViaUrlPlatform`
- `UserType`

## `shared.ts`

Reusable nested structures used by release and preference payloads:

- contributors and collaborator inputs
- file references and review assets
- track lyrics
- social/platform links
- artist delivery config
- preference metadata
- territory/collaborator inputs

Representative exports:

- `ContributorInput`, `ContributorResource`
- `FileReference`, `ReleaseReviewAttachment`
- `TrackLyrics`
- `SocialLinks`, `PlatformLinks`, `AdditionalLinks`
- `AudiomackConfig`, `ArtistPreferenceDelivery`
- `PreferenceMetadata`
- `TerritoryInput`, `CollaboratorInput`

## `user.ts`

- `UserResource` (raw API shape)

## `releases.ts`

Release and release-track-related contracts:

- `ReleaseResource`
- `TrackResource`
- `ListReleasesQuery`, `ListReleasesResponse`
- `CreateReleaseRequest`
- `UpdateReleaseMetadataRequest`
- `UpdateReleaseDeliveryRequest`
- `UpdateReleaseVideoRequest`
- `SubmitReleaseRequest`, `SubmitReleaseResponse`
- `ValidateUpcRequest`

## `tracks.ts`

Track-focused write and validation contracts:

- `ValidateIsrcRequest`
- `CreateTrackUploadUrlRequest`
- `TrackUploadUrlData`
- `ReplaceSingleTrackFileRequest`
- `ReplaceReleaseTracksTrackInput`
- `ReplaceReleaseTracksRequest`

## `preferences.ts`

Preference and platform-discovery contracts:

- `ArtistPreferenceResource`, `ArtistPreferencesData`
- `PreferenceArtistItem`
- `LabelPreferenceResource`, `LabelArtistResource`
- `LabelPreferencesQuery`, `LabelPreferencesData`
- `ArtistPlatformResult`
- `SearchArtistPlatformRequest`, `SearchArtistPlatformResponseData`
- `GetArtistViaUrlRequest`
- `SubmitArtistPreferenceRequest`
- `SubmitLabelPreferenceRequest`
- `RemoveLabelArtistRequest`

## `lookup.ts`

Lookup result models:

- `CountryResource`
- `LanguageResource`
- `LookupPlatformsData`

## Deprecated Aliases

For compatibility, legacy aliases are exported from `deprecated.ts`:

- `ReleasePayload` -> `ReleaseResource`
- `TrackPayload` -> `TrackResource`
- `PreferencePayload` -> `ArtistPreferenceResource | LabelPreferenceResource`
- `PlatformSearchResult` -> `ArtistPlatformResult`

## Type Design Notes

- Request methods are strongly typed per manager operation.
- Envelope unwrapping (`requestData`) means many manager methods return concrete payload types instead of `APIResponse<T>`.
- Query options accept primitive, array, null, and undefined values via `QueryValue`.
- API payloads remain close to server shape while normalized structures are offered where it improves DX (`User`).
