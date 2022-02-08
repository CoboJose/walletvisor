import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { refreshToken, logout } from 'store/slices/auth';
import { initTheme } from 'store/slices/config';
import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { ApiError } from 'types/types';
import LoadingTopBar from 'components/ui/loading/LoadingTopBar';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import DateAdapter from '@mui/lab/AdapterDateFns';
import es from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import lightTheme from 'themes/lightTheme';
import darkTheme from 'themes/darkTheme';
import View from 'components/view/View';
import { getUser } from 'store/slices/user';

const App: React.FC = () => {
  logger.rendering();

  ///////////
  // REDUX //
  ///////////
  const themeRedux = useAppSelector((state) => state.config.theme);
  const theme = themeRedux === 'dark' ? darkTheme : lightTheme;

  ///////////
  // HOOKS //
  ///////////
  const dispatch = useAppDispatch();
  const history = useHistory();

  ///////////
  // STATE //
  ///////////

  ////////////////
  // USE EFFECT //
  ////////////////
  useEffect(() => {
    // Init the theme
    dispatch(initTheme());

    // If there is a refresh token stored, log in the user, and remove the loading screen once logged in
    const refreshTkn = localStorage.getItem('refreshToken');
    if (refreshTkn != null) {
      dispatch(refreshToken(refreshTkn)).unwrap()
        .then(() => {
          dispatch(getUser()).unwrap().then(() => {
            history.push('/transactions');
            removeLoadingHTML();
          }).catch((error) => {
            const err = error as ApiError;
            logger.error(apiErrors(err.code));
            dispatch(logout());
            window.location.reload();
          });
        })
        .catch((error) => {
          const err = error as ApiError;
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
    <LocalizationProvider dateAdapter={DateAdapter} locale={es}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoadingTopBar />
        <View />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default App;
