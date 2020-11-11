import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/actionTypes';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
}

const reducer = createReducer(initialState, {
    
    [actions.AUTH_START] (state){
        state.loading = true;
    },

    [actions.AUTH_SUCCESS] (state, action){
        state.token = action.token;
        state.userId = action.userId;
        state.loading = false;
    },

    [actions.AUTH_FAIL] (state, action){
        state.error = action.error;
        state.loading = false;
    },

    [actions.AUTH_LOGOUT] (state){
        state.token = null;
        state.userId = null;
    },
})

export default reducer;