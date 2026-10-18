import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from './createApi/baseApi';
import { gatewayCloudinaryApi } from './createApi/gatewayCloudinaryApi';
import authSlice from './endpoints/auth/core/authSlice';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [gatewayCloudinaryApi.reducerPath]: gatewayCloudinaryApi.reducer,
      auth: authSlice,
    },

    devTools: true,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: process.env.NODE_ENV !== 'production',
      }).concat(baseApi.middleware, gatewayCloudinaryApi.middleware),
  });

  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
