import { createReducer } from '@reduxjs/toolkit'
import * as actions from '../actions/actionTypes'

const initialState = {
    transactions: [
        {
            title: "title1",
            amount: 10,
            category: "food", 
            type: "expense",
        },
        {
            title: "title2",
            amount: 10,
            category: "food", 
            type: "expense",
        }
    ]
}

const reducer = createReducer(initialState, {
    
    [actions.ADD_TRANSACTION] (state, action){
        
        state.transactions.push(action.transaction);
    },

    [actions.UPDATE_TRANSACTION] (state, action){
        
        const transactionIndex = state.transactions.findIndex(t => t.title == action.transaction.title);

        state.transactions[transactionIndex] = action.transaction
    },

    [actions.DELETE_TRANSACTION] (state, action){
          
        state.transactions = state.transactions.filter(t => t.title !== action.title);
    },
})

export default reducer;