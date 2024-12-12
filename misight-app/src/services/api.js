import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Debug interceptors
API.interceptors.request.use(request => {
  console.log('API Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
}, error => {
  console.error('Request Error:', error);
  return Promise.reject(error);
});

API.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const testAPI = {
  // Test API Connection
  testConnection: async () => {
    try {
      const response = await API.get('/');
      console.log('API Connection Test:', response.data);
      return true;
    } catch (error) {
      console.error('API Connection Test Failed:', error);
      return false;
    }
  },

  // Test User Registration
  testSignup: async () => {
    const testUser = {
      username: `testuser_${Date.now()}`,
      password: 'testpass123',
      role: 'USER'
    };

    try {
      const response = await authAPI.signup(testUser);
      console.log('Signup Test Result:', response);
      return {
        success: true,
        user: response
      };
    } catch (error) {
      console.error('Signup Test Failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Test Login with Test Accounts
  testLogin: async () => {
    const testCases = [
      { username: 'admin', password: 'admin123', expectedRole: 'ADMIN' },
      { username: 'mine', password: 'mine123', expectedRole: 'MINE_ADMIN' },
      { username: 'user', password: 'user123', expectedRole: 'USER' }
    ];

    const results = [];

    for (const testCase of testCases) {
      try {
        const response = await authAPI.login(testCase);
        results.push({
          testCase: testCase.username,
          success: response.role === testCase.expectedRole,
          expected: testCase.expectedRole,
          received: response.role
        });
      } catch (error) {
        results.push({
          testCase: testCase.username,
          success: false,
          error: error.message
        });
      }
    }

    console.log('Login Tests Results:', results);
    return results;
  },

  // Test Role-Based Access
  testRoleAccess: () => {
    const roles = ['ADMIN', 'MINE_ADMIN', 'USER'];
    const results = [];

    for (const role of roles) {
      const user = { username: 'test', role };
      localStorage.setItem('user', JSON.stringify(user));

      results.push({
        role,
        isAuthenticated: authAPI.isAuthenticated(),
        hasAdminRole: authAPI.hasRole('ADMIN'),
        hasMineAdminRole: authAPI.hasRole('MINE_ADMIN'),
        hasUserRole: authAPI.hasRole('USER')
      });
    }

    localStorage.removeItem('user');
    console.log('Role Access Test Results:', results);
    return results;
  }
};

export const authAPI = {
  signup: async (userData) => {
    try {
      console.log('Sending signup request with data:', userData);
      const response = await API.post('/users/signup', {
        username: userData.username,
        password: userData.password,
        role: userData.role || 'USER'
      });
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Full signup error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create account');
    }
  },

  login: async (credentials) => {
    try {
      // Test accounts
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const user = { username: 'admin', role: 'ADMIN' };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else if (credentials.username === 'mine' && credentials.password === 'mine123') {
        const user = { username: 'mine', role: 'MINE_ADMIN' };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else if (credentials.username === 'user' && credentials.password === 'user123') {
        const user = { username: 'user', role: 'USER' };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }

      const response = await API.post('/users/login', credentials);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid username or password');
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  hasRole: (requiredRole) => {
    const user = authAPI.getCurrentUser();
    if (!user) return false;
    return user.role === requiredRole;
  }
};

export default {
  auth: authAPI,
  test: testAPI,
  API
};