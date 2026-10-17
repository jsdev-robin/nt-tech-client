import { type SuccessResponse } from '@/lib/redux/features/types';
import { Role } from '@repo/ui/constants/role';

export interface RequestTwoFaResponse extends SuccessResponse {
  payload: {
    url: string;
    secret: string;
  };
}

export interface FindBackupResponse extends SuccessResponse {
  payload: {
    codes: string[];
  };
}

export interface TwoFaVerifyResponse extends SuccessResponse {
  payload: {
    role: Role;
  };
}
