import { PaginationState } from 'munza-x-data-grid';

export interface SuccessResponse {
  status: string;
  message: string;
}

export type TQueryParams = {
  pagination?: PaginationState;
  sort?: string;
  queryParams?: string;
  globalFilter?: string;
};
