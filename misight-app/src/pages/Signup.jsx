// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form inputs
      if (!formData.username || !formData.password) {
        throw new Error('Username and password are required');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Check for demo accounts
      const demoAccounts = {
        'admin': { pass: 'admin123', role: 'ADMIN' },
        'mine': { pass: 'mine123', role: 'MINE_ADMIN' },
        'user': { pass: 'user123', role: 'USER' }
      };

      // If it's a demo account, verify credentials
      if (demoAccounts[formData.username]) {
        if (formData.password === demoAccounts[formData.username].pass) {
          // Store demo user info
          localStorage.setItem('user', JSON.stringify({
            username: formData.username,
            role: demoAccounts[formData.username].role
          }));
          
          // Navigate based on role
          const dashboardPaths = {
            'ADMIN': '/AdminDashboard',
            'MINE_ADMIN': '/MineAdminDashboard',
            'USER': '/UserDashboard'
          };
          
          navigate(dashboardPaths[demoAccounts[formData.username].role]);
          return;
        }
        throw new Error('Invalid credentials for demo account');
      }

      // For non-demo accounts, proceed with API call
      console.log('Attempting to create account:', {
        username: formData.username,
        password: formData.password
      });

      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password,
          'privileges[]': []
        })
      });

      const responseData = await response.text();
      console.log('Server response:', responseData);

      if (!response.ok) {
        throw new Error(responseData || 'Failed to create account');
      }

      // Navigate to login with success message
      navigate('/login', { 
        state: { message: 'Account created successfully. Please login.' }
      });

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed w-full bg-background z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">MiSight</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/about" className="text-gray-300 hover:text-primary">About</Link>
              <Link to="/features" className="text-gray-300 hover:text-primary">Features</Link>
              <Link to="/solutions" className="text-gray-300 hover:text-primary">Solutions</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-primary">Pricing</Link>
              <Link to="/contact" className="text-gray-300 hover:text-primary">Contact</Link>
              <Link to="/login" className="px-4 py-2 bg-primary text-black font-medium rounded-lg hover:bg-primary-dark">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-12 px-4">
        <div className="max-w-md mx-auto bg-surface rounded-lg shadow-xl p-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
            <p className="text-gray-400 mb-8">Join MiSight to start monitoring mining operations</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Demo Accounts Available</label>
              <div className="bg-gray-800 rounded p-4 text-sm text-gray-400 space-y-2 mb-4">
                <p>For testing purposes, use:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>admin/admin123 - System Administrator</li>
                  <li>mine/mine123 - Mine Administrator</li>
                  <li>user/user123 - User</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-black font-medium rounded-lg py-3 hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}