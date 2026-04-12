/** Generic API response envelope used by most Too Lost endpoints. */
export interface APIResponse<T> {
  data: T;
}

/** Common API response shape that returns a message only. */
export interface MessageResponse {
  message: string;
}

/** Common API response shape that returns data and a message. */
export interface MessageDataResponse<T> extends APIResponse<T> {
  message: string;
}

/** Standard unauthenticated response payload. */
export interface UnauthenticatedResponse {
  message: string;
}

/** Standard validation error response payload. */
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, unknown>;
}

/** Generic `valid` payload used by UPC/ISRC validation endpoints. */
export interface ValidationResultData {
  valid: boolean;
  [key: string]: unknown;
}

/** Generic entity identifier accepted by manager methods. */
export type EntityId = string | number;

/** JSON primitive/object helper type for extensible payload sections. */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

/** JSON object helper type for extensible payload sections. */
export interface JSONObject {
  [key: string]: JSONValue;
}

/** JSON array helper type for extensible payload sections. */
export type JSONArray = JSONValue[];

/** Shared pagination options used by endpoints that expose page/perPage. */
export interface PaginationOptions {
  page?: number;
  perPage?: number;
  /** @deprecated Use `perPage` for Too Lost API v1 endpoints. */
  limit?: number;
}
