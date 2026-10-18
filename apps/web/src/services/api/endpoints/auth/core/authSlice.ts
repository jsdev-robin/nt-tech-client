import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userAuthApi } from './authApi';
import { type AuthState } from './types/user';

const initialState: AuthState = {
  token: undefined,
  user: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signup: (
      state,
      action: PayloadAction<{
        token: string;
      }>,
    ) => {
      state.token = action.payload.token;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      userAuthApi.endpoints.findProfile.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.payload.user;
      },
    );
  },
});

export const { signup } = authSlice.actions;

export default authSlice.reducer;
