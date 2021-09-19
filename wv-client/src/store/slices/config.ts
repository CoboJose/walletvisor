import { createSlice } from '@reduxjs/toolkit';

interface ConfigState {
  theme: string
}

const initialState: ConfigState = {
  theme: 'dark',
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    changeTheme: (state) => {
      const previusTheme = state.theme;

      if (previusTheme === 'dark') {
        state.theme = 'light';
        localStorage.setItem('theme', 'light');
        document.documentElement.style.setProperty('--primaryColor', 'var(--lightPrimary)');
        document.documentElement.style.setProperty('--secondaryColor', 'var(--lightSecondary)');
      }
      else {
        state.theme = 'dark';
        localStorage.setItem('theme', 'dark');
        document.documentElement.style.setProperty('--primaryColor', 'var(--darkPrimary)');
        document.documentElement.style.setProperty('--secondaryColor', 'var(--darkSecondary)');
      }
    },
    initTheme: (state) => {
      const localStorageTheme = localStorage.getItem('theme');
      const initialTheme = localStorageTheme != null ? localStorageTheme : 'dark';

      if (initialTheme === 'dark') {
        state.theme = 'dark';
        localStorage.setItem('theme', 'dark');
        document.documentElement.style.setProperty('--primaryColor', 'var(--darkPrimary)');
        document.documentElement.style.setProperty('--secondaryColor', 'var(--darkSecondary)');
      }
      else {
        state.theme = 'light';
        localStorage.setItem('theme', 'light');
        document.documentElement.style.setProperty('--primaryColor', 'var(--lightPrimary)');
        document.documentElement.style.setProperty('--secondaryColor', 'var(--lightSecondary)');
      }
    },
  },
});

export const { initTheme, changeTheme } = configSlice.actions;
export default configSlice.reducer;