import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, AuthResponse } from 'types/types';
import { RootState } from 'store/store';

interface AuthState {
  token: string,
  refreshToken: string,
  role: string,
  keepLoggedIn: boolean,
  tokenExpirationDate: number,
  isLoading: boolean,
}

const initialState: AuthState = {
  token: '',
  refreshToken: '',
  role: '',
  keepLoggedIn: false,
  tokenExpirationDate: 0,
  isLoading: false,
};

type LoginAction = {
  loginResponse: AuthResponse,
  keepLoggedIn: boolean,
}
export const login = createAsyncThunk<LoginAction, {email: string, password: string, keepLoggedIn: boolean}, { rejectValue: ApiError }>(
  'auth/login',
  async ({ email, password, keepLoggedIn }, { rejectWithValue }) => {
    try { 
      const loginResponse = await api.login(email, password);
      if (keepLoggedIn) {
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
      }
      return { loginResponse, keepLoggedIn }; 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const register = createAsyncThunk<AuthResponse, {email: string, password: string}, { rejectValue: ApiError }>(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try { 
      const registerResponse = await api.register(email, password);
      return registerResponse; 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const refreshToken = createAsyncThunk<AuthResponse, string | undefined, { state: RootState, rejectValue: ApiError }>(
  'auth/refreshToken',
  async (refreshTkn, { getState, rejectWithValue }) => {
    const authState = getState().auth;
    try { 
      const refreshTokenResponse = await api.refreshToken(refreshTkn === undefined ? authState.refreshToken : refreshTkn);
      if (authState.keepLoggedIn) {
        localStorage.setItem('refreshToken', refreshTokenResponse.refreshToken);
      }
      return refreshTokenResponse; 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('refreshToken');

      state.token = '';
      state.refreshToken = '';
      state.role = '';
      state.keepLoggedIn = false;
      state.tokenExpirationDate = 0;

      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    //LOGIN
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const loginResponse = action.payload.loginResponse;
      const keepLoggedIn = action.payload.keepLoggedIn;

      state.token = loginResponse.token;
      state.refreshToken = loginResponse.refreshToken;
      state.role = loginResponse.role;
      state.keepLoggedIn = keepLoggedIn;
      state.tokenExpirationDate = Date.now() + (loginResponse.tokenExpiresInMinutes * 60 * 1000);
      state.isLoading = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
    });
    //REGISTER
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      const registerResponse = action.payload;

      state.token = registerResponse.token;
      state.refreshToken = registerResponse.refreshToken;
      state.role = registerResponse.role;
      state.tokenExpirationDate = Date.now() + (registerResponse.tokenExpiresInMinutes * 60 * 1000);
      state.isLoading = false;
    });
    builder.addCase(register.rejected, (state) => {
      state.isLoading = false;
    });
    //REFRESH TOKEN
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      const refreshTokenResponse = action.payload;
      
      if (state.keepLoggedIn) {
        localStorage.setItem('refreshToken', refreshTokenResponse.refreshToken);
      }

      state.token = refreshTokenResponse.token;
      state.refreshToken = refreshTokenResponse.refreshToken;
      state.role = refreshTokenResponse.role;
      state.tokenExpirationDate = Date.now() + (refreshTokenResponse.tokenExpiresInMinutes * 60 * 1000);
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
