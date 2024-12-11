import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  LayoutDashboard, 
  Mountain,
  Activity,
  AlertTriangle,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/dashboard',
      roles: ['admin', 'mine_admin', 'user'] 
    },
    { 
      title: 'Mines', 
      icon: Mountain, 
      href: '/mines',
      roles: ['admin', 'mine_admin'] 
    },
    { 
      title: 'Environmental', 
      icon: Activity, 
      href: '/environmental',
      roles: ['admin', 'mine_admin', 'user'] 
    },
    { 
      title: 'Safety', 
      icon: AlertTriangle, 
      href: '/safety',
      roles: ['admin', 'mine_admin'] 
    },
    { 
      title: 'Users', 
      icon: Users, 
      href: '/users',
      roles: ['admin'] 
    },
    { 
      title: 'Settings', 
      icon: Settings, 
      href: '/settings',
      roles: ['admin', 'mine_admin'] 
    }
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role?.toLowerCase() || '')
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 lg:hidden"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <Shield className="h-8 w-8 text-amber-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">MiSight</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="flex">
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow transform 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out
        `}>
          <nav className="mt-5 px-2 space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-amber-500" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;