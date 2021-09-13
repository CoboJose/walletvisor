import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import lightTheme from 'themes/lightTheme';
import darkTheme from 'themes/darkTheme';

import store from 'store/store';
import App from './App';

import './index.scss';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const theme = localStorage.getItem('theme') === 'light' ? lightTheme : darkTheme;

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Router>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Progresive web app service worker registration
serviceWorkerRegistration.register();
