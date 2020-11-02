import { createReducer } from '@reduxjs/toolkit'
import * as actions from '../actions/actionTypes'

const initialState = {
    balance: 0
}

const reducer = createReducer(initialState, {
    
    [actions.UPDATE_BALANCE] (state, action){
        const newAmount = action.payload.type ==='expense' ? -action.payload.newAmount : action.payload.newAmount;
        
        state.balance = parseFloat((state.balance + newAmount).toFixed(2));
    }
})

export default reducer