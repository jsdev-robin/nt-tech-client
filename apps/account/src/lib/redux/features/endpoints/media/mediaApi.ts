import { gatewayApi } from '../../api/gatewayApi';
import { type SuccessResponse, type TQueryParams } from '../../types';
import { queryURL } from '../../utils/queryURL';
import { type MediaResponse, type SignatureResponse } from './types';

export const mediaApi = gatewayApi.injectEndpoints({
  endpoints: (builder) => ({
    signatureMedia: builder.query<SignatureResponse, void>({
      query: () => ({
        url: '/storage/media/signature',
        method: 'GET',
      }),
    }),

    createMedia: builder.mutation<SuccessResponse, string[]>({
      query: (data) => ({
        url: `/storage/media`,
        method: 'POST',
        body: {
          media: data,
        },
      }),
      invalidatesTags: ['Media'],
    }),

    findMedia: builder.query<MediaResponse, TQueryParams>({
      query: (params) => ({
        url: queryURL('/storage/media', params),
        method: 'GET',
      }),
      providesTags: ['Media'],
    }),
  }),
});

export const {
  useSignatureMediaQuery,
  useLazySignatureMediaQuery,
  useCreateMediaMutation,
  useFindMediaQuery,
} = mediaApi;
