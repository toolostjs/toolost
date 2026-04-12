# Endpoint Matrix

This matrix maps every manager method to its HTTP method and API path.

## User

| Method            | HTTP  | Path  | Return Type    | Notes                           |
| ----------------- | ----- | ----- | -------------- | ------------------------------- |
| `user.getMe()`    | `GET` | `/me` | `User`         | Normalized camelCase structure. |
| `user.getMeRaw()` | `GET` | `/me` | `UserResource` | Raw API payload shape.          |

## Releases

| Method                                     | HTTP     | Path                             | Return Type             | Notes                                           |
| ------------------------------------------ | -------- | -------------------------------- | ----------------------- | ----------------------------------------------- |
| `releases.list(query?)`                    | `GET`    | `/releases`                      | `ListReleasesResponse`  | Query supports status/type/search/page/perPage. |
| `releases.get(releaseId)`                  | `GET`    | `/releases/{releaseId}`          | `ReleaseResource`       | Fetch a specific release.                       |
| `releases.create(data)`                    | `POST`   | `/releases`                      | `ReleaseResource`       | Create a release.                               |
| `releases.delete(releaseId)`               | `DELETE` | `/releases/{releaseId}`          | `MessageResponse`       | Delete a release.                               |
| `releases.updateMetadata(releaseId, data)` | `PATCH`  | `/releases/{releaseId}/metadata` | `ReleaseResource`       | Metadata update.                                |
| `releases.updateDelivery(releaseId, data)` | `PATCH`  | `/releases/{releaseId}/delivery` | `ReleaseResource`       | Platform/territory delivery update.             |
| `releases.updateVideo(releaseId, data)`    | `PATCH`  | `/releases/{releaseId}/video`    | `ReleaseResource`       | Video delivery update.                          |
| `releases.submit(releaseId, data)`         | `POST`   | `/releases/{releaseId}/submit`   | `SubmitReleaseResponse` | Submit release for processing/review.           |
| `releases.validateUPC(data or upc)`        | `POST`   | `/releases/validate/upc`         | `ValidationResultData`  | Overloads supported.                            |

## Tracks

| Method                                        | HTTP    | Path                                          | Return Type            | Notes                                   |
| --------------------------------------------- | ------- | --------------------------------------------- | ---------------------- | --------------------------------------- |
| `tracks.list(releaseId)`                      | `GET`   | `/releases/{releaseId}/tracks`                | `TrackResource[]`      | List tracks for release.                |
| `tracks.get(releaseId, trackId)`              | `GET`   | `/releases/{releaseId}/tracks/{trackId}`      | `TrackResource`        | Get a single track.                     |
| `tracks.uploadURL(releaseId, data)`           | `POST`  | `/releases/{releaseId}/tracks/upload-url`     | `TrackUploadUrlData`   | Pre-signed upload URL + file key.       |
| `tracks.updateFile(releaseId, trackId, data)` | `PATCH` | `/releases/{releaseId}/tracks/{trackId}/file` | `ReleaseResource`      | Attach uploaded key to track file slot. |
| `tracks.validateISRC(data or isrc)`           | `POST`  | `/releases/validate/isrc`                     | `ValidationResultData` | Overloads supported.                    |
| `tracks.replaceAll(releaseId, data)`          | `PUT`   | `/releases/{releaseId}/tracks`                | `ReleaseResource`      | Replace full release track set.         |

## Preferences

| Method                                         | HTTP   | Path                                     | Return Type                        | Notes                                       |
| ---------------------------------------------- | ------ | ---------------------------------------- | ---------------------------------- | ------------------------------------------- |
| `preferences.getArtist()`                      | `GET`  | `/preferences/artist`                    | `ArtistPreferencesData`            | Get artist preference profile.              |
| `preferences.getArtists()`                     | `GET`  | `/preferences/artists`                   | `PreferenceArtistItem[]`           | List artist options/resources.              |
| `preferences.getLabel(query?)`                 | `GET`  | `/preferences/label`                     | `LabelPreferencesData`             | Query supports search/page/perPage.         |
| `preferences.getLabelArtist(id)`               | `GET`  | `/preferences/label/artist/{id}`         | `LabelArtistResource`              | Get label-managed artist.                   |
| `preferences.searchSpotify(artist, limit?)`    | `GET`  | `/preferences/search-spotify`            | `ArtistPlatformResult[]`           | Search Spotify entities.                    |
| `preferences.searchYouTube(channel, limit?)`   | `GET`  | `/preferences/search-yt-channel`         | `ArtistPlatformResult[]`           | Search YouTube channels.                    |
| `preferences.searchApple(artist, limit?)`      | `GET`  | `/preferences/search-apple`              | `ArtistPlatformResult[]`           | Search Apple Music artists.                 |
| `preferences.getSpotifyArtist(link)`           | `GET`  | `/preferences/get-spotify-artist`        | `ArtistPlatformResult`             | Resolve Spotify artist from URL.            |
| `preferences.getYTChannel(link)`               | `GET`  | `/preferences/get-yt-channel`            | `ArtistPlatformResult`             | Resolve YouTube channel from URL.           |
| `preferences.getAppleArtist(link)`             | `GET`  | `/preferences/get-apple-artist`          | `ArtistPlatformResult`             | Resolve Apple artist from URL.              |
| `preferences.getArtistViaLink(link, platform)` | `GET`  | `/preferences/artist-via-link`           | `ArtistPlatformResult`             | Generic URL resolver for selected platform. |
| `preferences.searchArtistPlatform(data)`       | `POST` | `/preferences/search/artist-platform`    | `SearchArtistPlatformResponseData` | Unified search API.                         |
| `preferences.getArtistViaURL(data)`            | `POST` | `/preferences/artist/get-artist-via-url` | `ArtistPlatformResult`             | URL lookup API.                             |
| `preferences.submitArtist(data)`               | `POST` | `/preferences/artist/submit`             | `MessageResponse`                  | Submit artist preferences.                  |
| `preferences.submitLabel(data)`                | `POST` | `/preferences/label/submit`              | `MessageResponse`                  | Submit label preferences.                   |
| `preferences.removeLabelArtist(data or id)`    | `POST` | `/preferences/label/artist/remove`       | `MessageResponse`                  | Remove label-managed artist binding.        |

## Lookup

| Method               | HTTP  | Path                | Return Type           | Notes                  |
| -------------------- | ----- | ------------------- | --------------------- | ---------------------- |
| `lookup.countries()` | `GET` | `/lookup/countries` | `CountryResource[]`   | Country list.          |
| `lookup.platforms()` | `GET` | `/lookup/platforms` | `LookupPlatformsData` | Platform list by type. |
| `lookup.genres()`    | `GET` | `/lookup/genres`    | `string[]`            | Genre list.            |
| `lookup.languages()` | `GET` | `/lookup/languages` | `LanguageResource[]`  | Language list.         |

## Aliases

These methods are intentionally provided as naming aliases for DX and backward compatibility:

| Alias                              | Canonical Method                   |
| ---------------------------------- | ---------------------------------- |
| `releases.validateUpc(...)`        | `releases.validateUPC(...)`        |
| `tracks.uploadUrl(...)`            | `tracks.uploadURL(...)`            |
| `tracks.validateIsrc(...)`         | `tracks.validateISRC(...)`         |
| `preferences.getArtistViaUrl(...)` | `preferences.getArtistViaURL(...)` |
