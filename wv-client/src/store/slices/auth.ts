import { AuthResponse } from 'types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoginAction = {
  loginResponse: AuthResponse,
  keepLoggedIn: boolean,
}

interface AuthState {
  token: string,
  refreshToken: string,
  role: string,
  keepLoggedIn: boolean,
  tokenExpirationDate: number,
}

const initialState: AuthState = {
  token: '',
  refreshToken: '',
  role: '',
  keepLoggedIn: false,
  tokenExpirationDate: 0,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginAction>) => {
      const loginResponse = action.payload.loginResponse;
      const keepLoggedIn = action.payload.keepLoggedIn;

      if (keepLoggedIn) {
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
      }

      state.token = loginResponse.token;
      state.refreshToken = loginResponse.refreshToken;
      state.role = loginResponse.role;
      state.keepLoggedIn = keepLoggedIn;
      state.tokenExpirationDate = Date.now() + (loginResponse.tokenExpiresInMinutes * 60 * 1000);
    },

    refreshToken: (state, action: PayloadAction<AuthResponse>) => {
      const loginResponse = action.payload;

      if (state.keepLoggedIn) {
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
      }

      state.token = loginResponse.token;
      state.refreshToken = loginResponse.refreshToken;
      state.role = loginResponse.role;
      state.tokenExpirationDate = Date.now() + (loginResponse.tokenExpiresInMinutes * 60 * 1000);
    },

    logout: (state) => {
      localStorage.removeItem('refreshToken');

      state.token = '';
      state.refreshToken = '';
      state.role = '';
      state.keepLoggedIn = false;
      state.tokenExpirationDate = 0;
    },
  },
});

export const { login, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
