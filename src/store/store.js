import { configureStore } from '@reduxjs/toolkit'

import trackerReducer from './reducers/tracker'
import authReducer from './reducers/auth'

const store = configureStore({
    reducer: {
      tracker: trackerReducer,
      auth: authReducer,
    }
  })

  export default store