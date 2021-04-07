import { configureStore } from '@reduxjs/toolkit';

import configSlice from './slices/config';
import trackerSlice from './slices/tracker';
import authSlice from './slices/auth';

const store = configureStore({
    reducer: {
      config: configSlice,
      tracker: trackerSlice,
      auth: authSlice,
    }
  })

  export default store;