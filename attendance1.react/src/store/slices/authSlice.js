import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(payload.user));
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer; 