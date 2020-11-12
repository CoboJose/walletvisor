import { createAsyncThunk, createSlice, unwrapResult } from '@reduxjs/toolkit'
import {dbAuthApi} from '../serverAPI/ServerAPI';

const authApi = new dbAuthApi();

export const logIn = createAsyncThunk('auth/logIn', async (args, { rejectWithValue }) => {

    const authData = {
        email: args.email,
        password: args.password,
        returnSecureToken: true,
    }
    try {
        const response = await authApi.login(authData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        userId: null,
        error: null,
        loading: false,
    },

    reducers: {
        error(state){
            state.error = 'Funca';
        },
    },

    extraReducers: {
        [logIn.pending]: (state) => {
            state.loading = true;
        },
        [logIn.rejected]: (state, action) => {
            state.loading = false;
            console.log(action)
            state.error = action.payload.error;
        },
        [logIn.fulfilled]: (state, action) => {
            state.loading = false;
            state.token = action.payload.idToken;
            state.userId = action.payload.localId;
        },
    }
});

export const {error} = authSlice.actions;
export default authSlice.reducer;