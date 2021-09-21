import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from 'types/types';

type addAction = {
  transaction: Transaction
}

interface TransactionsState {
  transactions: Transaction[]
}

const initialState: TransactionsState = {
  transactions: []
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<addAction>) => {
      const transaction = action.payload.transaction;
      state.transactions.push(transaction);
    },
  },
});

export const { add } = transactionsSlice.actions;
export default transactionsSlice.reducer;
