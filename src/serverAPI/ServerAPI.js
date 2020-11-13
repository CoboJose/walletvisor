import axios from 'axios';

export class dbAuthApi {
    constructor() {
        this.BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
        this.API_KEY = 'AIzaSyCWNRiy2aAlXKX93xI57uF25dXMpcb-HWw';
    }

    login(data){
        const url = this.BASE_URL + 'signInWithPassword?key=' + this.API_KEY
        return new Promise(function(resolve, reject){
            axios.post(url, data)
                .then(res => {
                    resolve({
                        token: res.data.idToken,
                        userId: res.data.localId,
                    })
                })
                .catch(error => {
                    console.log(error)
                    reject({
                        error: 'error.response.data'
                    })
                })
            });
    }

    signUp(data) {
        const url = this.BASE_URL + 'signUp?key=' + this.API_KEY
        return axios.post(url, data);
    }
    authWithRefrehTkn(refreshToken) {
        const url = 'https://securetoken.googleapis.com/v1/token?key=' + this.API_KEY;
        const data = 'grant_type=refresh_token&refresh_token=' + refreshToken;
        return axios.post(url, data);
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
