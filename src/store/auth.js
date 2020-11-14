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
        //The token has a 'expiresIn' lifespan. a timeout is set to request a new token in this time - 5 seconds.
        const timer = setTimeout(() => dispatch(authWithRefreshTkn({refreshToken: response.refreshToken})), (response.expiresIn - 5)*1000);
        //If the user want to autologin, we store the refresh token in the local storage
        args.remember && localStorage.setItem('refreshToken', response.refreshToken);

        return {...response, timer};
    } 
    catch (error) {return rejectWithValue(error)}
});

export const authWithRefreshTkn = createAsyncThunk('auth/authWithRefreshTkn', async (args, {rejectWithValue, dispatch}) => {
        try{
            const response = await authApi.authWithRefrehTkn(args.refreshToken);
            const timer = setTimeout(() => dispatch(authWithRefreshTkn({refreshToken: response.data.refresh_token})), (response.data.expires_in - 5)*1000);
            return {...response.data, timer}
        }
        catch(error){ console.log(error)/*return rejectWithValue(error)*/}
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        userId: null,
        error: null,
        loading: false,
        timer: null,
    },

    reducers: {
        logout: {
            reducer: (state) => {
                state.token = null;
                state.userId = null;
                //The setted timeout is deleted to prevnt an unwanted autologin
                clearTimeout(state.timer)
                state.timer = null;
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
            state.error = action.payload.message;
        },
        [authorize.fulfilled]: (state, action) => {
            state.loading = false;
            state.timer = action.payload.timer;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
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
            state.timer = action.payload.timer;
        },
    }
});
/*
export const authorize = (args) => async dispatch => {
    dispatch(authSlice.actions.authPending());
    const authData = {
        email: args.email,
        password: args.password,
        returnSecureToken: true,
    }
    const response = await authApi.login(authData);
    console.log(response)
    console.log('Here')
    dispatch(authSlice.actions.authFullfiled(response.data))
}*/

export const {logout} = authSlice.actions;
export default authSlice.reducer;