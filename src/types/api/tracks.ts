import { TrackFileKind } from "./enums";
import { ContributorInput, TrackLyrics } from "./shared";

/** Request payload for `POST /releases/validate/isrc`. */
export interface ValidateIsrcRequest {
  isrc: string;
}

/** Request payload for `POST /releases/{releaseId}/tracks/upload-url`. */
export interface CreateTrackUploadUrlRequest {
  kind: TrackFileKind;
  fileName: string;
  contentType: "audio/flac";
}

/** Pre-signed upload response returned by `tracks/upload-url`. */
export interface TrackUploadUrlData {
  uploadUrl: string;
  fileKey: string;
  method: string;
  headers: Record<string, string>;
  expiresIn: number;
}

/** Request payload for `PATCH /releases/{releaseId}/tracks/{trackId}/file`. */
export interface ReplaceSingleTrackFileRequest {
  kind: TrackFileKind;
  fileKey: string;
}

/** Track input entry used by `PUT /releases/{releaseId}/tracks`. */
export interface ReplaceReleaseTracksTrackInput {
  title: string;
  version?: string | null;
  linerNote?: string | null;
  isrc?: string | null;
  iswc?: string | null;
  language?: string | null;
  audioFileKey?: string | null;
  instrumentalFileKey?: string | null;
  dolbyFileKey?: string | null;
  tiktokStartTime?: string | null;
  lyrics?: Partial<TrackLyrics> | null;
  aiAssisted?: boolean;
  aiAssistedFileUrl?: string | null;
  aiAssistedFileName?: string | null;
  artists?: string | ContributorInput[] | null;
  writers?: string | ContributorInput[] | null;
  credits?: string | ContributorInput[] | null;
  [key: string]: unknown;
}

/** Request payload for `PUT /releases/{releaseId}/tracks`. */
export interface ReplaceReleaseTracksRequest {
  tracks: ReplaceReleaseTracksTrackInput[];
}
