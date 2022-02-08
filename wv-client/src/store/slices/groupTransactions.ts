import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, GroupTransaction, GroupTransactionDTO } from 'types/types';
import { RootState } from 'store/store';
import { logout } from './auth';

interface GroupTransactionsState {
  groupTransactionDTOs: GroupTransactionDTO[],
  isLoading: boolean,
}

const initialState: GroupTransactionsState = {
  groupTransactionDTOs: [],
  isLoading: false,
};

export const getGroupTransactions = createAsyncThunk<GroupTransactionDTO[], {groupId: number}, {state: RootState, rejectValue: ApiError }>(
  'groupTransactions/getGroupTransactions',
  async ({ groupId }, { rejectWithValue }) => {
    try { return await api.getGroupTransactions(groupId); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const createGroupTransaction = createAsyncThunk<GroupTransactionDTO[], GroupTransactionDTO, {state: RootState, rejectValue: ApiError }>(
  'transactions/createGroupTransaction',
  async (groupTransactionWithUsers, { rejectWithValue }) => {
    try { 
      await api.createGroupTransaction(groupTransactionWithUsers);
      return await api.getGroupTransactions(groupTransactionWithUsers.groupTransaction.groupId);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const updateGroupTransaction = createAsyncThunk<GroupTransactionDTO[], GroupTransaction, {state: RootState, rejectValue: ApiError }>(
  'transactions/updateGroupTransaction',
  async (groupTransaction, { rejectWithValue }) => {
    try { 
      await api.updateGroupTransaction(groupTransaction);
      return await api.getGroupTransactions(groupTransaction.groupId);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const payGroupTransaction = createAsyncThunk<GroupTransactionDTO[], GroupTransaction, {state: RootState, rejectValue: ApiError }>(
  'transactions/payGroupTransaction',
  async (groupTransaction, { rejectWithValue }) => {
    try { 
      await api.payGroupTransaction(groupTransaction);
      return await api.getGroupTransactions(groupTransaction.groupId);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const deleteGroupTransaction = createAsyncThunk<GroupTransactionDTO[], {groupTransactionId: number}, {state: RootState, rejectValue: ApiError }>(
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
      state.groupTransactionDTOs = action.payload.sort((gt1, gt2) => gt2.groupTransaction.date - gt1.groupTransaction.date);
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
      state.groupTransactionDTOs = action.payload.sort((gt1, gt2) => gt2.groupTransaction.date - gt1.groupTransaction.date);
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
      state.groupTransactionDTOs = action.payload.sort((gt1, gt2) => gt2.groupTransaction.date - gt1.groupTransaction.date);
      state.isLoading = false;
    });
    builder.addCase(updateGroupTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //PAY
    builder.addCase(payGroupTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(payGroupTransaction.fulfilled, (state, action) => {
      state.groupTransactionDTOs = action.payload.sort((gt1, gt2) => gt2.groupTransaction.date - gt1.groupTransaction.date);
      state.isLoading = false;
    });
    builder.addCase(payGroupTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //DELETE
    builder.addCase(deleteGroupTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteGroupTransaction.fulfilled, (state, action) => {
      state.groupTransactionDTOs = action.payload.sort((gt1, gt2) => gt2.groupTransaction.date - gt1.groupTransaction.date);
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
