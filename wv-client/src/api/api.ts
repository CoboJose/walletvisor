import { axiosInstance as axios, axiosNoInterceptorInstance as axsNoInterceptor } from 'api/axiosInstance';
import { LoginResponse, ApiError } from 'types/api';

const UNEXPECTED_ERROR: ApiError = { code: 'GE000', message: 'Unexpected Error, please contact with cobogue@gmail.com', debug: '' };

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

const login = async (email: string, password: string): Promise<LoginResponse> => {
  const url = '/auth/login';
  const data = { email, password };

  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data.error : UNEXPECTED_ERROR); });
  });
};

const refreshToken = async (refreshTkn: string): Promise<LoginResponse> => {
  const url = '/auth/refreshToken';
  axsNoInterceptor.defaults.headers.common.refreshToken = refreshTkn;
  
  return new Promise((resolve, reject) => {
    axsNoInterceptor.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response ? error.response.data.error : UNEXPECTED_ERROR); });
  });
};

export default { ping, login, refreshToken };
