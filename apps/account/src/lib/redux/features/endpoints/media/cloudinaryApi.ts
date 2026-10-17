import type { AxiosProgressEvent } from 'axios';
import { gatewayCloudinaryApi } from '../../api/gatewayCloudinaryApi';
import { CloudinaryResponse } from './types';

type UploadArg = {
  formData: FormData;
  onUploadProgress?: (progress: number) => void;
};

export const cloudinaryApi = gatewayCloudinaryApi.injectEndpoints({
  endpoints: (builder) => ({
    upload: builder.mutation<CloudinaryResponse, UploadArg>({
      query: ({ formData, onUploadProgress }: UploadArg) => ({
        url: `/${formData.get('cloud_name')}/auto/upload`,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const progress = Math.round(
            ((progressEvent.loaded ?? 0) * 100) / (progressEvent.total ?? 1),
          );
          onUploadProgress?.(progress);
        },
      }),
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const { useUploadMutation } = cloudinaryApi;
