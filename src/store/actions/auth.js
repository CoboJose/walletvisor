import axios from 'axios'
import * as actionTypes from './actionTypes';

export const authStart = () => {
    
    return{
        type: actionTypes.AUTH_START,
    }
}

export const authSuccess = (responseData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: responseData.idToken,
        userId: responseData.localId,
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const auth = (email, password, isSignIn) => {
    return dispatch => {
        
        dispatch(authStart());
        
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        const authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';
        const apiKey = '?key=AIzaSyCWNRiy2aAlXKX93xI57uF25dXMpcb-HWw';
        const url = authUrl + (isSignIn ? 'signInWithPassword' : 'signUp') + apiKey;

        axios.post(url, authData)
            .then(response => {
                dispatch(authSuccess(response.data))
            })
            .catch(error => {
                dispatch(authFail(error.response.data.error))
            });
    }
}