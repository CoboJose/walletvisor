import { axiosInstance as axios, axiosNoInterceptorInstance as axsNoInterceptor } from 'api/axiosInstance';
import { AuthResponse, ApiError, Transaction, GetTransactionsResponse, User, UpdateUserPayload, Group } from 'types/types';

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
  const body = { email, password };

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const register = async (email: string, password: string): Promise<AuthResponse> => {
  const url = '/auth/signup';
  const body = { email, password };

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
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
const getTransactions = async (from: number, to: number): Promise<GetTransactionsResponse> => {
  const url = '/transactions';
  const params = { from, to };

  return new Promise((resolve, reject) => {
    axios.get(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const addTransaction = async (transaction: Transaction): Promise<Transaction> => {
  const url = '/transactions';
  const body = transaction;

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const updateTransaction = async (transaction: Transaction): Promise<Transaction> => {
  const url = '/transactions';
  const body = transaction;

  return new Promise((resolve, reject) => {
    axios.put(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const deleteTransaction = async (transactionId: number): Promise<string> => {
  const url = '/transactions';
  const params = { transactionId };

  return new Promise((resolve, reject) => {
    axios.delete(url, { params })
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

//////////
// USER //
//////////
const getUser = async (): Promise<User> => {
  const url = '/user';

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => {
        const user = <User>{};
        user.id = response.data.id;
        user.email = response.data.email;
        user.name = response.data.name;
        resolve(user); 
      })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const updateUser = async (updateUserPayload: UpdateUserPayload): Promise<User> => {
  const url = '/user';
  const body = updateUserPayload;

  return new Promise((resolve, reject) => {
    axios.put(url, body)
      .then((response) => {
        const user = <User>{};
        user.id = response.data.id;
        user.email = response.data.email;
        user.name = response.data.name;
        resolve(user); 
      })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

////////////
// Groups //
////////////
const getUserGroups = async (): Promise<Group[]> => {
  const url = '/groups';

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

const createGroup = async (group: Group): Promise<Group> => {
  const url = '/groups';
  const body = group;

  return new Promise((resolve, reject) => {
    axios.post(url, body)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data : UNEXPECTED_ERROR); });
  });
};

export default { ping, login, register, refreshToken, getTransactions, addTransaction, updateTransaction, deleteTransaction, getUser, updateUser, getUserGroups, createGroup };
