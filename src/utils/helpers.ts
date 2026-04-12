import { APIResponse } from "../types/api";
import { QueryValue } from "../types/client";

/**
 * Builds an absolute URL from a base URL, path, and optional query params.
 */
export function buildURL(
  baseURL: string,
  path: string,
  query?: Record<string, QueryValue>,
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseURL.replace(/\/$/, "")}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          url.searchParams.append(key, String(item));
        }
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Unwraps API envelopes from endpoints that return `{ data: ... }`.
 */
export function unwrapData<T>(payload: APIResponse<T> | T): T {
  if (
    payload !== null &&
    typeof payload === "object" &&
    "data" in (payload as Record<string, unknown>)
  ) {
    return (payload as APIResponse<T>).data;
  }

  return payload as T;
}

/**
 * Encodes a buffer as URL-safe base64 for PKCE operations.
 */
export function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
