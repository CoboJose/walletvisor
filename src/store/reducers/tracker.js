import { createReducer } from '@reduxjs/toolkit'
import * as actions from '../actions/actionTypes'

const initialState = {
    //DELETE:
    debug: {recharging:false},
    transactions: [],
    error: null,
    loading: false,
}

const reducer = createReducer(initialState, {
    
    [actions.ADD_TRANSACTION_START] (state){
        state.loading = true;
    },
    [actions.ADD_TRANSACTION_SUCCESS] (state, action){
        const transaction = {...action.transaction, id: action.id};
        state.transactions.push(transaction);
        state.loading = false;
    },
    [actions.ADD_TRANSACTION_FAIL] (state, action){
        state.loading = false;
        state.error = action.error;
    },

    [actions.UPDATE_TRANSACTION] (state, action){
        const transactionIndex = state.transactions.findIndex(t => t.id == action.transaction.id);

        state.transactions[transactionIndex] = action.transaction
    },

    [actions.DELETE_TRANSACTION] (state, action){
        state.transactions = state.transactions.filter(t => t.id !== action.id);
    },

    [actions.GET_TRANSACTIONS_START] (state){
        state.loading = true;
    },
    [actions.GET_TRANSACTIONS_SUCCESS] (state, action){
        state.transactions = action.transactions;
        state.loading = false;
    },
    [actions.GET_TRANSACTIONS_FAIL] (state, action){
        state.loading = false;
        state.error = action.error;
    },
})

export default reducer;