import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  theme: 'light' | 'dark';
  language: string;
}

const initialState: AppState = {
  theme: 'light',
  language: 'en',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { setTheme, setLanguage } = appSlice.actions;
export default appSlice.reducer;
