import { UserType } from "./enums";

/** Raw user resource shape returned by `/me` (snake_case fields). */
export interface UserResource {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar: string;
  type: UserType;
  confirmed: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}
