/** Contributor entry used in release and track metadata payloads. */
export interface ContributorInput {
  name: string;
  role: string[];
  artistId?: number;
  [key: string]: unknown;
}

/** Contributor entry used in track and preference metadata resources. */
export interface ContributorResource {
  name: string;
  role: string | string[];
  [key: string]: unknown;
}

/** File reference object used by review and AI documentation fields. */
export interface FileReference {
  fileName: string | null;
  fileUrl: string | null;
  [key: string]: unknown;
}

/** Review attachment metadata for releases. */
export interface ReleaseReviewAttachment extends FileReference {
  note: string | null;
  fileType: string | null;
}

/** Release scheduling details. */
export interface ReleaseTime {
  time: string | null;
  timeZone: string | null;
}

/** Motion art asset descriptor. */
export interface MotionArtAsset {
  url?: string;
  md5hash?: string;
  [key: string]: unknown;
}

/** Track lyrics configuration. */
export interface TrackLyrics {
  content: string | null;
  explicit: boolean;
  cleanVersion: boolean;
  [key: string]: unknown;
}

/** Generic social links object used by preference endpoints. */
export interface SocialLinks {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  [key: string]: string | null | undefined;
}

/** Generic platform links object used by preference endpoints. */
export interface PlatformLinks {
  spotify?: string | null;
  soundcloud?: string | null;
  appleMusic?: string | null;
  youtube?: string | null;
  website?: string | null;
  [key: string]: string | null | undefined;
}

/** Extended metadata links for artist preferences. */
export interface AdditionalLinks {
  wikipedia?: string | null;
  ddex?: string | null;
  musicbrainz?: string | null;
  allmusic?: string | null;
  isni?: string | null;
  [key: string]: string | null | undefined;
}

/** Audiomack config in artist preferences. */
export interface AudiomackConfig {
  status: boolean;
  link: string | null;
  [key: string]: unknown;
}

/** Delivery settings used in artist preference resources. */
export interface ArtistPreferenceDelivery {
  beatport?: boolean;
  delivery_beatport_link?: string | null;
  delivery_youtube?: boolean;
  delivery_soundcloud?: boolean;
  delivery_soundexchange?: boolean;
  delivery_junodownload?: boolean;
  delivery_tracklib?: boolean;
  delivery_facebook?: boolean;
  delivery_hook?: boolean;
  delivery_lyricfind?: boolean;
  delivery_even?: boolean;
  [key: string]: unknown;
}

/** Metadata section used by artist preference submit payloads. */
export interface PreferenceMetadata {
  artists?: ContributorResource[];
  writers?: ContributorResource[];
  credits?: ContributorResource[];
  [key: string]: unknown;
}

/** Territory entry used by artist preference submit payloads. */
export interface TerritoryInput {
  name: string;
  code: string;
  [key: string]: unknown;
}

/** Collaborator entry used by artist preference submit payloads. */
export interface CollaboratorInput {
  name: string;
  [key: string]: unknown;
}
