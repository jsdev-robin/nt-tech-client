import { gatewayApi } from '@/lib/redux/features/api/gatewayApi';
import { type SuccessResponse } from '@/lib/redux/features/types';
import {
  ConfirmTwoFaInput,
  VerifyBackupTwoFaInput,
  VerifyTokenTwoFaInput,
} from '@/validations/ZTwoFaSchema';
import {
  type FindBackupResponse,
  type RequestTwoFaResponse,
  type TwoFaVerifyResponse,
} from './types';

export const twoFaAuthApi = gatewayApi.injectEndpoints({
  endpoints: (builder) => ({
    requestTwoFa: builder.query<RequestTwoFaResponse, void>({
      query: () => ({
        url: '/auth/twofa/setup/request',
        method: 'GET',
      }),
    }),

    confirmTwoFa: builder.mutation<SuccessResponse, ConfirmTwoFaInput>({
      query: (body) => ({
        url: '/auth/twofa/setup/confirm',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User', 'Backup'],
    }),

    verifyTwoFaToken: builder.mutation<
      TwoFaVerifyResponse,
      VerifyTokenTwoFaInput
    >({
      query: (body) => ({
        url: '/auth/twofa/verify/token',
        method: 'POST',
        body,
      }),
    }),

    verifyTwoFaBackup: builder.mutation<
      TwoFaVerifyResponse,
      VerifyBackupTwoFaInput
    >({
      query: (body) => ({
        url: '/auth/twofa/verify/backup',
        method: 'POST',
        body,
      }),
    }),

    createTwoFaBackup: builder.mutation<SuccessResponse, void>({
      query: () => ({
        url: '/auth/twofa/backup-codes',
        method: 'PATCH',
      }),
      invalidatesTags: ['Backup'],
    }),

    findTwoFaBackup: builder.query<FindBackupResponse, void>({
      query: () => ({
        url: '/auth/twofa/backup-codes',
        method: 'GET',
      }),
      providesTags: ['Backup'],
    }),

    disableTwoFa: builder.mutation<SuccessResponse, void>({
      query: () => ({
        url: '/auth/twofa/disable',
        method: 'PATCH',
      }),
      invalidatesTags: ['Backup', 'User'],
    }),
  }),
});

export const {
  useRequestTwoFaQuery,
  useConfirmTwoFaMutation,
  useVerifyTwoFaTokenMutation,
  useVerifyTwoFaBackupMutation,
  useCreateTwoFaBackupMutation,
  useFindTwoFaBackupQuery,
  useDisableTwoFaMutation,
} = twoFaAuthApi;
