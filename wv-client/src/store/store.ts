import { configureStore } from '@reduxjs/toolkit';

import authSlice from 'store/slices/auth';
import loadingSlice from 'store/slices/loading';
import configSlice from 'store/slices/config';
import transactionsSlice from './slices/transactions';

const store = configureStore({
  reducer: {
    auth: authSlice,
    transactions: transactionsSlice,
    loading: loadingSlice,
    config: configSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
