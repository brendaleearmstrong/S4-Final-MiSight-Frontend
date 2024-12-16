import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      localStorage.setItem(`user_${formData.username}`, JSON.stringify({
        username: formData.username,
        password: formData.password,
        role: formData.role
      }));
      navigate('/login', { 
        state: { message: 'Account created successfully. Please login.' }
      });
    } catch (error) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="min-h-screen pt-16 pb-12 flex flex-col justify-center">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-2">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-amber-500" />
            </div>
            <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join MiSight to start monitoring mining operations
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Account Type</label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
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
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">
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