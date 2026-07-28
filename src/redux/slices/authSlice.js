import { createSlice } from '@reduxjs/toolkit';

const safeParseJSON = (str) => {
  try {
    return str && str !== 'undefined' ? JSON.parse(str) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: safeParseJSON(localStorage.getItem('ai-interview-user')),
  token: localStorage.getItem('ai-interview-token') || null,
  isAuthenticated: !!localStorage.getItem('ai-interview-token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('ai-interview-token', action.payload.token);
      localStorage.setItem('ai-interview-user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('ai-interview-token');
      localStorage.removeItem('ai-interview-user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('ai-interview-user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, clearError } =
  authSlice.actions;
export default authSlice.reducer;
