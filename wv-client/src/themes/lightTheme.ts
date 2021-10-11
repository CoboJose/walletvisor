/* eslint-disable camelcase */
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import theme from './theme.module.scss';

const lightTheme = unstable_createMuiStrictModeTheme({
  palette: {
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

  overrides: {
    MuiRadio: {
      colorSecondary: {
        '&$checked': {
          color: theme.lightPrimary
        },
      },
    },
  },

});

export default lightTheme;
