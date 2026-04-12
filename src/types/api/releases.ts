import { MessageDataResponse } from "./common";
import { ReleaseStatus, ReleaseType } from "./enums";
import {
  ContributorInput,
  ContributorResource,
  FileReference,
  MotionArtAsset,
  ReleaseReviewAttachment,
  ReleaseTime,
  TrackLyrics,
} from "./shared";

/** Motion art settings for release resources. */
export interface ReleaseMotionArt {
  motionArt1x1: unknown[];
  motionArt3x4: unknown[];
  [key: string]: unknown;
}

/** Release delivery settings returned by the API. */
export interface ReleaseDelivery {
  youtube?: boolean;
  facebook?: boolean;
  soundcloud?: boolean;
  soundExchange?: boolean;
  beatPort?: boolean;
  beatPortHasAccount?: boolean;
  beatPortLink?: string | null;
  beatPortLabelLogo?: string | null;
  junoDownloads?: boolean;
  trackLibs?: boolean;
  hook?: boolean;
  lyricfind?: boolean;
  even?: boolean;
  [key: string]: unknown;
}

/** Track resource returned by release/track endpoints. */
export interface TrackResource {
  id: number;
  title: string;
  version: string | null;
  linerNote: string | null;
  isrc: string | null;
  iswc: string | null;
  language: string | null;
  audioFileKey: string | null;
  audioUrl: string | null;
  instrumentalFileKey: string | null;
  instrumentalUrl: string | null;
  dolbyFileKey: string | null;
  dolbyUrl: string | null;
  tiktokStartTime: string | null;
  lyrics: TrackLyrics | null;
  aiAssisted: boolean | null;
  aiAssistedFileUrl: string | null;
  aiAssistedFileName: string | null;
  artists: string | ContributorResource[] | null;
  writers: string | ContributorResource[] | null;
  credits: string | ContributorResource[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  [key: string]: unknown;
}

/** Video delivery settings for release video metadata. */
export interface ReleaseVideoDelivery {
  appleMusic?: boolean;
  vevo?: boolean;
  [key: string]: unknown;
}

/** Video metadata block on a release resource. */
export interface ReleaseVideo {
  videoUrl: string | null;
  md5hash: string | null;
  videoType: string | null;
  ageRestriction: string | null;
  isCoverVersion: boolean;
  referenceUpc: string | null;
  referenceIsrc: string | null;
  metadata: unknown[];
  delivery: ReleaseVideoDelivery;
  participants: string | ContributorResource[] | null;
  writers: string | ContributorResource[] | null;
  credits: string | ContributorResource[] | null;
  [key: string]: unknown;
}

/** Full release resource returned by release endpoints. */
export interface ReleaseResource {
  id: number;
  type: ReleaseType | string;
  status: ReleaseStatus | string;
  title: string;
  upc: string | null;
  catalogNumber: string | null;
  version: string | null;
  remixTitle: string | null;
  coverSongs: string[];
  label: string | null;
  primaryGenre: string | null;
  secondaryGenre: string | null;
  language: string | null;
  releaseDate: string | null;
  originalReleaseDate: string | null;
  applePreorder: boolean | null;
  applePreorderDate: string | null;
  licenseType: string | null;
  licenseInfo: string | null;
  cYear: string | number | null;
  cLine: string | null;
  pYear: string | number | null;
  pLine: string | null;
  coverUrl: string | null;
  compressedArtwork: string | null;
  isAiGeneratedArtwork: boolean | null;
  aiContentApproved: boolean | null;
  participants: string | ContributorInput[] | null;
  releaseTime: ReleaseTime;
  motionArt: ReleaseMotionArt;
  delivery: ReleaseDelivery;
  platforms: string | string[] | null;
  territories: string | string[] | null;
  review: ReleaseReviewAttachment | null;
  aiDocumentation: FileReference | null;
  tracks: TrackResource[];
  video: ReleaseVideo | null;
  submittedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  [key: string]: unknown;
}

/** Query params accepted by `GET /releases`. */
export interface ListReleasesQuery {
  status?: ReleaseStatus | null;
  type?: ReleaseType | null;
  search?: string | null;
  page?: number | null;
  perPage?: number;
}

/** Paginated response shape returned by `GET /releases`. */
export interface ListReleasesResponse {
  data: ReleaseResource[];
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

/** Request payload for `POST /releases`. */
export interface CreateReleaseRequest {
  participants: ContributorInput[];
  title: string;
  type: ReleaseType;
  label?: string | null;
}

/** Request payload for `PATCH /releases/{releaseId}/metadata`. */
export interface UpdateReleaseMetadataRequest {
  type?: ReleaseType;
  title?: string;
  version?: string | null;
  remixTitle?: string | null;
  label?: string | null;
  primaryGenre?: string | null;
  secondaryGenre?: string | null;
  language?: string | null;
  releaseDate?: string;
  originalReleaseDate?: string | null;
  applePreorder?: boolean | null;
  applePreorderDate?: string | null;
  licenseType?: string | null;
  licenseInfo?: string | null;
  cYear?: number | string;
  cLine?: string | null;
  pYear?: number | string;
  pLine?: string | null;
  upc?: string | null;
  coverUrl?: string;
  compressedArtwork?: string;
  isAiGenerated?: boolean | null;
  releaseTime?: string | null;
  timeZone?: string | null;
  motionArt1x1?: MotionArtAsset | null;
  motionArt3x4?: MotionArtAsset | null;
  coverSongs?: string[];
  aiDocumentation?: FileReference | null;
  review?: ReleaseReviewAttachment | null;
  participants?: ContributorInput[];
  [key: string]: unknown;
}

/** Request payload for `PATCH /releases/{releaseId}/delivery`. */
export interface UpdateReleaseDeliveryRequest {
  delivery: {
    platforms?: string[];
    territories?: string[];
    additional?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

/** Request payload for `PATCH /releases/{releaseId}/video`. */
export interface UpdateReleaseVideoRequest {
  video: {
    videoUrl?: string | null;
    md5hash?: string | null;
    videoType?: string | null;
    ageRestriction?: string | null;
    isCoverVersion?: boolean;
    referenceUpc?: string | null;
    referenceIsrc?: string | null;
    metadata?: unknown[];
    delivery?: ReleaseVideoDelivery;
    participants?: string | ContributorResource[] | null;
    writers?: string | ContributorResource[] | null;
    credits?: string | ContributorResource[] | null;
    [key: string]: unknown;
  };
}

/** Request payload for `POST /releases/{releaseId}/submit`. */
export interface SubmitReleaseRequest {
  acceptTerms: boolean;
  confirmRights: boolean;
  confirmYoutubeRights?: boolean | null;
  idempotencyKey?: string | null;
}

/** Response payload returned by `POST /releases/{releaseId}/submit`. */
export interface SubmitReleaseResponse extends MessageDataResponse<ReleaseResource> {}

/** Request payload for `POST /releases/validate/upc`. */
export interface ValidateUpcRequest {
  upc: string;
  releaseId?: number | null;
}
