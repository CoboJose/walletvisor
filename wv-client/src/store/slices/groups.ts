import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, Group } from 'types/types';
import { RootState } from 'store/store';
import { logout } from './auth';

interface GroupsState {
  groups: Group[],
  isLoading: boolean,
}

const initialState: GroupsState = {
  groups: [],
  isLoading: false,
};

export const getGroups = createAsyncThunk<Group[], void, {state: RootState, rejectValue: ApiError }>(
  'groups/getGroups',
  async (_, { rejectWithValue }) => {
    try { return await api.getUserGroups(); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const createGroup = createAsyncThunk<Group[], Group, {state: RootState, rejectValue: ApiError }>(
  'groups/createGroup',
  async (group, { rejectWithValue }) => {
    try { 
      await api.createGroup(group);
      return await api.getUserGroups();
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

/*export const updateGroup = createAsyncThunk<GetTransactionsResponse, Transaction, {state: RootState, rejectValue: ApiError }>(
  'groups/updateGroup',
  async (transaction, { getState, rejectWithValue }) => {
    const transactionState = getState().transactions;
    const from = transactionState.fromDate ? transactionState.fromDate.valueOf() : 0;
    const to = transactionState.toDate ? transactionState.toDate.valueOf() : 999999999999999;

    try { 
      await api.updateTransaction(transaction);
      return await api.getTransactions(from, to);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const deleteGroup = createAsyncThunk<GetTransactionsResponse, {transactionId: number}, {state: RootState, rejectValue: ApiError }>(
  'groups/deleteGroup',
  async ({ transactionId }, { getState, rejectWithValue }) => {
    const transactionState = getState().transactions;
    const from = transactionState.fromDate ? transactionState.fromDate.valueOf() : 0;
    const to = transactionState.toDate ? transactionState.toDate.valueOf() : 999999999999999;
    
    try { 
      await api.deleteTransaction(transactionId);
      return await api.getTransactions(from, to);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);*/

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    //GET
    builder.addCase(getGroups.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGroups.fulfilled, (state, action) => {
      state.groups = action.payload.sort();
      state.isLoading = false;
    });
    builder.addCase(getGroups.rejected, (state) => {
      state.isLoading = false;
    });
    //CREATE
    builder.addCase(createGroup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createGroup.fulfilled, (state, action) => {
      state.groups = action.payload.sort();
      state.isLoading = false;
    });
    builder.addCase(createGroup.rejected, (state) => {
      state.isLoading = false;
    });
    //UPDATE
    /*builder.addCase(updateTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateTransaction.fulfilled, (state, action) => {
      state.transactions = action.payload.transactions.sort((t1, t2) => t2.date - t1.date);
      state.totalBalance = action.payload.totalBalance;
      state.isLoading = false;
    });
    builder.addCase(updateTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //DELETE
    builder.addCase(deleteTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.transactions = action.payload.transactions.sort((t1, t2) => t2.date - t1.date);
      state.totalBalance = action.payload.totalBalance;
      state.isLoading = false;
    });
    builder.addCase(deleteTransaction.rejected, (state) => {
      state.isLoading = false;
    });*/
    //CHANGE TRANSACTIONS RANGE
    //LOGOUT
    builder.addCase(logout, () => {
      return { ...initialState };
    });
  },
});

export default groupsSlice.reducer;
