import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { authAPI } from '../services/auth';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo account configurations
  const demoAccounts = {
    'admin': { pass: 'admin123', role: 'ADMIN' },
    'mine': { pass: 'mine123', role: 'MINE_ADMIN' },
    'user': { pass: 'user123', role: 'USER' }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password || !formData.role) {
      throw new Error('All fields are required');
    }

    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  };

  const handleDemoAccount = () => {
    const demoAccount = demoAccounts[formData.username];
    if (demoAccount && formData.password === demoAccount.pass) {
      const userData = {
        username: formData.username,
        role: demoAccount.role
      };
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const createRealUser = async () => {
    const params = new URLSearchParams();
    params.append('username', formData.username);
    params.append('password', formData.password);

    try {
      const response = await axios.post('http://localhost:8080/api/users', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify({
          username: formData.username,
          role: formData.role
        }));
        return true;
      }
      return false;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create account. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      validateForm();

      const isDemoAccount = handleDemoAccount();
      if (isDemoAccount) {
        const userData = JSON.parse(localStorage.getItem('user'));
        navigate(authAPI.getProtectedRoute(userData.role));
        return;
      }

      const success = await createRealUser();
      if (success) {
        navigate('/login', { 
          state: { message: 'Account created successfully. Please login.' }
        });
      }

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151922] flex flex-col">
      <Navigation />

      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto bg-[#1A1F2B] rounded-lg shadow-xl p-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
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
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                <option value="">Select Role</option>
                <option value="ADMIN">Administrator</option>
                <option value="MINE_ADMIN">Mine Administrator</option>
                <option value="USER">Public Stakeholder</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Demo Accounts</label>
              <div className="bg-gray-800 rounded p-4 text-sm text-gray-400 space-y-2">
                <p>For testing purposes, use:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>admin/admin123 - System Administrator</li>
                  <li>mine/mine123 - Mine Administrator</li>
                  <li>user/user123 - Public Stakeholder</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-500 text-black font-medium rounded-lg py-3 hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-500 hover:text-amber-600">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}