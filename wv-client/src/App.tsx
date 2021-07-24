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
  logger.info('aa');

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();
  const history = useHistory();

  const removeLoadingHTML = () => {
    const loadingHTML = document.getElementById('app-loading-index');
    if (loadingHTML) {
      loadingHTML.classList.add('ready'); // fade out
      setTimeout(() => {
        loadingHTML.outerHTML = ''; // remove from DOM
      }, (0.5 * 1000));
    }
  };

  useEffect(() => {
    // If there is a refresh token stored, log in the user, and remove the loading screen once logged in
    const refreshTkn = localStorage.getItem('refreshToken');
    if (refreshTkn != null) {
      api.refreshToken(refreshTkn)
        .then((refreshResponse: LoginResponse) => {
          dispatch(refreshToken(refreshResponse));
          history.push('/home');
          removeLoadingHTML();
        })
        .catch((error) => {
          const err: ApiError = error;
          logger.error(apiErrors(err.code));
          dispatch(logout());
          window.location.reload();
        });
    }
    // Else, test if there is connection with the server, and remove the loading screen
    else {
      api.ping()
        .then(() => {
          removeLoadingHTML();
        })
        .catch((error) => {
          const err: ApiError = error;
          logger.error(apiErrors(err.code));
          window.alert('The server is not responding. Please contact with cobogue@gmail.com');
        });
    }
  }, []);

  return (
    <Routes />
  );
};

export default App;
