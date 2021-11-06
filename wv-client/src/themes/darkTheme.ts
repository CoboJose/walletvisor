import { createTheme } from '@mui/material';
import theme from './theme.module.scss';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: theme.darkBackground,
      paper: theme.darkPaper,
    },
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

});

export default darkTheme;
