import { createTheme } from '@material-ui/core/styles';
import theme from './theme.module.scss';

const lightTheme = createTheme({
  palette: {
    primary: {
      main: theme.lightPrimary,
    },
    secondary: {
      main: theme.lightSecondary,
    },
  },
});

export default lightTheme;
