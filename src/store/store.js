import { configureStore } from '@reduxjs/toolkit'

import addTransactionSlice from './addTransactionSlice'

const store = configureStore({
    reducer: {
      addTransaction: addTransactionSlice
    }
  })

  export default store