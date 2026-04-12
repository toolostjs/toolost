import { UserResource, UserType } from "../types/api";

/**
 * Normalized user model exposed by the SDK.
 *
 * Unlike the raw API payload, this model uses camelCase keys for
 * a more idiomatic TypeScript developer experience.
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  type: UserType;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Converts a raw `/me` resource into the normalized SDK `User` shape.
 *
 * The API currently returns snake_case keys for this endpoint.
 */
export function normalizeUserResource(resource: UserResource | User): User {
  const maybeSnake = resource as UserResource;
  const maybeCamel = resource as User;

  if (typeof maybeSnake.first_name === "string") {
    return {
      id: maybeSnake.id,
      firstName: maybeSnake.first_name,
      lastName: maybeSnake.last_name,
      username: maybeSnake.username,
      email: maybeSnake.email,
      avatar: maybeSnake.avatar,
      type: maybeSnake.type,
      confirmed: maybeSnake.confirmed,
      createdAt: maybeSnake.created_at,
      updatedAt: maybeSnake.updated_at,
    };
  }

  return {
    id: maybeCamel.id,
    firstName: maybeCamel.firstName,
    lastName: maybeCamel.lastName,
    username: maybeCamel.username,
    email: maybeCamel.email,
    avatar: maybeCamel.avatar,
    type: maybeCamel.type,
    confirmed: maybeCamel.confirmed,
    createdAt: maybeCamel.createdAt,
    updatedAt: maybeCamel.updatedAt,
  };
}
