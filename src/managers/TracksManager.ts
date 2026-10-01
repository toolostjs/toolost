import {
  CreateTrackUploadUrlRequest,
  EntityId,
  ReleaseResource,
  ReplaceReleaseTracksRequest,
  ReplaceReleaseTracksTrackInput,
  ReplaceSingleTrackFileRequest,
  TrackResource,
  TrackUploadUrlData,
  ValidateIsrcRequest,
  ValidationResultData,
} from "../types/api";
import { BaseManager } from "./BaseManager";

/**
 * Endpoints for track-level release operations.
 */
export class TracksManager extends BaseManager {
  /**
   * Returns all tracks for a release.
   */
  public list(releaseId: EntityId): Promise<TrackResource[]> {
    return this.requestData<TrackResource[]>(
      "GET",
      `/releases/${releaseId}/tracks`,
    );
  }

  /**
   * Returns a single track from a release.
   */
  public get(releaseId: EntityId, trackId: EntityId): Promise<TrackResource> {
    return this.requestData<TrackResource>(
      "GET",
      `/releases/${releaseId}/tracks/${trackId}`,
    );
  }

  /**
   * Creates a pre-signed upload URL for track file uploads.
   */
  public uploadURL(
    releaseId: EntityId,
    data: CreateTrackUploadUrlRequest,
  ): Promise<TrackUploadUrlData> {
    return this.requestData<TrackUploadUrlData>(
      "POST",
      `/releases/${releaseId}/tracks/upload-url`,
      {
        body: data,
      },
    );
  }

  /**
   * Alias for `uploadURL` with camelCase naming.
   */
  public uploadUrl(
    releaseId: EntityId,
    data: CreateTrackUploadUrlRequest,
  ): Promise<TrackUploadUrlData> {
    return this.uploadURL(releaseId, data);
  }

  /**
   * Replaces a single track file using a previously uploaded `fileKey`.
   */
  public updateFile(
    releaseId: EntityId,
    trackId: EntityId,
    data: ReplaceSingleTrackFileRequest,
  ): Promise<ReleaseResource> {
    return this.requestData<ReleaseResource>(
      "PATCH",
      `/releases/${releaseId}/tracks/${trackId}/file`,
      {
        body: data,
      },
    );
  }

  /**
   * Validates ISRC format and uniqueness.
   */
  public validateISRC(data: ValidateIsrcRequest): Promise<ValidationResultData>;
  public validateISRC(isrc: string): Promise<ValidationResultData>;
  public validateISRC(
    arg: ValidateIsrcRequest | string,
  ): Promise<ValidationResultData> {
    const payload: ValidateIsrcRequest =
      typeof arg === "string" ? { isrc: arg } : arg;

    return this.requestData<ValidationResultData>(
      "POST",
      "/releases/validate/isrc",
      {
        body: payload,
      },
    );
  }

  /**
   * Alias for `validateISRC` with camelCase naming.
   */
  public validateIsrc(
    arg: ValidateIsrcRequest | string,
  ): Promise<ValidationResultData> {
    if (typeof arg === "string") {
      return this.validateISRC(arg);
    }

    return this.validateISRC(arg);
  }

  /**
   * Replaces a release tracklist.
   */
  public replaceAll(
    releaseId: EntityId,
    data: ReplaceReleaseTracksRequest | ReplaceReleaseTracksTrackInput[],
  ): Promise<ReleaseResource> {
    const payload: ReplaceReleaseTracksRequest = Array.isArray(data)
      ? { tracks: data }
      : data;

    return this.requestData<ReleaseResource>(
      "PUT",
      `/releases/${releaseId}/tracks`,
      {
        body: payload,
      },
    );
  }
}
