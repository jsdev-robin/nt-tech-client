'use client';
import { userAuthApi } from '@/services/api/endpoints/auth/core/authApi';
import { AppStore, makeStore } from '@/services/api/store';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

const REFRESH_INTERVAL_MS = 20 * 60 * 1000;
const JITTER_MS = 2 * 60 * 1000;

const getPollingInterval = () =>
  REFRESH_INTERVAL_MS + Math.floor((Math.random() * 2 - 1) * JITTER_MS);

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const request = store.dispatch(
        userAuthApi.endpoints.refreshToken.initiate(),
      );
      request
        .unwrap()
        .catch(() => {})
        .finally(() => request.reset());
    }, getPollingInterval());

    return () => clearInterval(intervalId);
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
