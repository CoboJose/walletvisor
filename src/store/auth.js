import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {dbAuthApi} from '../serverAPI/ServerAPI';

const authApi = new dbAuthApi();

export const authorize = createAsyncThunk('auth/authorize', async (args, {rejectWithValue, dispatch}) => {
    const authData = {
        email: args.email,
        password: args.password,
        returnSecureToken: true,
    }
    try {
        const response = await (args.isLogin ? authApi.login(authData) : authApi.signUp(authData));
        
        const to = setTimeout(() => dispatch(authWithRefreshTkn({refreshToken: response.data.refreshToken})), (response.data.expiresIn - 5)*1000);
        args.remember && localStorage.setItem('refreshToken', response.data.refreshToken);
        
        return {...response.data, to};
    } 
    catch (error) {return rejectWithValue(error.response.data)}
});

export const authWithRefreshTkn = createAsyncThunk('auth/authWithRefreshTkn', async (args, {rejectWithValue, dispatch}) => {
        try{
            const response = await authApi.authWithRefrehTkn(args.refreshToken);
            const to = setTimeout(() => dispatch(authWithRefreshTkn({refreshToken: response.data.refresh_token})), (response.data.expires_in - 5)*1000);
            return {...response.data, to}
        }
        catch(error){return rejectWithValue(error.response.data)}
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        userId: null,
        error: null,
        loading: false,
        to: null,
    },

    reducers: {
        logout: {
            reducer: (state) => {
                state.token = null;
                state.userId = null;
                clearTimeout(state.to)
                state.to = null;
            },
            prepare: () => {
                localStorage.removeItem('refreshToken');
                return {};
            }
        },
    },

    extraReducers: {
        [authorize.pending]: (state) => {
            state.loading = true;
        },
        [authorize.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [authorize.fulfilled]: (state, action) => {
            state.loading = false;
            state.token = action.payload.idToken;
            state.userId = action.payload.localId;
            state.to = action.payload.to;
        },

        [authWithRefreshTkn.pending]: (state) => {
            state.loading = true;
        },
        [authWithRefreshTkn.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
            state.token = null;
            state.userId = null;
        },
        [authWithRefreshTkn.fulfilled]: (state, action) => {
            state.loading = false;
            state.token = action.payload.id_token;
            state.userId = action.payload.user_id;
            state.to = action.payload.to;
        },
    }
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;