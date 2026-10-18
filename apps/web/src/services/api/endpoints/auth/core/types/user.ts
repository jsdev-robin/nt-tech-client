import { Role } from '@repo/ui/constants/role';

export interface User {
  id: string;
  _id: string;
  profile: {
    familyName: string;
    givenName: string;
    email: string;
    avatar?: {
      public_id: string;
      url: string;
    };
    displayName: string;
  };
  auth: {
    password?: string;
    isVerified: boolean;
    passkey: {
      isEnabled: boolean;
      enabledAt?: Date;
      count: number;
    };
    twoFa: {
      isEnabled: boolean;
      enabledAt?: Date;
    };
  };
  role: Role[];
  isActive: boolean;
  isOnline: boolean;
  isVerified: boolean;
  linkedTo: string;
}

export interface AuthState {
  token?: string;
  user?: User;
}
