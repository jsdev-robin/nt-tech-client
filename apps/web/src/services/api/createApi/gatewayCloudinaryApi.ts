import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi, retry } from '@reduxjs/toolkit/query/react';
import type { AxiosError, AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import axios from 'axios';

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
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers, onUploadProgress }) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        onUploadProgress,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const gatewayCloudinaryApi = createApi({
  reducerPath: 'cloudinary',
  baseQuery: retry(
    axiosBaseQuery({
      baseUrl: 'https://api.cloudinary.com/v1_1',
    }),
    { maxRetries: 3 },
  ),
  endpoints: () => ({}),
});
