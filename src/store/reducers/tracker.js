import { createReducer } from '@reduxjs/toolkit'
import * as actions from '../actions/actionTypes'

const initialState = {
    //DELETE:
    debug: {recharging:false},

    transactions: [
        {   
            id:"0",
            title: "title1",
            amount: 10,
            category: "food", 
            type: "expense",
            date: "2020-11-05",
        },
        {   
            id:"1",
            title: "title2",
            amount: 10,
            category: "food", 
            type: "expense",
            date: "2020-11-06",
        }
    ]
}

const reducer = createReducer(initialState, {
    
    [actions.ADD_TRANSACTION] (state, action){
        state.transactions.push(action.transaction);
    },

    [actions.UPDATE_TRANSACTION] (state, action){
        const transactionIndex = state.transactions.findIndex(t => t.id == action.transaction.id);

        state.transactions[transactionIndex] = action.transaction
    },

    [actions.DELETE_TRANSACTION] (state, action){
        state.transactions = state.transactions.filter(t => t.id !== action.id);
    },
})

export default reducer;