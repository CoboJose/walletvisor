import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from 'api/api';
import { ApiError, GetTransactionsResponse, Transaction, TransactionCategory, TransactionKind } from 'types/types';
import { RootState } from 'store/store';
import { logout } from './auth';
import dates from 'utils/dates';

interface TransactionsState {
  transactions: Transaction[],
  totalBalance: number,
  fromDate: number | null,
  toDate: number | null,
  filterKind: TransactionKind | string,
  filterCategory: TransactionCategory | string,
  isLoading: boolean,
}

const initialState: TransactionsState = {
  transactions: [],
  totalBalance: 0,
  fromDate: dates.getFirstDayOfCurrentMonth().getTime(),
  toDate: dates.getLastDayOfCurrentMonth().getTime(),
  filterKind: '',
  filterCategory: '',
  isLoading: false,
};

export const getTransactions = createAsyncThunk<GetTransactionsResponse, void, {state: RootState, rejectValue: ApiError }>(
  'transactions/getTransactions',
  async (_, { getState, rejectWithValue }) => {
    const transactionState = getState().transactions;
    const from = transactionState.fromDate !== null ? transactionState.fromDate : 0;
    const to = transactionState.toDate !== null ? transactionState.toDate : 999999999999999;

    try { return await api.getTransactions(from, to); }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const createTransaction = createAsyncThunk<GetTransactionsResponse, Transaction, {state: RootState, rejectValue: ApiError }>(
  'transactions/createTransaction',
  async (transaction, { getState, rejectWithValue }) => {
    const transactionState = getState().transactions;
    const from = transactionState.fromDate ? transactionState.fromDate.valueOf() : 0;
    const to = transactionState.toDate ? transactionState.toDate.valueOf() : 999999999999999;

    try { 
      await api.addTransaction(transaction);
      return await api.getTransactions(from, to);
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const updateTransaction = createAsyncThunk<GetTransactionsResponse, Transaction, {state: RootState, rejectValue: ApiError }>(
  'transactions/cupdateTransaction',
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

export const deleteTransaction = createAsyncThunk<GetTransactionsResponse, {transactionId: number}, {state: RootState, rejectValue: ApiError }>(
  'transactions/deleteTransaction',
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
);

type ChangeTransactionsRangeAction = {
  fromDate: number | null,
  toDate: number | null,
  transactions: Transaction[],
  totalBalance: number,
}
export const changeTransactionsRangeAction = createAsyncThunk<ChangeTransactionsRangeAction, {fromDate: number|null, toDate: number|null}, {rejectValue: ApiError }>(
  'transactions/changeTransactionsRange',
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    const from = fromDate !== null ? fromDate : 0;
    const to = toDate !== null ? toDate : 999999999999999;

    try {
      const getTransactionsResponse = await api.getTransactions(from, to);
      return { fromDate, toDate, transactions: getTransactionsResponse.transactions, totalBalance: getTransactionsResponse.totalBalance }; 
    }
    catch (error) { return rejectWithValue(error as ApiError); }
  }
);

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilterKind: (state, action: PayloadAction<TransactionKind | string>) => {
      state.filterCategory = '';
      state.filterKind = action.payload;
    },
    setFilterCategory: (state, action: PayloadAction<TransactionCategory | string>) => {
      state.filterCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    //GET
    builder.addCase(getTransactions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.transactions = action.payload.transactions.sort((t1, t2) => t2.date - t1.date);
      state.totalBalance = action.payload.totalBalance;
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
      state.transactions = action.payload.transactions.sort((t1, t2) => t2.date - t1.date);
      state.totalBalance = action.payload.totalBalance;
      state.isLoading = false;
    });
    builder.addCase(createTransaction.rejected, (state) => {
      state.isLoading = false;
    });
    //UPDATE
    builder.addCase(updateTransaction.pending, (state) => {
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
    });
    //CHANGE TRANSACTIONS RANGE
    builder.addCase(changeTransactionsRangeAction.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changeTransactionsRangeAction.fulfilled, (state, action) => {
      state.transactions = action.payload.transactions.sort((t1, t2) => t2.date - t1.date);
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
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

export const { setFilterKind, setFilterCategory } = transactionsSlice.actions;
export default transactionsSlice.reducer;
