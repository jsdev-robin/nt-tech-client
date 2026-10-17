import { gatewayApi } from '@/lib/redux/features/api/gatewayApi';
import { type SuccessResponse } from '@/lib/redux/features/types';
import {
  type ChangePasswordInput,
  type ConfirmEmailChangeInput,
  type ForgotPasswordInput,
  type ProfileInput,
  type ReauthInput,
  type RequestEmailChangeInput,
  type ResetPasswordInput,
  type SigninInput,
  type SignoutSessionInput,
  type SignupInput,
  type VerifyInput,
} from '@/validations/ZAuthSchema';
import { signup } from './authSlice';
import {
  type ProfileResponse,
  type SignupResponse,
  type SinginResponse,
} from './types';

export const userAuthApi = gatewayApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupInput>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(signup({ token: data.payload.token }));
        } catch (error) {
          console.log('Signup error:', error);
        }
      },
    }),

    verify: builder.mutation<SuccessResponse, VerifyInput>({
      query: ({ otp, token }) => ({
        url: '/auth/verify',
        method: 'POST',
        body: { otp, token },
      }),
    }),

    signin: builder.mutation<SinginResponse, SigninInput>({
      query: ({ email, password, remember }) => ({
        url: '/auth/signin',
        method: 'POST',
        body: { email, password, remember },
      }),
    }),

    signout: builder.mutation<SuccessResponse, void>({
      query: () => ({
        url: '/auth/signout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    signoutASession: builder.mutation<SuccessResponse, SignoutSessionInput>({
      query: (token) => ({
        url: `/auth/signout/${token}`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Sessions'],
    }),

    signoutAllSession: builder.mutation<SuccessResponse, void>({
      query: () => ({
        url: '/auth/signout-all',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Sessions'],
    }),

    findProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    refreshToken: builder.mutation<string, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),

    forgotPassword: builder.mutation<SuccessResponse, ForgotPasswordInput>({
      query: ({ email }) => ({
        url: `/auth/forgot-password`,
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<SuccessResponse, ResetPasswordInput>({
      query: ({ newPassword, confirmNewPassword, token }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'PATCH',
        body: { newPassword, confirmNewPassword },
      }),
    }),

    changePassword: builder.mutation<SuccessResponse, ChangePasswordInput>({
      query: (body) => ({
        url: '/auth/password/change',
        method: 'PATCH',
        body,
      }),
    }),

    updateProfile: builder.mutation<SuccessResponse, ProfileInput>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    requestEmailChange: builder.mutation<
      SuccessResponse,
      RequestEmailChangeInput
    >({
      query: (data) => ({
        url: '/auth/email/change/request',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    confirmEmailChange: builder.mutation<
      SuccessResponse,
      ConfirmEmailChangeInput
    >({
      query: ({ token, ...data }) => ({
        url: `/auth/email/change/confirm/${token}`,
        method: 'PATCH',
        body: data,
      }),
      // invalidatesTags: ['User'],
    }),

    reauth: builder.mutation<SuccessResponse, ReauthInput>({
      query: (body) => ({
        url: `/auth/reauth`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyMutation,
  useSigninMutation,
  useSignoutMutation,
  useSignoutASessionMutation,
  useSignoutAllSessionMutation,
  useFindProfileQuery,
  useLazyFindProfileQuery,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useRequestEmailChangeMutation,
  useConfirmEmailChangeMutation,
  useReauthMutation,
} = userAuthApi;
