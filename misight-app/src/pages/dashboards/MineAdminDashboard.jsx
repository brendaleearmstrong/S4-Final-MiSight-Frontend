import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Activity, AlertTriangle } from 'lucide-react';
import { SafetyDataSection } from '@/components/mine-admin/sections/SafetyDataSection';
import { EnvironmentalDataSection } from '@/components/mine-admin/sections/EnvironmentalDataSection';
import { MineOverviewSection } from '@/components/mine-admin/sections/MineOverviewSection';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { NoticesCard } from '@/components/dashboard/NoticesCard';
import { useAuth } from '@/contexts/AuthContext';
import { SCULLY_MINE } from '@/services/api';

// Mock data for API fallbacks
const MOCK_DATA = {
  mineData: {
    id: SCULLY_MINE.id,
    name: 'Scully Mine',
    location: 'Wabush, NL',
    company: 'Tacora Resources',
    minerals: ['Iron Ore']
  },
  environmentalData: [
    {
      id: 1,
      measurementDate: '2024-12-01',
      measuredValue: 45,
      pollutant: { name: 'PM10', benchmarkValue: 50, unit: 'μg/m³' }
    },
    {
      id: 2,
      measurementDate: '2024-12-02',
      measuredValue: 52,
      pollutant: { name: 'PM10', benchmarkValue: 50, unit: 'μg/m³' }
    },
    {
      id: 3,
      measurementDate: '2024-12-03',
      measuredValue: 48,
      pollutant: { name: 'PM2.5', benchmarkValue: 25, unit: 'μg/m³' }
    }
  ],
  safetyData: [
    {
      id: 1,
      dateRecorded: '2024-12-01',
      lostTimeIncidents: 0,
      nearMisses: 1,
      safetyLevel: 'GOOD'
    },
    {
      id: 2,
      dateRecorded: '2024-12-02',
      lostTimeIncidents: 1,
      nearMisses: 2,
      safetyLevel: 'FAIR'
    },
    {
      id: 3,
      dateRecorded: '2024-12-03',
      lostTimeIncidents: 0,
      nearMisses: 0,
      safetyLevel: 'EXCELLENT'
    }
  ],
  minerals: [
    { id: 1, name: 'Iron Ore', type: 'Metallic' }
  ],
  weatherData: [
    { date: '2024-12-15', temp: 2, wind: 25, conditions: 'Cloudy' },
    { date: '2024-12-16', temp: 1, wind: 20, conditions: 'Snow' },
    { date: '2024-12-17', temp: 0, wind: 15, conditions: 'Snow' }
  ],
  notices: [
    {
      id: 1,
      title: 'Scheduled Maintenance',
      message: 'Equipment maintenance scheduled for tomorrow',
      date: '2024-12-15',
      type: 'info'
    },
    {
      id: 2,
      title: 'Safety Alert',
      message: 'Updated safety protocols in effect',
      date: '2024-12-14',
      type: 'warning'
    }
  ]
};

export default function MineAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { user } = useAuth();

  const sidebarItems = [
    { id: 'overview', label: 'Mine Overview', icon: Building2 },
    { id: 'environmental', label: 'Environmental Reports', icon: Activity },
    { id: 'safety', label: 'Safety Reports', icon: AlertTriangle }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'environmental':
        return <EnvironmentalDataSection mockData={MOCK_DATA} />;
      case 'safety':
        return <SafetyDataSection mockData={MOCK_DATA} />;
      default:
        return <MineOverviewSection mockData={MOCK_DATA} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="https://tacoraresources.com/wp-content/uploads/2021/09/image.png" 
                alt="Tacora Resources" 
                className="h-8 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/tacora-logo.png";
                }}
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mine Administration</h1>
                <span className="text-sm text-gray-500">
                  {SCULLY_MINE.name} - {SCULLY_MINE.location}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user?.username}</span>
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        <div className="w-64 bg-[#1a202c] shadow-sm border-r border-gray-800">
          <nav className="mt-5 px-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-2 my-1 text-sm font-medium rounded-md ${
                  activeTab === item.id
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          <main className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                {renderContent()}
              </div>
              <div className="space-y-6">
                <WeatherCard weatherData={MOCK_DATA.weatherData} />
                <NoticesCard notices={MOCK_DATA.notices} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}