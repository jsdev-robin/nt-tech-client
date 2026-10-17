import { SuccessResponse } from '../../../types';

export interface Cloudinary {
  signature: string;
  timestamp: string;
  api_key: string;
  cloud_name: string;
  tags: string;
}

export interface CloudinaryResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image' | 'video' | 'raw';
  created_at: string;
  tags: string[];
  bytes: number;
  type: 'upload' | 'private' | 'authenticated';
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  original_filename: string;
  api_key: string;
}

export interface SignatureResponse extends SuccessResponse {
  payload: {
    cloudinary: Cloudinary;
  };
}

export interface MediaResponse extends SuccessResponse {
  payload: {
    data: {
      secure_url: string;
      public_id: string;
    }[];
    total: number;
  };
}
