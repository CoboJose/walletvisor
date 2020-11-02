import { createReducer } from '@reduxjs/toolkit'
import * as actions from '../actions/actionTypes'

const initialState = {
    balance: 0
}

const reducer = createReducer(initialState, {
    
    [actions.UPDATE_BALANCE] (state, action){
        
        state.balance = parseFloat((state.balance + action.amount).toFixed(2));
    }
})

export default reducer