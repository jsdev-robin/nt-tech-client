import { gatewayApi } from '@/lib/redux/features/api/gatewayApi';
import { type SuccessResponse } from '@/lib/redux/features/types';
import { type PasskeySigninInput } from '@/validations/ZAuthSchema';
import {
  type GenerateAuthenticationResponse,
  type GenerateReauthenticationResponse,
  type GenerateRegistrationResponse,
  type PasskeyResponse,
  type VerifyAuthenticationRequest,
  type VerifyAuthenticationResponse,
  type VerifyReauthenticationRequest,
  type verifyRegistrationRequest,
} from './types';

export const authPasskeyApi = gatewayApi.injectEndpoints({
  endpoints: (builder) => ({
    generateRegistration: builder.mutation<GenerateRegistrationResponse, void>({
      query: () => ({
        url: '/auth/passkey/registration/generate',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    verifyRegistration: builder.mutation<
      SuccessResponse,
      verifyRegistrationRequest
    >({
      query: ({ response }) => ({
        url: '/auth/passkey/registration/verify',
        method: 'POST',
        body: { response },
      }),
      invalidatesTags: ['User', 'Passkeys'],
    }),

    generateAuthentication: builder.mutation<
      GenerateAuthenticationResponse,
      PasskeySigninInput
    >({
      query: ({ email }) => ({
        url: '/auth/passkey/authentication/generate',
        method: 'POST',
        body: { email },
      }),
    }),

    verifyAuthentication: builder.mutation<
      VerifyAuthenticationResponse,
      VerifyAuthenticationRequest
    >({
      query: ({ response }) => ({
        url: '/auth/passkey/authentication/verify',
        method: 'POST',
        body: { response },
      }),
    }),

    findPasskeys: builder.query<PasskeyResponse, void>({
      query: () => ({
        url: '/auth/passkey',
        method: 'GET',
      }),
      providesTags: ['Passkeys'],
    }),

    unregisterPasskey: builder.mutation<void, string>({
      query: (id) => ({
        url: `/auth/passkey/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Passkeys', 'User'],
    }),

    generatReauthentication: builder.mutation<
      GenerateReauthenticationResponse,
      void
    >({
      query: () => ({
        url: '/auth/passkey/reauth/registration/generate',
        method: 'POST',
      }),
    }),

    verifyReuthentication: builder.mutation<
      SuccessResponse,
      VerifyReauthenticationRequest
    >({
      query: ({ response }) => ({
        url: '/auth/passkey/reauth/registration/verify',
        method: 'POST',
        body: { response },
      }),
    }),
  }),
});

export const {
  useGenerateRegistrationMutation,
  useVerifyRegistrationMutation,
  useGenerateAuthenticationMutation,
  useVerifyAuthenticationMutation,
  useFindPasskeysQuery,
  useUnregisterPasskeyMutation,
  useGeneratReauthenticationMutation,
  useVerifyReuthenticationMutation,
} = authPasskeyApi;
