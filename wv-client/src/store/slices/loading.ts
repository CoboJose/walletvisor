import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  loadingCounter: number
  isLoading: boolean
}

const initialState: LoadingState = {
  loadingCounter: 0,
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    addLoading: (state) => {
      state.loadingCounter += 1;
      state.isLoading = state.loadingCounter > 0;
    },
    removeLoading: (state) => {
      state.loadingCounter -= 1;
      state.isLoading = state.loadingCounter > 0;
    },
  },
});

export const { addLoading, removeLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
