import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, Transaction } from 'types/types';
import { RootState } from 'store/store';
import { logout } from './auth';

interface TransactionsState {
  transactions: Transaction[],
  startDate: number,
  endDate: number,
  isLoading: boolean,
}

const initialState: TransactionsState = {
  transactions: [],
  startDate: 0,
  endDate: 999999999999999,
  isLoading: false,
};

export const getTransactions = createAsyncThunk<Transaction[], void, {state: RootState, rejectValue: ApiError }>(
  'transactions/getTransactions',
  async (_, { getState, rejectWithValue }) => {
    const transactionState = getState().transactions;
    try { return await api.getTransactions(transactionState.startDate, transactionState.endDate); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const createTransaction = createAsyncThunk<Transaction[], Transaction, {state: RootState, rejectValue: ApiError }>(
  'transactions/createTransaction',
  async (transaction, { getState, rejectWithValue }) => {
    const transactionState = getState().transactions;
    try { 
      await api.addTransaction(transaction);
      return await api.getTransactions(transactionState.startDate, transactionState.endDate); 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const deleteTransaction = createAsyncThunk<Transaction[], {transactionId: number}, {state: RootState, rejectValue: ApiError }>(
  'transactions/deleteTransaction',
  async ({ transactionId }, { getState, rejectWithValue }) => {
    const transactionState = getState().transactions;
    try { 
      await api.deleteTransaction(transactionId);
      return await api.getTransactions(transactionState.startDate, transactionState.endDate); 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

type ChangeTransactionsRangeAction = {
  from: number,
  to: number,
  transactions: Transaction[],
}
export const changeTransactionsRangeAction = createAsyncThunk<ChangeTransactionsRangeAction, {from: number, to: number}, {rejectValue: ApiError }>(
  'transactions/changeTransactionsRange',
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const transactions = await api.getTransactions(from, to);
      return { from, to, transactions }; 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    //GET
    builder.addCase(getTransactions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTransactions.rejected, (state) => {
      state.isLoading = false;
    });
    //CREATE
    builder.addCase(createTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createTransaction.fulfilled, (state, action) => {
      state.transactions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(createTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //DELETE
    builder.addCase(deleteTransaction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteTransaction.fulfilled, (state, action) => {
      state.transactions = action.payload;
      state.isLoading = false;
    });
    builder.addCase(deleteTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //CHANGE TRANSACTIONS RANGE
    builder.addCase(changeTransactionsRangeAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changeTransactionsRangeAction.fulfilled, (state, action) => {
      state.transactions = action.payload.transactions;
      state.startDate = action.payload.from;
      state.endDate = action.payload.to;
      state.isLoading = false;
    });
    builder.addCase(changeTransactionsRangeAction.rejected, (state) => {
      state.isLoading = false;
    });
    //LOGOUT
    builder.addCase(logout, () => {
      return { ...initialState };
    });
  },
});

// export const { } = transactionsSlice.actions;
export default transactionsSlice.reducer;
