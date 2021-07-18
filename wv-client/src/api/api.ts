import { axiosInstance as axios, axiosNoInterceptorInstance as axsNoInterceptor } from 'api/axiosInstance';
import { LoginResponse } from 'types/api';

// Used to test the conection, and wake up the server
const ping = async (): Promise<string> => {
  const url = '/ping';

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response.data.error); });
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
      .catch((error) => { reject(error.response.data.error); });
  });
};

const refreshToken = async (refreshTkn: string): Promise<LoginResponse> => {
  const url = '/auth/refreshToken';
  axsNoInterceptor.defaults.headers.common.refreshToken = refreshTkn;
  
  return new Promise((resolve, reject) => {
    axsNoInterceptor.get(url)
      .then((response) => { resolve(response.data); })
      .catch((error) => { reject(error.response.data.error); });
  });
};

export default { ping, login, refreshToken };
