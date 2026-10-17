import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// ref: https://stackoverflow.com/questions/76831664/rtk-query-maxretries-backoff
export const retryCondition = (
  error: unknown,
  _args: unknown,
  { attempt }: { attempt: number },
) => {
  const err = error as FetchBaseQueryError;

  // No error → no retry
  if (!err) {
    return false;
  }

  // Stop retrying after 10 attempts
  if (attempt >= 10) {
    return false;
  }

  // Retry on network or timeout errors
  if (err.status === 'FETCH_ERROR' || err.status === 'TIMEOUT_ERROR') {
    return true;
  }

  // Retry on server errors (HTTP 5xx)
  if (typeof err.status === 'number' && err.status >= 500) {
    return true;
  }

  // Skip other errors (4xx except handled separately)
  return false;
};

// ref: https://stackoverflow.com/questions/76831664/rtk-query-maxretries-backoff
/**
 * Exponential backoff function before retrying.
 * Doubles delay each attempt: 100ms, 200ms, 400ms, ...
 * Supports cancellation via AbortSignal.
 */
export const backoff = async (
  attempt: number,
  _maxRetries: number,
  signal?: AbortSignal,
) => {
  const delay = Math.pow(2, attempt) * 100;

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => resolve(), delay);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject();
      });
    }
  });
};
