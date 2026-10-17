import { Role } from '@repo/ui/constants/role';

export interface Session {
  token: string;
  deviceInfo: {
    deviceType: string;
    os: string;
    browser: string;
    userAgent: string;
  };
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  ip: string;
  status: boolean;
  loggedInAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

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
