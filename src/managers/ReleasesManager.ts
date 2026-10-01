import {
  CreateReleaseRequest,
  EntityId,
  ListReleasesQuery,
  ListReleasesResponse,
  MessageResponse,
  ReleaseResource,
  SubmitReleaseRequest,
  SubmitReleaseResponse,
  UpdateReleaseDeliveryRequest,
  UpdateReleaseMetadataRequest,
  UpdateReleaseVideoRequest,
  ValidateUpcRequest,
  ValidationResultData,
} from "../types/api";
import { BaseManager } from "./BaseManager";

/**
 * Endpoints for release lifecycle management.
 */
export class ReleasesManager extends BaseManager {
  /**
   * Returns paginated releases owned by the authenticated user.
   */
  public list(query: ListReleasesQuery = {}): Promise<ListReleasesResponse> {
    return this.request<ListReleasesResponse>("GET", "/releases", {
      query: {
        status: query.status,
        type: query.type,
        search: query.search,
        page: query.page,
        perPage: query.perPage,
      },
    });
  }

  /**
   * Returns a single release by its ID.
   */
  public get(releaseId: EntityId): Promise<ReleaseResource> {
    return this.requestData<ReleaseResource>("GET", `/releases/${releaseId}`);
  }

  /**
   * Creates a new draft release.
   */
  public create(data: CreateReleaseRequest): Promise<ReleaseResource> {
    return this.requestData<ReleaseResource>("POST", "/releases", {
      body: data,
    });
  }

  /**
   * Deletes a draft release.
   */
  public delete(releaseId: EntityId): Promise<MessageResponse> {
    return this.request<MessageResponse>("DELETE", `/releases/${releaseId}`);
  }

  /**
   * Updates release-level metadata for a draft release.
   */
  public updateMetadata(
    releaseId: EntityId,
    data: UpdateReleaseMetadataRequest,
  ): Promise<ReleaseResource> {
    return this.requestData<ReleaseResource>(
      "PATCH",
      `/releases/${releaseId}/metadata`,
      {
        body: data,
      },
    );
  }

  /**
   * Updates release delivery/platform settings for a draft release.
   */
  public updateDelivery(
    releaseId: EntityId,
    data: UpdateReleaseDeliveryRequest,
  ): Promise<ReleaseResource> {
    return this.requestData<ReleaseResource>(
      "PATCH",
      `/releases/${releaseId}/delivery`,
      {
        body: data,
      },
    );
  }

  /**
   * Updates music video metadata for a draft release.
   */
  public updateVideo(
    releaseId: EntityId,
    data: UpdateReleaseVideoRequest,
  ): Promise<ReleaseResource> {
    return this.requestData<ReleaseResource>(
      "PATCH",
      `/releases/${releaseId}/video`,
      {
        body: data,
      },
    );
  }

  /**
   * Submits a draft release for review.
   */
  public submit(
    releaseId: EntityId,
    data: SubmitReleaseRequest,
  ): Promise<SubmitReleaseResponse> {
    return this.request<SubmitReleaseResponse>(
      "POST",
      `/releases/${releaseId}/submit`,
      {
        body: data,
      },
    );
  }

  /**
   * Validates UPC format and uniqueness.
   */
  public validateUPC(data: ValidateUpcRequest): Promise<ValidationResultData>;
  public validateUPC(
    upc: string,
    releaseId?: EntityId,
  ): Promise<ValidationResultData>;
  public validateUPC(
    firstArg: ValidateUpcRequest | string,
    secondArg?: EntityId,
  ): Promise<ValidationResultData> {
    const payload: ValidateUpcRequest =
      typeof firstArg === "string"
        ? { upc: firstArg, releaseId: secondArg ? Number(secondArg) : null }
        : firstArg;

    return this.requestData<ValidationResultData>(
      "POST",
      "/releases/validate/upc",
      {
        body: payload,
      },
    );
  }

  /**
   * Alias for `validateUPC` with camelCase naming.
   */
  public validateUpc(
    firstArg: ValidateUpcRequest | string,
    secondArg?: EntityId,
  ): Promise<ValidationResultData> {
    if (typeof firstArg === "string") {
      return this.validateUPC(firstArg, secondArg);
    }

    return this.validateUPC(firstArg);
  }
}
