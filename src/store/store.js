import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import trackerSlice from './tracker';
import authSlice from './auth';

const store = configureStore({
    reducer: {
      tracker: trackerSlice,
      auth: authSlice,
    }
  })

  export default store