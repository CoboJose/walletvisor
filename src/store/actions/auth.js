import axios from 'axios'
import * as actionTypes from './actionTypes';

const API_KEY = 'AIzaSyCWNRiy2aAlXKX93xI57uF25dXMpcb-HWw';

export const auth = (email, password, remember, isSignIn) => {
    return dispatch => {

        dispatch(authStart());

        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        const authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:';
        const url = authUrl + (isSignIn ? 'signInWithPassword' : 'signUp') + '?key=' + API_KEY;

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
    const refreshData = 'grant_type=refresh_token&refresh_token=' + refreshToken;
    const url = 'https://securetoken.googleapis.com/v1/token?key=' + API_KEY;

    return dispatch => {

        setTimeout(() => {
            axios.post(url, refreshData)
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