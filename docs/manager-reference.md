# Manager Reference

This section documents all current manager methods and endpoint mappings.

## UserManager

### `getMe`

```ts
getMe(): Promise<User>
```

- Endpoint: `GET /me`
- Returns normalized camelCase `User`.

### `getMeRaw`

```ts
getMeRaw(): Promise<UserResource>
```

- Endpoint: `GET /me`
- Returns raw API shape (`snake_case` user fields).

## ReleasesManager

### `list`

```ts
list(query?: ListReleasesQuery): Promise<ListReleasesResponse>
```

- Endpoint: `GET /releases`
- Query: `status`, `type`, `search`, `page`, `perPage`

### `get`

```ts
get(releaseId: EntityId): Promise<ReleaseResource>
```

- Endpoint: `GET /releases/{releaseId}`

### `create`

```ts
create(data: CreateReleaseRequest): Promise<ReleaseResource>
```

- Endpoint: `POST /releases`

### `delete`

```ts
delete(releaseId: EntityId): Promise<MessageResponse>
```

- Endpoint: `DELETE /releases/{releaseId}`

### `updateMetadata`

```ts
updateMetadata(releaseId: EntityId, data: UpdateReleaseMetadataRequest): Promise<ReleaseResource>
```

- Endpoint: `PATCH /releases/{releaseId}/metadata`

### `updateDelivery`

```ts
updateDelivery(releaseId: EntityId, data: UpdateReleaseDeliveryRequest): Promise<ReleaseResource>
```

- Endpoint: `PATCH /releases/{releaseId}/delivery`

### `updateVideo`

```ts
updateVideo(releaseId: EntityId, data: UpdateReleaseVideoRequest): Promise<ReleaseResource>
```

- Endpoint: `PATCH /releases/{releaseId}/video`

### `submit`

```ts
submit(releaseId: EntityId, data: SubmitReleaseRequest): Promise<SubmitReleaseResponse>
```

- Endpoint: `POST /releases/{releaseId}/submit`

### `validateUPC` / `validateUpc`

```ts
validateUPC(data: ValidateUpcRequest): Promise<ValidationResultData>
validateUPC(upc: string, releaseId?: EntityId): Promise<ValidationResultData>
validateUpc(firstArg: ValidateUpcRequest | string, secondArg?: EntityId): Promise<ValidationResultData>
```

- Endpoint: `POST /releases/validate/upc`
- `validateUpc` is an alias.

## TracksManager

### `list`

```ts
list(releaseId: EntityId): Promise<TrackResource[]>
```

- Endpoint: `GET /releases/{releaseId}/tracks`

### `get`

```ts
get(releaseId: EntityId, trackId: EntityId): Promise<TrackResource>
```

- Endpoint: `GET /releases/{releaseId}/tracks/{trackId}`

### `uploadURL` / `uploadUrl`

```ts
uploadURL(releaseId: EntityId, data: CreateTrackUploadUrlRequest): Promise<TrackUploadUrlData>
uploadUrl(releaseId: EntityId, data: CreateTrackUploadUrlRequest): Promise<TrackUploadUrlData>
```

- Endpoint: `POST /releases/{releaseId}/tracks/upload-url`
- `uploadUrl` is an alias.

### `updateFile`

```ts
updateFile(releaseId: EntityId, trackId: EntityId, data: ReplaceSingleTrackFileRequest): Promise<ReleaseResource>
```

- Endpoint: `PATCH /releases/{releaseId}/tracks/{trackId}/file`

### `validateISRC` / `validateIsrc`

```ts
validateISRC(data: ValidateIsrcRequest): Promise<ValidationResultData>
validateISRC(isrc: string): Promise<ValidationResultData>
validateIsrc(arg: ValidateIsrcRequest | string): Promise<ValidationResultData>
```

- Endpoint: `POST /releases/validate/isrc`
- `validateIsrc` is an alias.

### `replaceAll`

```ts
replaceAll(
  releaseId: EntityId,
  data: ReplaceReleaseTracksRequest | ReplaceReleaseTracksTrackInput[],
): Promise<ReleaseResource>
```

- Endpoint: `PUT /releases/{releaseId}/tracks`

## PreferencesManager

### `getArtist`

```ts
getArtist(): Promise<ArtistPreferencesData>
```

- Endpoint: `GET /preferences/artist`

### `getArtists`

```ts
getArtists(): Promise<PreferenceArtistItem[]>
```

- Endpoint: `GET /preferences/artists`

### `getLabel`

```ts
getLabel(query?: LabelPreferencesQuery): Promise<LabelPreferencesData>
```

- Endpoint: `GET /preferences/label`
- Query supports `search`, `page`, `perPage` (or legacy `limit`).

### `getLabelArtist`

```ts
getLabelArtist(id: EntityId): Promise<LabelArtistResource>
```

- Endpoint: `GET /preferences/label/artist/{id}`

### Search methods

```ts
searchSpotify(artist: string, limit?: number): Promise<ArtistPlatformResult[]>
searchYouTube(channel: string, limit?: number): Promise<ArtistPlatformResult[]>
searchApple(artist: string, limit?: number): Promise<ArtistPlatformResult[]>
```

- Endpoints:
  - `GET /preferences/search-spotify`
  - `GET /preferences/search-yt-channel`
  - `GET /preferences/search-apple`

### Platform profile resolution

```ts
getSpotifyArtist(link: string): Promise<ArtistPlatformResult>
getYTChannel(link: string): Promise<ArtistPlatformResult>
getAppleArtist(link: string): Promise<ArtistPlatformResult>
getArtistViaLink(link: string, platform: ArtistPlatform): Promise<ArtistPlatformResult>
```

- Endpoints:
  - `GET /preferences/get-spotify-artist`
  - `GET /preferences/get-yt-channel`
  - `GET /preferences/get-apple-artist`
  - `GET /preferences/artist-via-link`

### Unified search and URL lookup

```ts
searchArtistPlatform(data: SearchArtistPlatformRequest): Promise<SearchArtistPlatformResponseData>
getArtistViaURL(data: GetArtistViaUrlRequest): Promise<ArtistPlatformResult>
getArtistViaUrl(data: GetArtistViaUrlRequest): Promise<ArtistPlatformResult>
```

- Endpoints:
  - `POST /preferences/search/artist-platform`
  - `POST /preferences/artist/get-artist-via-url`
- `getArtistViaUrl` is an alias.

### Submit/update preferences

```ts
submitArtist(data: SubmitArtistPreferenceRequest): Promise<MessageResponse>
submitLabel(data: SubmitLabelPreferenceRequest): Promise<MessageResponse>
```

- Endpoints:
  - `POST /preferences/artist/submit`
  - `POST /preferences/label/submit`

### Remove label-managed artist

```ts
removeLabelArtist(data: RemoveLabelArtistRequest | EntityId): Promise<MessageResponse>
```

- Endpoint: `POST /preferences/label/artist/remove`

## LookupManager

### `countries`

```ts
countries(): Promise<CountryResource[]>
```

- Endpoint: `GET /lookup/countries`

### `platforms`

```ts
platforms(): Promise<LookupPlatformsData>
```

- Endpoint: `GET /lookup/platforms`

### `genres`

```ts
genres(): Promise<string[]>
```

- Endpoint: `GET /lookup/genres`

### `languages`

```ts
languages(): Promise<LanguageResource[]>
```

- Endpoint: `GET /lookup/languages`
