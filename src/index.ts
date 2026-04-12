export { TooLostClient } from "./client/TooLostClient";
export { OAuthManager } from "./oauth/OAuthManager";
export { TooLostAPIError } from "./utils/errors";

export { UserManager } from "./managers/UserManager";
export { ReleasesManager } from "./managers/ReleasesManager";
export { TracksManager } from "./managers/TracksManager";
export { PreferencesManager } from "./managers/PreferencesManager";
export { LookupManager } from "./managers/LookupManager";

export { normalizeUserResource } from "./structures/User";
export type { User } from "./structures/User";

export type * from "./types/api";

export type {
  ErrorEvent,
  RequestEvent,
  ResponseEvent,
  TokenRefreshEvent,
  TooLostClientOptions,
} from "./types/client";

export type {
  AuthorizationURLOptions,
  ExchangeCodeOptions,
  PKCEPair,
  Scope,
  TokenRequestOptions,
  TokenResponse,
} from "./types/oauth";
