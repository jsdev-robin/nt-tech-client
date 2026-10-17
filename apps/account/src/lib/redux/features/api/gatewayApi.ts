// guides: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries

import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { backoff, retryCondition } from '../utils/queryRetry';

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      headers.set('x-timezone', timezone);
    }
    return headers;
  },
});

const redirectToSignIn = () => {
  if (typeof window === 'undefined') return;
  const signInUrl = new URL('/sign-in');
  window.location.assign(signInUrl);
};
const SKIP_REFRESH_ENDPOINTS = [
  '/auth/signin',
  '/auth/signup',
  '/auth/verify',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/twofa/verify/token',
  '/auth/twofa/verify/backup',
];

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  const shouldSkipRefresh =
    typeof args !== 'string' &&
    args.url &&
    SKIP_REFRESH_ENDPOINTS.some((endpoint) => args.url.startsWith(endpoint));

  if (result.error && result.error.status === 401 && !shouldSkipRefresh) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await rawBaseQuery(
          { url: '/auth/refresh-token', method: 'POST' },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          // retry the initial query
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // // Handle refresh token failure
          if (refreshResult.error?.status === 403) {
            if (typeof window !== 'undefined') {
              redirectToSignIn();
            }
          }
        }
      } finally {
        // release must be called once the mutex should be released again
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  // ref: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#bailing-out-of-error-re-tries
  if (result.error && result.error.status === 403) {
    if (typeof window !== 'undefined') {
      redirectToSignIn();
    }
  }

  return result;
};

// Apply retry wrapper to the base query
const baseQueryWithRetry = retry(baseQueryWithReauth, {
  retryCondition: retryCondition,
  backoff: backoff,
});

export const gatewayApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  refetchOnReconnect: true,
  tagTypes: ['User', 'Sessions', 'Passkeys', 'Backup', 'Media'],
  endpoints: () => ({}),
});
