// src/services/auth.js
export const authAPI = {
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    return !!user;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  hasRole: (requiredRole) => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    const userData = JSON.parse(user);
    return userData.role === requiredRole;
  },

  getProtectedRoute: (role) => {
    switch (role) {
      case 'ADMIN':
        return '/pages/AdminDashboard';
      case 'MINE_ADMIN':
        return '/pages/MineAdminDashboard';
      case 'USER':
        return '/pages/UserDashboard';
      default:
        return '/login';
    }
  }
};

export default authAPI;