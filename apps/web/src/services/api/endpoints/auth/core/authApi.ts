import { baseApi } from '@/services/api/createApi/baseApi';
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
  }),
});

export const {
  useFindProfileQuery,
  useLazyFindProfileQuery,
  useRefreshTokenMutation,
} = userAuthApi;
