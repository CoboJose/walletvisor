import { createSlice } from '@reduxjs/toolkit'

const initialState = { 
    balance: 0 
}

const addTransactionSlice = createSlice({
  name: 'addTransaction',
  initialState,
  reducers: {

    updateBalance(state, action) {
        const newAmount = action.payload.type ==='expense' ? -action.payload.newAmount : action.payload.newAmount;
        
        state.balance = parseFloat((state.balance + newAmount).toFixed(2));
    }
  
    },
})

export const { updateBalance } = addTransactionSlice.actions
export default addTransactionSlice.reducer