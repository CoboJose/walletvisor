import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { refreshToken, logout } from 'store/slices/auth';
import { initTheme } from 'store/slices/config';
import Routes from 'routes/Routes';
import logger from 'utils/logger';
import api from 'api/api';
import apiErrors from 'api/apiErrors';
import { ApiError } from 'types/types';
import LoadingTopBar from 'components/ui/loading/LoadingTopBar';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import lightTheme from 'themes/lightTheme';
import darkTheme from 'themes/darkTheme';
import Confirmation from 'components/ui/confirmation/Confirmation';
import screenSizes from 'utils/screenSizes';

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

  ///////////
  // STATE //
  ///////////
  const [showAlert, setShowAlert] = useState<boolean>(false);

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
          history.push('/home');
          removeLoadingHTML();
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

    //Show mobile use alert if it is the first time using this device
    if (!screenSizes.isPhone() && localStorage.getItem('MobileUseAlerted') === null) {
      localStorage.setItem('MobileUseAlerted', 'true');
      setShowAlert(true);
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
      <Confirmation 
        title="Advice for computer users"
        text="This application has been designed for mobile devices. Its use on computers is possible, but the experience will be inferior."
        buttonOk="OK"
        open={showAlert}
        onOk={() => setShowAlert(false)}       
      />
    </ThemeProvider>
  );
};

export default App;
