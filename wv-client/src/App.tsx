import React, { useEffect } from 'react';

import Routes from 'routes/Routes';
import logger from 'utils/logger';
import api from 'api/api';
import { refreshToken, logout } from 'store/slices/auth';
import apiErrors from 'api/apiErrors';
import { LoginResponse, ApiError } from 'types/api';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';

const App: React.FC = () => {
  logger.rendering();

  const dispatch = useAppDispatch();
  const history = useHistory();

  const removeLoadingHTML = () => {
    console.log('AA: ' + process.env.REACT_APP_API_URL);
    console.log(process.env);
    api.ping()
      .then(() => {
        const loadingHTML = document.getElementById('app-loading-index');
        if (loadingHTML) {
          loadingHTML.classList.add('ready'); // fade out
          setTimeout(() => {
            loadingHTML.outerHTML = ''; // remove from DOM
          }, (0.5 * 1000));
        }
      })
      .catch((error) => {
        const err: ApiError = error;
        logger.error('The server is down');
        logger.error(apiErrors(err.code));
      });
  };

  useEffect(() => {
    //Show the page once the server is up
    removeLoadingHTML();
    
    // Log In the user if a refresh token is present
    const refreshTkn = localStorage.getItem('refreshToken');
    if (refreshTkn != null) {
      logger.info('Refreshing Token');
      
      api.refreshToken(refreshTkn)
        .then((refreshResponse: LoginResponse) => {
          // eslint-disable-next-line no-debugger
          dispatch(refreshToken(refreshResponse));
          history.push('/home');
        })
        .catch((error) => {
          const err: ApiError = error;
          logger.error(apiErrors(err.code));
          dispatch(logout());
        });
    }
  }, []);

  return (
    <Routes />
  );
};

export default App;
