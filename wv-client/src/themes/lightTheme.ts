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
