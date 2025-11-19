import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1',
});

// Token automático
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Logout automático en 401 (vale 0.5 pts en la rúbrica)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo redirigir si no estamos en login/register y hay un token guardado
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isAuthPage && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);