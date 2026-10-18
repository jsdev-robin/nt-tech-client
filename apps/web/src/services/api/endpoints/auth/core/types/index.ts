import { type User } from './user';

export interface ProfileResponse {
  status: string;
  message: string;
  payload: {
    user: User;
  };
}
