import { normalizeUserResource, User } from "../structures/User";
import { UserResource } from "../types/api";
import { BaseManager } from "./BaseManager";

/**
 * Endpoints for authenticated user profile operations.
 */
export class UserManager extends BaseManager {
  /**
   * Returns the authenticated user in the SDK's normalized camelCase model.
   */
  public async getMe(): Promise<User> {
    const resource = await this.requestData<UserResource | User>("GET", "/me");
    return normalizeUserResource(resource);
  }

  /**
   * Returns the raw user payload as provided by the API (`snake_case` keys).
   */
  public getMeRaw(): Promise<UserResource> {
    return this.requestData<UserResource>("GET", "/me");
  }
}
