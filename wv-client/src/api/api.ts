import { axiosInstance as axios, axiosNoInterceptorInstance as axsNoInterceptor } from 'api/axiosInstance';
import { AuthResponse, ApiError, Transaction } from 'types/types';
import store from 'store/store';
import { addLoading, removeLoading } from 'store/slices/loading';

const UNEXPECTED_ERROR: ApiError = { code: 'GE000', message: 'Unexpected Error, please contact with cobogue@gmail.com', debugMessage: '' };

// Used to test the conection, and wake up the server
const ping = async (): Promise<string> => {
  const url = '/ping';

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data.error : UNEXPECTED_ERROR); });
  });
};

//////////
// AUTH //
//////////

const login = async (email: string, password: string): Promise<AuthResponse> => {
  const url = '/auth/login';
  const data = { email, password };

  store.dispatch(addLoading());

  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); })
      .finally(() => { store.dispatch(removeLoading()); });
  });
};

const register = async (email: string, password: string): Promise<AuthResponse> => {
  const url = '/auth/signup';
  const data = { email, password };

  store.dispatch(addLoading());

  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); })
      .finally(() => { store.dispatch(removeLoading()); });
  });
};

const refreshToken = async (refreshTkn: string): Promise<AuthResponse> => {
  const url = '/auth/refreshToken';
  axsNoInterceptor.defaults.headers.common.refreshToken = refreshTkn;
  
  return new Promise((resolve, reject) => {
    axsNoInterceptor.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data.error : UNEXPECTED_ERROR); });
  });
};

//////////////////
// TRANSACTIONS //
//////////////////

const addTransaction = async (transaction: Transaction): Promise<AuthResponse> => {
  const url = '/transactions';
  const data = transaction;

  store.dispatch(addLoading());

  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); })
      .finally(() => { store.dispatch(removeLoading()); });
  });
};

export default { ping, login, register, refreshToken, addTransaction };
