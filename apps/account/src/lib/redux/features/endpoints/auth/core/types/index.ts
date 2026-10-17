import { type SuccessResponse } from '@/lib/redux/features/types';
import { Role } from '@repo/ui/constants/role';
import { type User } from './user';

export interface SignupResponse extends SuccessResponse {
  payload: {
    token: string;
  };
}

export interface SinginResponse extends SuccessResponse {
  payload: {
    role: Role;
    isEnabled: boolean;
  };
}

export interface ProfileResponse extends SuccessResponse {
  payload: {
    user: User;
  };
}
