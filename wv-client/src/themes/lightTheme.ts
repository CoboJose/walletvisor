/* eslint-disable camelcase */
import { createTheme } from '@mui/material';
import theme from './theme.module.scss';

const lightTheme = createTheme({
  palette: {
    background: {
      default: theme.lightBackground,
      paper: theme.lightPaper,
    },
    primary: {
      main: theme.lightPrimary,
    },
    secondary: {
      main: theme.lightSecondary,
    },
    error: {
      main: theme.lightError,
    },
    warning: {
      main: theme.lightWarning,
    },
    info: {
      main: theme.lightInfo,
    },
    success: {
      main: theme.lightSuccess,
    },
  },

});

export default lightTheme;
