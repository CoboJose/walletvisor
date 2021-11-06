import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './auth';

interface ConfigState {
  theme: string
  isLoading: boolean;
}

const initialState: ConfigState = {
  theme: 'dark',
  isLoading: false,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    changeTheme: (state) => {
      const previusTheme = state.theme;

      if (previusTheme === 'dark') {
        setLightColors();
        state.theme = 'light';
      }
      else {
        setDarkColors();
        state.theme = 'dark';
      }
    },
    initTheme: (state) => {
      const localStorageTheme = localStorage.getItem('theme');
      const initialTheme = localStorageTheme != null ? localStorageTheme : 'dark';

      if (initialTheme === 'dark') {
        setDarkColors();
        state.theme = 'dark';
      }
      else {
        setLightColors();
        state.theme = 'light';
      }
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    //LOGOUT
    builder.addCase(logout, (state) => {
      return { theme: state.theme, isLoading: false };
    });
  },
});

const setLightColors = (): void => {
  localStorage.setItem('theme', 'light');
  document.documentElement.style.setProperty('--backgroundColor', 'var(--lightBackground)');
  document.documentElement.style.setProperty('--paperColor', 'var(--lightPaper)');
  document.documentElement.style.setProperty('--primaryColor', 'var(--lightPrimary)');
  document.documentElement.style.setProperty('--secondaryColor', 'var(--lightSecondary)');
  document.documentElement.style.setProperty('--errorColor', 'var(--lightError)');
  document.documentElement.style.setProperty('--warningColor', 'var(--lightWarning)');
  document.documentElement.style.setProperty('--infoColor', 'var(--lightInfo)');
  document.documentElement.style.setProperty('--successColor', 'var(--lightSuccess)');
  document.documentElement.style.setProperty('--disabledColor', 'var(--lightDisabled)');
};

const setDarkColors = (): void => {
  localStorage.setItem('theme', 'dark');
  document.documentElement.style.setProperty('--backgroundColor', 'var(--darkBackground)');
  document.documentElement.style.setProperty('--paperColor', 'var(--darkPaper)');
  document.documentElement.style.setProperty('--primaryColor', 'var(--darkPrimary)');
  document.documentElement.style.setProperty('--secondaryColor', 'var(--darkSecondary)');
  document.documentElement.style.setProperty('--errorColor', 'var(--darkError)');
  document.documentElement.style.setProperty('--warningColor', 'var(--darkWarning)');
  document.documentElement.style.setProperty('--infoColor', 'var(--darkInfo)');
  document.documentElement.style.setProperty('--successColor', 'var(--darkSuccess)');
  document.documentElement.style.setProperty('--disabledColor', 'var(--darkDisabled)');
};

export const { initTheme, changeTheme } = configSlice.actions;
export default configSlice.reducer;
