import { configureStore } from '@reduxjs/toolkit';

import authSlice from 'store/slices/auth';
import loadingSlice from 'store/slices/loading';

const store = configureStore({
  reducer: {
    auth: authSlice,
    loading: loadingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
