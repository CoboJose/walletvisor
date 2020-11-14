import axios from 'axios';

export class dbAuthApi {
    constructor() {
        this.BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
        this.API_KEY = 'AIzaSyCWNRiy2aAlXKX93xI57uF25dXMpcb-HWw';
    }

    login(data){
        const url = this.BASE_URL + 'signInWithPassword?key=' + this.API_KEY
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

    signUp(data) {
        const url = this.BASE_URL + 'signUp?key=' + this.API_KEY
        
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
        const url = 'https://securetoken.googleapis.com/v1/token?key=' + this.API_KEY;
        const data = 'grant_type=refresh_token&refresh_token=' + refreshToken;

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
    constructor() {
        this.BASE_URL = 'https://walletvisor.firebaseio.com';
    }

    addTransaction(token) {
        return this.BASE_URL + '/transactions.json?auth=' + token;
    }
    getTransactions(token, userId) {
        console.log(userId)
        return this.BASE_URL + '/transactions.json?auth=' + token;
    }
}
