// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For testing, we'll use these credentials:
      // admin/admin123 -> Admin Dashboard
      // mine/mine123 -> Mine Admin Dashboard
      // user/user123 -> User Dashboard
      if (
        (formData.username === 'admin' && formData.password === 'admin123') ||
        (formData.username === 'mine' && formData.password === 'mine123') ||
        (formData.username === 'user' && formData.password === 'user123')
      ) {
        localStorage.setItem('user', JSON.stringify({
          username: formData.username,
          role: formData.username === 'admin' ? 'ADMIN' : 
                formData.username === 'mine' ? 'MINE_ADMIN' : 'USER'
        }));

        // Redirect based on role
        if (formData.username === 'admin') navigate('/pages/AdminDashboard');
        else if (formData.username === 'mine') navigate('/pages/MineAdmindashboard');
        else navigate('/pages/UserDashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation - keeping consistent with Home */}
      <nav className="fixed w-full bg-black/50 backdrop-blur-sm z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <svg className="w-10 h-10 text-amber-500" viewBox="0 0 40 40">
                <path
                  fill="currentColor"
                  d="M20 5L30 15L20 25L10 15L20 5ZM20 35L10 25L20 15L30 25L20 35Z"
                />
              </svg>
              <span className="ml-3 text-2xl font-bold text-white">MiSight</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <div className="flex justify-center mb-6">
              <Shield className="h-12 w-12 text-amber-500" />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
              Welcome back
            </h2>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                No account?{' '}
                <Link to="/signup" className="font-medium text-amber-600 hover:text-amber-500 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}