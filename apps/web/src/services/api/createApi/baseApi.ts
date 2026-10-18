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
import { backoff, retryCondition } from './utils/queryRetry';

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
  const signInUrl = new URL('/sign-in', process.env.NEXT_PUBLIC_ACCOUNT_ORIGIN);
  window.location.assign(signInUrl);
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
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

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: retry(baseQueryWithReauth, {
    retryCondition: retryCondition,
    backoff: backoff,
  }),
  refetchOnReconnect: true,
  tagTypes: [
    'User',

    // Suppliers
    'Suppliers',
    'Supplier',
    'ArchivedSuppliers',
    'SupplierOptions',
    // Units
    'Units',
    'Unit',
    'ArchivedUnits',
    'UnitOptions',
    // Ingredients
    'Ingredients',
    'Ingredient',
    'ArchivedIngredients',
    'IngredientOptions',
    //Warehouses
    'Warehouses',
    'Warehouse',
    'WarehouseOptions',
    'ArchivedWarehouses',
  ],
  endpoints: () => ({}),
});
