import axios from 'axios';

const API_URL = '/api/users';

export const authService = {
  async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}/signup`, userData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registration failed. Please try again later.');
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const userData = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw new Error('Invalid username or password');
    }
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  getDashboardRoute(user) {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'MINE_ADMIN':
        return '/mine-admin/dashboard';
      case 'USER':
        return '/dashboard';
      default:
        return '/';
    }
  }
};