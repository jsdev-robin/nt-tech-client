import { retry } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { backoff, retryCondition } from '../utils/queryRetry';

export const geoApi = createApi({
  reducerPath: 'geoApi',
  baseQuery: retry(
    fetchBaseQuery({
      baseUrl: 'https://munza-geo.vercel.app/api/v1',
    }),
    { retryCondition: retryCondition, backoff: backoff },
  ),
  tagTypes: ['Division', 'District', 'Upazila', 'Union'],
  endpoints: () => ({}),
});
