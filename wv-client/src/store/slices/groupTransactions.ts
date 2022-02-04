import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, GroupTransactionWithUsers } from 'types/types';
import { RootState } from 'store/store';
import { logout } from './auth';

interface GroupTransactionsState {
  groupTransactionsWithUsers: GroupTransactionWithUsers[],
  isLoading: boolean,
}

const initialState: GroupTransactionsState = {
  groupTransactionsWithUsers: [],
  isLoading: false,
};

export const getGroupTransactions = createAsyncThunk<GroupTransactionWithUsers[], number, {state: RootState, rejectValue: ApiError }>(
  'groupTransactions/getGroupTransactions',
  async (groupId, { rejectWithValue }) => {
    try { return await api.getGroupTransactions(groupId); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const createGroupTransaction = createAsyncThunk<GroupTransactionWithUsers[], GroupTransactionWithUsers, {state: RootState, rejectValue: ApiError }>(
  'transactions/createGroupTransaction',
  async (groupTransactionWithUsers, { rejectWithValue }) => {
    try { 
      await api.createGroupTransaction(groupTransactionWithUsers);
      return await api.getGroupTransactions(groupTransactionWithUsers.groupTransaction.groupId);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const groupTransactionsSlice = createSlice({
  name: 'groupTransactions',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    //GET
    builder.addCase(getGroupTransactions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGroupTransactions.fulfilled, (state, action) => {
      state.groupTransactionsWithUsers = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getGroupTransactions.rejected, (state) => {
      state.isLoading = false;
    });
    //CREATE
    builder.addCase(createGroupTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createGroupTransaction.fulfilled, (state, action) => {
      state.groupTransactionsWithUsers = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createGroupTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //LOGOUT
    builder.addCase(logout, () => {
      return { ...initialState };
    });
  },
});

export default groupTransactionsSlice.reducer;
