import { configureStore } from '@reduxjs/toolkit'

import addTransactionReducer from './reducers/addTransaction'

const store = configureStore({
    reducer: {
      addTransaction: addTransactionReducer
    }
  })

  export default store