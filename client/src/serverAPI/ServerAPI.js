import axios from 'axios';

export class dbAuthApi {
    constructor() {
        this.API_KEY = 'AIzaSyCWNRiy2aAlXKX93xI57uF25dXMpcb-HWw';
        this.BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
        this.AUTH_REFRESH_TOKEN_BASE_URL = 'https://securetoken.googleapis.com/v1/token?key=';
        this.AUTH_REFRESH_TOKEN_DATA = 'grant_type=refresh_token&refresh_token=';
        this.AUTH_DATA = {
            returnSecureToken: true,
        }
    }

    login(email,password){
        const url = this.BASE_URL + 'signInWithPassword?key=' + this.API_KEY;
        const data = {...this.AUTH_DATA, email, password};
        // We could return axios.post(url,data) directly, asi it returns a promise, but this way
        // we can change the parameters, so the app is totally independent of the server API.
        return new Promise(function(resolve, reject){
            axios.post(url, data)
                .then(res => resolve({
                        token: res.data.idToken,
                        userId: res.data.localId,
                        refreshToken: res.data.refreshToken,
                        expiresIn: res.data.expiresIn,
                }))
                .catch(error => reject({
                        code: error.response.data.error.code,
                        message: error.response.data.error.message,
                }));
        });
    }

    signUp(email,password) {
        const url = this.BASE_URL + 'signUp?key=' + this.API_KEY;
        const data = {...this.AUTH_DATA, email, password};

        return new Promise(function(resolve, reject){
            axios.post(url, data)
                .then(res => resolve({
                    token: res.data.idToken,
                    userId: res.data.localId,
                    refreshToken: res.data.refreshToken,
                    expiresIn: res.data.expiresIn,
                }))
                .catch(error => reject({
                    code: error.response.data.error.code,
                    message: error.response.data.error.message,
                }))
        });
    }

    authWithRefrehTkn(refreshToken) {
        const url = this.AUTH_REFRESH_TOKEN_BASE_URL + this.API_KEY;
        const data = this.AUTH_REFRESH_TOKEN_DATA + refreshToken;

        return new Promise(function(resolve, reject){
            axios.post(url, data)
                .then(res => resolve({
                    token: res.data.id_token,
                    userId: res.data.user_id,
                    refreshToken: res.data.refresh_token,
                    expiresIn: res.data.expires_in,
                }))
                .catch(error => reject({
                    code: error.response.data.error.code,
                    message: error.response.data.error.message,
                }))
        });
    }
}

export class dbTrackerApi {
    constructor(token, userId) {
        this.BASE_URL = 'https://walletvisor.firebaseio.com';
        this.JSON = '.json';
        this.userId = userId;
        this.auth = 'auth=' + token;
    }

    fetchTransactions() {
        const url = this.BASE_URL + '/transactions/' + this.userId + this.JSON;
        const params = '?' + this.auth;

        return new Promise(function(resolve, reject){
            axios.get(url+params)
                .then(res => resolve({
                    transactions: res.data,
                }))
                .catch(error => reject({
                    error:error.response,
                }))
        });
    }
    
    addTransaction(transaction) {
        const url = this.BASE_URL + '/transactions/' + this.userId + this.JSON;
        const params = '?' + this.auth;

        return new Promise(function(resolve, reject){
            axios.post(url+params, transaction)
                .then(res => resolve({
                    id: res.data.name,
                }))
                .catch(error => reject({
                    message: error.response.data.error,
                    code: error.response.status,
                    codeText: error.response.statusText
                }))
        });
    }

    updateTransaction(transactionId, transaction) {
        const url = this.BASE_URL + '/transactions/' + this.userId + '/' + transactionId + this.JSON;
        const params = '?' + this.auth;

        return new Promise(function(resolve, reject){
            axios.put(url+params, transaction)
                .then(res => resolve({
                    res: res,
                }))
                .catch(error => reject({
                    error:error.response,
                }))
        });
    }

    deleteTransaction(transactionId) {
        const url = this.BASE_URL + '/transactions/' + this.userId + '/' + transactionId + this.JSON;
        const params = '?' + this.auth;

        return new Promise(function(resolve, reject){
            axios.delete(url+params)
                .then(res => resolve({
                    res: res,
                }))
                .catch(error => reject({
                    error:error.response,
                }))
        });
    }
}
