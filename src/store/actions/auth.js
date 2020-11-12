import axios from 'axios'

import {dbAuthApi} from '../../serverAPI/ServerAPI';
import * as actionTypes from './actionTypes';

const authApi = new dbAuthApi();

export const auth = (email, password, remember, isSignIn) => {
    return dispatch => {

        dispatch(authStart());

        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        
        const url = isSignIn ? authApi.login() : authApi.signUp();
        axios.post(url, authData)
            .then(response => {
                remember && localStorage.setItem('refreshToken', response.data.refreshToken);

                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(getNewTokenTimeout(response.data.refreshToken, response.data.expiresIn))
            })
            .catch(error => {
                dispatch(authFail(error.response.data.error));
            });
    }
}

export const tryAutoLogIn = () => {
    return dispatch => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken !== null) {
            dispatch(getNewTokenTimeout(refreshToken, 0));
        }
    };
};

export const logout = () => {
    localStorage.removeItem('refreshToken');
    console.log(authApi.refreshToken())
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
}


const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    }
}

const authSuccess = (idToken, localId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: idToken,
        userId: localId,
    };
}

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
}

// set a timer for the duration of the token, and when it expires, request a new one
const getNewTokenTimeout = (refreshToken, expirationTime) => {
    return dispatch => {
        
        setTimeout(() => {
            
            const url = authApi.refreshToken(refreshToken);
            axios.post(url.url, url.data)
                .then(response => {
                    console.log('refreshing token')
                    dispatch(authSuccess(response.data.id_token, response.data.user_id));
                    dispatch(getNewTokenTimeout(response.data.refresh_token, response.data.expires_in));
                })
                .catch(error => {
                    dispatch(authFail(error.response.data.error));
                });

        }, (expirationTime > 0) ? ((expirationTime - 5) * 1000) : 0);
    };
};