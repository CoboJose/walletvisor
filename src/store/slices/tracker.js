import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { logout } from './auth'
import {dbTrackerApi} from '../../serverAPI/ServerAPI';


export const fetchTransactions = createAsyncThunk('tracker/fetchTransactions', async (args, {getState, rejectWithValue}) => {
    try{
        const authState = getState().auth
        const trackerApi = new dbTrackerApi(authState.token, authState.userId);

        const response = await trackerApi.fetchTransactions();

        const transactions = []
        for(let id in response.transactions){
            transactions.push({...response.transactions[id], id})
        }

        return transactions;
    }
    catch(error){return rejectWithValue(error)}
});

export const addTransaction = createAsyncThunk('tracker/addTransaction', async (transaction, {getState, rejectWithValue}) => {
    const authState = getState().auth
    const trackerApi = new dbTrackerApi(authState.token, authState.userId);
    
    try{
        const response = await trackerApi.addTransaction(transaction);
        transaction.id = response.id
        return transaction;
    }
    catch(error){return rejectWithValue(error)}
});

export const updateTransaction = createAsyncThunk('tracker/updateTransaction', async (transaction, {getState, rejectWithValue}) => {
    const authState = getState().auth
    const trackerApi = new dbTrackerApi(authState.token, authState.userId);
    
    const transactionNoId = {...transaction};
    delete transactionNoId.id;

    try{
        await trackerApi.updateTransaction(transaction.id, transactionNoId);
        return transaction;
    }
    catch(error){return rejectWithValue(error)}
});

export const deleteTransaction = createAsyncThunk('tracker/deleteTransaction', async (args, {getState, rejectWithValue}) => {
    const authState = getState().auth
    const trackerApi = new dbTrackerApi(authState.token, authState.userId);
    try{
        await trackerApi.deleteTransaction(args.transactionId);
        return args.transactionId;
    }
    catch(error){return rejectWithValue(error)}
});



const trackerSlice = createSlice({
    name: 'tracker',
    initialState: {
        transactions: [],
        error: null,
        loading: false,
    },

    extraReducers: {
        [fetchTransactions.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [fetchTransactions.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [fetchTransactions.fulfilled]: (state, action) => {
            state.loading = false;
            state.transactions = action.payload;
        },
        
        [addTransaction.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [addTransaction.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [addTransaction.fulfilled]: (state, action) => {
            state.loading = false;
            state.transactions.push(action.payload)
        },

        [updateTransaction.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [updateTransaction.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [updateTransaction.fulfilled]: (state, action) => {
            const transactionIndex = state.transactions.findIndex(t => t.id == action.payload.id)
            state.loading = false;
            state.transactions[transactionIndex] = action.payload;
        },

        [deleteTransaction.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [deleteTransaction.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [deleteTransaction.fulfilled]: (state, action) => {
            state.loading = false;
            state.transactions = state.transactions.filter(t => t.id !== action.payload)
        },

        [logout]:(state) => {
            state.transactions = []; //Delete all the transactions from the state when the user logout
        }
    }
});

export default trackerSlice.reducer;