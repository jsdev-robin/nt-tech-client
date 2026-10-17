import { type SuccessResponse } from '@/lib/redux/features/types';
import { Role } from '@repo/ui/constants/role';
import {
  type AuthenticationResponseJSON,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/browser';

export interface GenerateRegistrationResponse extends SuccessResponse {
  payload: PublicKeyCredentialCreationOptionsJSON;
}

export interface verifyRegistrationRequest {
  response: RegistrationResponseJSON;
}

export interface GenerateAuthenticationResponse extends SuccessResponse {
  payload: {
    options: PublicKeyCredentialRequestOptionsJSON;
    email: string;
  };
}

export interface VerifyAuthenticationResponse extends SuccessResponse {
  payload: {
    role: Role;
  };
}

export interface VerifyAuthenticationRequest {
  response: AuthenticationResponseJSON;
}

export interface PasskeyResponse extends SuccessResponse {
  payload: {
    passkeys: {
      _id: string;
      device: string;
      browser: string;
      transports: string[];
      lastUsed: string;
      counter: string;
      createdAt: string;
      os: string;
    }[];
  };
}

export interface GenerateReauthenticationResponse extends SuccessResponse {
  payload: {
    options: PublicKeyCredentialRequestOptionsJSON;
    email: string;
  };
}

export interface VerifyReauthenticationRequest {
  response: AuthenticationResponseJSON;
}
