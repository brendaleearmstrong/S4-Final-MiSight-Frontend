import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3,
  Building2,
  ShieldAlert,
  Leaf,
  RadarIcon,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/mines', icon: Building2, label: 'Mines' },
  { path: '/environmental', icon: Leaf, label: 'Environmental' },
  { path: '/safety', icon: ShieldAlert, label: 'Safety' },
  { path: '/monitoring', icon: RadarIcon, label: 'Monitoring' },
  { path: '/pollutants', icon: AlertTriangle, label: 'Pollutants' }
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                location.pathname === path
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              )}
            >
              <Icon className="mr-3 h-6 w-6" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}