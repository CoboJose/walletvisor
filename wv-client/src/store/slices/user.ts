import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, UpdateUserPayload, User } from 'types/types';

interface UserState {
  user: User | null,
  isLoading: boolean,
}

const initialState: UserState = {
  user: null,
  isLoading: false,
};

export const getUser = createAsyncThunk<User, void, { rejectValue: ApiError }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try { 
      return await api.getUser(); 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const updateUser = createAsyncThunk<User, UpdateUserPayload, { rejectValue: ApiError }>(
  'user/updateUser',
  async (updateUserPayload, { rejectWithValue }) => {
    try { 
      return await api.updateUser(updateUserPayload); 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // GET USER
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.isLoading = false;
    });
    // UPDATE USER
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default userSlice.reducer;
