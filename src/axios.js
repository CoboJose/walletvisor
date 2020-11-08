import axios from 'axios';

const instance = axios.create({
    baseURL:'https://walletvisor.firebaseio.com/',
});

export default instance;