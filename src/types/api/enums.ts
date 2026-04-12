/** Supported release statuses from the API reference. */
export type ReleaseStatus =
  | "draft"
  | "in_review"
  | "live"
  | "takedown_pending"
  | "takedown_complete";

/** Supported release types from the API reference. */
export type ReleaseType =
  | "Single"
  | "EP"
  | "Album"
  | "Compilation"
  | "MusicVideo"
  | "Music Video";

/** Track file kinds supported by upload/update endpoints. */
export type TrackFileKind = "audio" | "instrumental" | "dolby";

/** Platform values used by preference search and link endpoints. */
export type ArtistPlatform = "spotify" | "youtube" | "apple" | "audiomack";

/** Platform values for get-artist-via-url endpoint. */
export type ArtistViaUrlPlatform = "spotify" | "apple";

/** User account kind returned by the API. */
export type UserType = "artist" | "label";
