/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import store from 'store/store';

import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { ApiError, LoginResponse } from 'types/api';
import { refreshToken, logout } from 'store/slices/auth';

// Axios Base Instance
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL!,
});

// Axios No Interceptor instance
export const axiosNoInterceptorInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL!,
});
  
// Before each use of the axios instance, get the latest token
axiosInstance.interceptors.request.use((config) => {
  // Refresh the token if it has expired
  checkRefreshToken();

  // Set the token as a header for the authenticationn requests
  config.headers.token = store.getState().auth.token;
  
  return config;
});

const checkRefreshToken = () => {
  const authState = store.getState().auth;
  const tokenExpirationDate = authState.tokenExpirationDate;
  const spareMiliseconds = 10 * 1000;

  if (Date.now() >= (tokenExpirationDate - spareMiliseconds) && tokenExpirationDate > 0) {
    logger.info('Refreshing Token');
    
    api.refreshToken(authState.refreshToken)
      .then((refreshResponse: LoginResponse) => {
        store.dispatch(refreshToken(refreshResponse));
      })
      .catch((error) => {
        const err: ApiError = error;
        logger.error(apiErrors(err.code));
        store.dispatch(logout());
      });
  }
};
