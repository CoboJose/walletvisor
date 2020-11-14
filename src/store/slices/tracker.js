import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {dbTrackerApi} from '../../serverAPI/ServerAPI';

const trackerApi = new dbTrackerApi();

export const fetchTransactions = createAsyncThunk('tracker/fetchTransactions', async (args, {rejectWithValue}) => {
    try{
        const response = await trackerApi.fetchTransactions(args.token, args.userId);
        const transactions = []
        for(let id in response.transactions){
            transactions.push({...response.transactions[id], id})
        }
        return transactions;
    }
    catch(error){return rejectWithValue(error)}
});

export const addTransaction = createAsyncThunk('tracker/addTransaction', async (args, {rejectWithValue}) => {
    const transaction = {
        title: args.title,
        amount: Math.round(args.amount*100)/100,
        category: args.category, 
        type: args.type,
        date: args.date,
        userId: args.userId,
    }
    try{
        const response = await trackerApi.addTransaction(args.token, transaction);
        transaction.id = response.id
        return transaction;
    }
    catch(error){return rejectWithValue(error)}
});

export const updateTransaction = createAsyncThunk('tracker/updateTransaction', async (args, {rejectWithValue}) => {
    const transaction = {
        title: args.title,
        amount: Math.round(args.amount*100)/100,
        category: args.category, 
        type: args.type,
        date: args.date,
        userId: args.userId,
    }
    try{
        await trackerApi.updateTransaction(args.token,args.transactionId, transaction);
        
        return {...transaction, id: args.transactionId};
    }
    catch(error){return rejectWithValue(error)}
});

export const deleteTransaction = createAsyncThunk('tracker/deleteTransaction', async (args, {rejectWithValue}) => {
    try{
        await trackerApi.deleteTransaction(args.token, args.transactionId);
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
    }
});

export default trackerSlice.reducer;