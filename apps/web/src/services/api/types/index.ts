export interface SuccessResponse {
  status: string;
  message: string;
}

export interface PaginatedPayload<T> {
  status: string;
  message: string;
  payload: {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  payload: {
    data: T;
  };
}
