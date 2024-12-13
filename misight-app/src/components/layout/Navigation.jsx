import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed w-full bg-[#1A1F2B] z-50">
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
  );
}