import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';
import { refreshToken, logout } from 'store/slices/auth';
import Routes from 'routes/Routes';
import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { AuthResponse, ApiError } from 'types/types';
import LoadingTopBar from 'components/ui/loading/LoadingTopBar';

const App: React.FC = () => {
  logger.rendering();

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();
  const history = useHistory();

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    // If there is a refresh token stored, log in the user, and remove the loading screen once logged in
    const refreshTkn = localStorage.getItem('refreshToken');
    if (refreshTkn != null) {
      api.refreshToken(refreshTkn)
        .then((authResponse: AuthResponse) => {
          dispatch(refreshToken(authResponse));
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

  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////
  const removeLoadingHTML = () => {
    const loadingHTML = document.getElementById('app-loading-index');
    if (loadingHTML) {
      loadingHTML.classList.add('ready'); // fade out
      setTimeout(() => {
        loadingHTML.outerHTML = ''; // remove from DOM
      }, (0.5 * 1000));
    }
  };

  /////////
  // JSX //
  /////////
  return (
    <>
      <LoadingTopBar />
      <Routes />
    </>
  );
};

export default App;
