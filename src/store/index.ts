import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import nurseReducer from './slices/nurseSlice';
import { api } from './api';

export const store = configureStore({
  reducer: {
    app: appReducer,
    nurse: nurseReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
