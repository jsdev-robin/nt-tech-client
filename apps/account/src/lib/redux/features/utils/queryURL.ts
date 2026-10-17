import { type TQueryParams } from '../types';

export function queryURL(
  baseEndpoint: string,
  { pagination, queryParams, sort, globalFilter }: TQueryParams,
): string {
  const page = (pagination?.pageIndex ?? 0) + 1;
  const limit = pagination?.pageSize ?? 20;

  let url = `${baseEndpoint}?page=${page}&limit=${limit}`;

  if (queryParams) url += `&${queryParams}`;
  if (sort) url += `&${sort}`;
  if (globalFilter) url += `&q=${globalFilter}`;

  return url;
}
