import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string
}

const initialState: AuthState = {
  token: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { login } = authSlice.actions;
export default authSlice.reducer;
