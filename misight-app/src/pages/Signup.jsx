import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { authAPI } from '../services/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.signup({
        username: formData.username,
        password: formData.password,
        role: formData.role
      });
      navigate('/login', { 
        state: { message: 'Account created successfully. Please login.' }
      });
    } catch (error) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#151922]">
      <nav className="fixed w-full bg-[#151922] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-amber-500" />
              <span className="ml-2 text-2xl font-bold text-white">MiSight</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-amber-500 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-300 hover:text-amber-500 transition-colors">About</Link>
              <Link to="/features" className="text-gray-300 hover:text-amber-500 transition-colors">Features</Link>
              <Link to="/solutions" className="text-gray-300 hover:text-amber-500 transition-colors">Solutions</Link>
              <Link to="/pricing" className="text-gray-300 hover:text-amber-500 transition-colors">Pricing</Link>
              <Link to="/contact" className="text-gray-300 hover:text-amber-500 transition-colors">Contact</Link>
              <Link 
                to="/login"
                className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="min-h-screen pt-16 pb-12 flex flex-col justify-center">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl bg-[#1A1F2B] rounded-lg shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-amber-500" />
            </div>
            <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Join MiSight to start monitoring mining operations
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200">Username</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200">Account Type</label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="USER">Community Stakeholder</option>
                  <option value="MINE_ADMIN">Mine Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-amber-500 hover:text-amber-400">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}