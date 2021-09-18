import { createTheme } from '@material-ui/core/styles';
import theme from './theme.module.scss';

const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: theme.darkPrimary,
    },
    secondary: {
      main: theme.darkSecondary,
    },
  },
});

export default darkTheme;
