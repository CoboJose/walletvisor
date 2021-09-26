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
  },

  overrides: {
    MuiRadio: {
      colorSecondary: {
        '&$checked': {
          color: theme.darkPrimary
        },
      },
    },
  },

});

export default darkTheme;
