import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, GroupTransaction, GroupTransactionWithUsers } from 'types/types';
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

export const getGroupTransactions = createAsyncThunk<GroupTransactionWithUsers[], {groupId: number}, {state: RootState, rejectValue: ApiError }>(
  'groupTransactions/getGroupTransactions',
  async ({ groupId }, { rejectWithValue }) => {
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

export const updateGroupTransaction = createAsyncThunk<GroupTransactionWithUsers[], GroupTransaction, {state: RootState, rejectValue: ApiError }>(
  'transactions/updateGroupTransaction',
  async (groupTransaction, { rejectWithValue }) => {
    try { 
      await api.updateGroupTransaction(groupTransaction);
      return await api.getGroupTransactions(groupTransaction.groupId);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const deleteGroupTransaction = createAsyncThunk<GroupTransactionWithUsers[], {groupTransactionId: number}, {state: RootState, rejectValue: ApiError }>(
  'transactions/deleteGroupTransaction',
  async ({ groupTransactionId }, { rejectWithValue }) => {
    try { 
      await api.deleteGroupTransaction(groupTransactionId);
      return await api.getGroupTransactions(groupTransactionId);
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
    //UPDATE
    builder.addCase(updateGroupTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateGroupTransaction.fulfilled, (state, action) => {
      state.groupTransactionsWithUsers = action.payload;
      state.isLoading = false;
    });
    builder.addCase(updateGroupTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //DELETE
    builder.addCase(deleteGroupTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteGroupTransaction.fulfilled, (state, action) => {
      state.groupTransactionsWithUsers = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteGroupTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //LOGOUT
    builder.addCase(logout, () => {
      return { ...initialState };
    });
  },
});

export default groupTransactionsSlice.reducer;
