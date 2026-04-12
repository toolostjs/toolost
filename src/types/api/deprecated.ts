import {
  ArtistPreferencesData,
  ArtistPlatformResult,
  LabelArtistResource,
  LabelPreferencesData,
  ArtistPreferenceResource,
} from "./preferences";
import { ReleaseResource, TrackResource } from "./releases";

/** @deprecated Use `ReleaseResource` instead. */
export type ReleasePayload = ReleaseResource;

/** @deprecated Use `TrackResource` instead. */
export type TrackPayload = TrackResource;

/** @deprecated Use endpoint-specific preference response types instead. */
export type PreferencePayload =
  | ArtistPreferencesData
  | LabelPreferencesData
  | LabelArtistResource
  | ArtistPreferenceResource
  | Record<string, unknown>;

/** @deprecated Use `ArtistPlatformResult` instead. */
export type PlatformSearchResult = ArtistPlatformResult;
