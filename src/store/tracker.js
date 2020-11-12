import { createAsyncThunk, createSlice, unwrapResult } from '@reduxjs/toolkit'
import axios from 'axios';
import {dbTrackerApi} from '../serverAPI/ServerAPI';

const trackerApi = new dbTrackerApi();

export const fetchTransactions = createAsyncThunk(
    'tracker/fetchTransactions',
    async (token) => {
        console.log('Here')
        const url = trackerApi.addTransaction(token, null);
        const response = await axios.get(url);
        console.log(response)
        return response.data
    }
)


const trackerSlice = createSlice({
    name: 'tracker',
    initialState: {
        debug: {recharging:false},
        transactions: [],
        error: null,
        loading: false,
    },

    /*reducers: {

    },*/

    extraReducers: {
        [fetchTransactions.fulfilled]: (state, action) => {
            state.error = 'Here'
        }
    }
});

export default trackerSlice.reducer;