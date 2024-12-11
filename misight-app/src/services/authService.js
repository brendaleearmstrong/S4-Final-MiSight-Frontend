const USERS_KEY = 'misight_users';
const CURRENT_USER_KEY = 'misight_current_user';

// Demo users with different roles
const defaultUsers = [
  { username: 'admin', password: 'admin123', role: 'ADMIN' },
  { username: 'mine_admin', password: 'mine123', role: 'MINE_ADMIN' },
  { username: 'user', password: 'user123', role: 'USER' }
];

// Initialize default users if none exist
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
}

export const authService = {
  login: (credentials) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    const user = users.find(
      u => u.username === credentials.username && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  signup: (userData) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if username already exists
    if (users.some(user => user.username === userData.username)) {
      throw new Error('Username already exists');
    }

    // Add new user
    const newUser = {
      ...userData,
      role: userData.role || 'USER' // Default to USER role if none specified
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  }
};