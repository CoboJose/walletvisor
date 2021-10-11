/* eslint-disable camelcase */
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import theme from './theme.module.scss';

const darkTheme = unstable_createMuiStrictModeTheme({
  palette: {
    type: 'dark',
    primary: {
      main: theme.darkPrimary,
    },
    secondary: {
      main: theme.darkSecondary,
    },
    error: {
      main: theme.darkError,
    },
    warning: {
      main: theme.darkWarning,
    },
    info: {
      main: theme.darkInfo,
    },
    success: {
      main: theme.darkSuccess,
    },
  },

  overrides: {
    MuiRadio: {
      colorSecondary: {
        '&$checked': {
          color: theme.darkPrimary
        },
      },
    },
    MuiButton: {
      root: {
        '&test': {
          color: theme.darkInfo
        },
      },
    },
  },

});

export default darkTheme;
