import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import interviewReducer from './slices/interviewSlice';

/**
 * Redux Store Configuration
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    interview: interviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: import.meta.env.DEV,
});

export default store;
