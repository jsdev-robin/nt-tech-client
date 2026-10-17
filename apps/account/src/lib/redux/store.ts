import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { gatewayApi } from './features/api/gatewayApi';
import { gatewayAxiosApi } from './features/api/gatewayAxiosApi';
import { gatewayCloudinaryApi } from './features/api/gatewayCloudinaryApi';
import { geoApi } from './features/api/geoApi';
import authSlice from './features/endpoints/auth/core/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [gatewayApi.reducerPath]: gatewayApi.reducer,
      [gatewayAxiosApi.reducerPath]: gatewayAxiosApi.reducer,
      [gatewayCloudinaryApi.reducerPath]: gatewayCloudinaryApi.reducer,
      [geoApi.reducerPath]: geoApi.reducer,
      auth: authSlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(
        gatewayApi.middleware,
        gatewayAxiosApi.middleware,
        gatewayCloudinaryApi.middleware,
        geoApi.middleware,
      ),
  });
};

const store = makeStore();
setupListeners(store.dispatch);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
