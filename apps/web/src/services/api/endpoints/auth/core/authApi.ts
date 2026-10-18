import { baseApi } from '@/services/api/createApi/baseApi';
import { SuccessResponse } from '@/services/api/types';
import { type ProfileResponse } from './types';

export const userAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: '/auth/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    refreshToken: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),

    signout: builder.mutation<SuccessResponse, void>({
      query: () => ({
        url: '/auth/signout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useFindProfileQuery,
  useLazyFindProfileQuery,
  useRefreshTokenMutation,
  useSignoutMutation,
} = userAuthApi;
