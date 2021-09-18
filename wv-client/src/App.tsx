import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { refreshToken, logout } from 'store/slices/auth';
import { initTheme } from 'store/slices/config';
import Routes from 'routes/Routes';
import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { AuthResponse, ApiError } from 'types/types';
import LoadingTopBar from 'components/ui/loading/LoadingTopBar';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import lightTheme from 'themes/lightTheme';
import darkTheme from 'themes/darkTheme';

const App: React.FC = () => {
  logger.rendering();

  ///////////
  // REDUX //
  ///////////
  const themeRedux = useAppSelector((state) => state.config.theme);
  const theme = themeRedux === 'dark' ? { ...darkTheme } : { ...lightTheme }; //Material UI needs a shallow copy to rerender

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();
  const history = useHistory();

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    // Init the theme
    dispatch(initTheme());
    
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
          logger.error(error);
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingTopBar />
      <Routes />
    </ThemeProvider>
  );
};

export default App;
