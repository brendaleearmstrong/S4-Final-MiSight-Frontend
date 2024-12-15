import { Shield, Users, Mountain, Activity, AlertTriangle, Bell, Cloud, RadioTower } from 'lucide-react';

export function DashboardSidebar({ activeTab, onTabChange }) {
  const sidebarItems = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'mines', label: 'Mines', icon: Mountain },
    { id: 'minerals', label: 'Minerals', icon: Activity },
    { id: 'pollutants', label: 'Pollutants', icon: AlertTriangle },
    { id: 'monitoring', label: 'Monitoring Stations', icon: RadioTower },
    { id: 'provinces', label: 'Provinces', icon: Shield },
    { id: 'safety', label: 'Safety Data', icon: Bell },
    { id: 'environment', label: 'Environment', icon: Cloud }
  ];

  return (
    <div className="w-64 min-h-screen bg-[#151922] fixed">
      <div className="p-6 flex items-center">
        <Shield className="h-8 w-8 text-amber-500" />
        <span className="text-white text-xl font-bold ml-2">MiSight</span>
      </div>
      <nav className="mt-6">
        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center px-6 py-3 text-sm ${
              activeTab === id 
                ? 'bg-amber-500 text-black' 
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <Icon className="h-5 w-5 mr-3" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default DashboardSidebar;