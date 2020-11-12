export class dbAuthApi {
    constructor(){
        this.BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';
        this.API_KEY = 'AIzaSyCWNRiy2aAlXKX93xI57uF25dXMpcb-HWw';
    }

    login(){
        return this.BASE_URL + 'signInWithPassword?key=' + this.API_KEY;
    }
    signUp(){
        return this.BASE_URL + 'signUp?key=' + this.API_KEY;
    }
    refreshToken(refreshToken){
        return {
            url: 'https://securetoken.googleapis.com/v1/token?key=' + this.API_KEY,
            data: 'grant_type=refresh_token&refresh_token=' + refreshToken,
        };
    }
}

export class dbTrackerApi {
    constructor(){
        this.BASE_URL = 'https://walletvisor.firebaseio.com';
    }

    addTransaction(token){
        return this.BASE_URL + '/transactions.json?auth=' + token;
    }
    getTransactions(token, userId){
        console.log(userId)
        return this.BASE_URL + '/transactions.json?auth=' + token;
    }
}
