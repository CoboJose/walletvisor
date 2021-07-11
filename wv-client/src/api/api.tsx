/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';

////////////////////
// AXIOS INSTANCE //
////////////////////

// Axios Base Instance
const axs = axios.create({
  baseURL: process.env.REACT_APP_API_URL!,
});

// Before each use of the axios instance, get the latest token
axs.interceptors.request.use((config) => {
  const token = 'token';
  config.headers.token = token;
  return config;
});

///////////
// CALLS //
///////////

/** Used to test the conection, and wake up the server */
export const ping = async (): Promise<unknown> => {
  const url = '/ping';
  
  return new Promise((resolve, reject) => {
    axs.get(url)
      .then((res) => resolve({
        data: res.data,
      }))
      .catch((err) => reject({
        error: err,
      }));
  });
};

//////////
// AUTH //
//////////

export const login = (email: string, password: string): Promise<unknown> => {
  const url = '/auth/login';
  const data = { email, password };
  
  return new Promise((resolve, reject) => {
    axs.post(url, data)
      .then((res) => resolve({
        data: res.data,
      }))
      .catch((err) => reject({
        code: err.response.data.error.code,
        msg: err.response.data.error.msg,
      }));
  });
};
