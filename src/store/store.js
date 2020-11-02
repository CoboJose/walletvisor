import { configureStore } from '@reduxjs/toolkit'

import trackerReducer from './reducers/tracker'

const store = configureStore({
    reducer: {
      tracker: trackerReducer
    }
  })

  export default store