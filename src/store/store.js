import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import trackerSlice from './slices/tracker';
import authSlice from './slices/auth';

const store = configureStore({
    reducer: {
      tracker: trackerSlice,
      auth: authSlice,
    }
  })

  export default store