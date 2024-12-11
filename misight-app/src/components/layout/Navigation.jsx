import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="fixed w-full bg-black/50 backdrop-blur-sm z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-10 h-10 text-amber-500" viewBox="0 0 40 40">
              <path
                fill="currentColor"
                d="M20 5L30 15L20 25L10 15L20 5ZM20 35L10 25L20 15L30 25L20 35Z"
              />
            </svg>
            <span className="ml-3 text-2xl font-bold text-white">MiSight</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-amber-500">Home</Link>
            <Link to="#features" className="text-gray-300 hover:text-amber-500">Features</Link>
            <Link to="#solutions" className="text-gray-300 hover:text-amber-500">Solutions</Link>
            <Link to="#contact" className="text-gray-300 hover:text-amber-500">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}