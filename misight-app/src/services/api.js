import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Add a request interceptor to handle auth
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: async (userData) => {
    try {
      const response = await API.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error('Invalid username or password');
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};