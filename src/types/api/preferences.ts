import { EntityId, MessageResponse, PaginationOptions } from "./common";
import { ArtistPlatform, ArtistViaUrlPlatform } from "./enums";
import {
  AdditionalLinks,
  ArtistPreferenceDelivery,
  AudiomackConfig,
  CollaboratorInput,
  ContributorResource,
  PlatformLinks,
  PreferenceMetadata,
  SocialLinks,
  TerritoryInput,
} from "./shared";

/** Artist preference resource returned by preference endpoints. */
export interface ArtistPreferenceResource {
  id: number;
  artistName: string;
  primaryGenre: string | null;
  secondaryGenre: string | null;
  language: string | null;
  about: string | null;
  profileImg: string | null;
  social: SocialLinks;
  platforms: PlatformLinks;
  additional: AdditionalLinks;
  deliveries: ArtistPreferenceDelivery;
  releaseTime: string | null;
  timeZone: string | null;
  label: string | null;
  cLine: string | null;
  pLine: string | null;
  audiomack: AudiomackConfig;
  stores: Record<string, unknown>;
  territories: string | Record<string, unknown>[];
  defaultRoles: string | Record<string, unknown>[];
  collaborators: string | Record<string, unknown>[];
  [key: string]: unknown;
}

/** Response data for `GET /preferences/artist`. */
export interface ArtistPreferencesData {
  artist: ArtistPreferenceResource;
  releaseCount: number;
}

/** Role item returned by `GET /preferences/artists`. */
export interface ArtistDefaultRole {
  id: number;
  artist_id: number;
  name: string;
  type: string;
  spotify_link: string | null;
  default: boolean;
  [key: string]: unknown;
}

/** Artist item returned by `GET /preferences/artists`. */
export interface PreferenceArtistItem {
  id: number;
  artist_name: string;
  default_roles: ArtistDefaultRole[];
  [key: string]: unknown;
}

/** Label preference resource returned by preference endpoints. */
export interface LabelPreferenceResource {
  id: number;
  name: string;
  about: string | null;
  profileImg: string | null;
  social: SocialLinks;
  platforms: {
    website?: string | null;
    [key: string]: string | null | undefined;
  };
  [key: string]: unknown;
}

/** Artist item returned inside label preference responses. */
export interface LabelArtistResource {
  id: number;
  artistName: string;
  primaryGenre: string | null;
  secondaryGenre: string | null;
  language: string | null;
  profileImg: string | null;
  stores: Record<string, unknown>;
  territories: string | Record<string, unknown>[];
  defaultRoles: string | Record<string, unknown>[];
  [key: string]: unknown;
}

/** Query params accepted by `GET /preferences/label`. */
export interface LabelPreferencesQuery extends PaginationOptions {
  search?: string | null;
}

/** Response data for `GET /preferences/label`. */
export interface LabelPreferencesData {
  label: LabelPreferenceResource;
  artists: LabelArtistResource[];
}

/** Generic platform artist result shape used in search endpoints. */
export interface ArtistPlatformResult {
  name: string;
  url: string;
  image: string;
  id: string;
  followers?: number;
  type?: string;
  [key: string]: unknown;
}

/** Request body for `POST /preferences/search/artist-platform`. */
export interface SearchArtistPlatformRequest {
  platform: ArtistPlatform;
  term: string;
  limit?: number;
}

/** Response data for `POST /preferences/search/artist-platform`. */
export interface SearchArtistPlatformResponseData {
  platform: ArtistPlatform | string;
  results: ArtistPlatformResult[];
}

/** Request body for `POST /preferences/artist/get-artist-via-url`. */
export interface GetArtistViaUrlRequest {
  name: string;
  platform: ArtistViaUrlPlatform;
  url: string;
}

/** Request body for `POST /preferences/artist/submit`. */
export interface SubmitArtistPreferenceRequest {
  artistName: string;
  metadata: PreferenceMetadata;
  id?: number | null;
  primaryGenre?: string | null;
  secondaryGenre?: string | null;
  language?: string | null;
  about?: string | null;
  img?: string | null;
  removeImg?: boolean | null;
  releaseTime?: string | null;
  timeZone?: string | null;
  label?: string | null;
  c_line?: string | null;
  p_line?: string | null;
  stores?: string[];
  social?: SocialLinks;
  platforms?: PlatformLinks;
  additional?: AdditionalLinks;
  deliveries?: ArtistPreferenceDelivery;
  audiomack?: AudiomackConfig;
  territories?: TerritoryInput[];
  collaborators?: CollaboratorInput[];
  [key: string]: unknown;
}

/** Request body for `POST /preferences/label/submit`. */
export interface SubmitLabelPreferenceRequest {
  name: string;
  about?: string | null;
  img?: string | null;
  removeImg?: boolean | null;
  social?: SocialLinks;
  platforms?: {
    website?: string | null;
    [key: string]: string | null | undefined;
  };
}

/** Request body for `POST /preferences/label/artist/remove`. */
export interface RemoveLabelArtistRequest {
  id: EntityId;
}
