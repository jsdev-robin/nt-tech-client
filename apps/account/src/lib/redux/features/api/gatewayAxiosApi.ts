// guides: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#examples---basequery
// https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#bailing-out-of-error-re-tries

import {
  BaseQueryFn,
  createApi,
  FetchBaseQueryError,
  retry,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { backoff, retryCondition } from '../utils/queryRetry';

const mutex = new Mutex();

import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { userAuthApi } from '../endpoints/auth/core/authApi';

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
      responseType?: AxiosRequestConfig['responseType'];
      onDownloadProgress?: AxiosRequestConfig['onDownloadProgress'];
    },
    unknown,
    FetchBaseQueryError,
    { onProgress?: (percent: number) => void }
  > =>
  async ({
    url,
    method,
    data,
    params,
    headers,
    responseType,
    onDownloadProgress,
  }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        responseType,
        onDownloadProgress,
        withCredentials: true,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status as number,
          data: err.response?.data || err.message,
        },
      };
    }
  };

const rawBaseQuery = axiosBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URL!,
});

const baseQueryWithReauth: BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
    responseType?: AxiosRequestConfig['responseType'];
    onDownloadProgress?: AxiosRequestConfig['onDownloadProgress'];
  },
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
          { url: '/auth/merchant/refresh-token', method: 'POST' },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          // retry the initial query
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(userAuthApi.endpoints.signout.initiate());
          // // Handle refresh token failure
          if (refreshResult.error?.status === 403) {
            if (typeof window !== 'undefined') {
              window.location.href = '/sign-in';
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

  if (result.error && result.error.status === 403) {
    if (typeof window !== 'undefined') {
      window.location.href = '/sign-in';
    }
  }

  return result;
};

// Apply retry wrapper to the base query
const baseQueryWithRetry = retry(baseQueryWithReauth, {
  retryCondition: retryCondition,
  backoff: backoff,
});

export const gatewayAxiosApi = createApi({
  reducerPath: 'axios-api',
  baseQuery: baseQueryWithRetry,
  endpoints: () => ({}),
});
