import { createTheme } from '@material-ui/core/styles';
import colors from 'themes/themes.module.scss';

console.log(colors);

const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#673AB7',
    },
    secondary: {
      main: '#9E9E9E',
    },
  },
});

export default darkTheme;
