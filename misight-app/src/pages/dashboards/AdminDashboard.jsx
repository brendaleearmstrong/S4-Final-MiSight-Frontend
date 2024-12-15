import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Shield, Users, Mountain, Activity, AlertTriangle, Bell, Cloud, RadioTower, MapPin, FileText } from 'lucide-react';
import { UsersSection } from '../../components/dashboard/sections/UsersSection';
import { MinesSection } from '../../components/dashboard/sections/MinesSection';
import { MineralsSection } from '../../components/dashboard/sections/MineralsSection';
import { PollutantsSection } from '../../components/dashboard/sections/PollutantsSection';
import { MonitoringStationsSection } from '../../components/dashboard/sections/MonitoringStationsSection';
import { ProvincesSection } from '../../components/dashboard/sections/ProvincesSection';
import { SafetySection } from '../../components/dashboard/sections/SafetySection';
import { DashboardHeader } from '../../components/dashboard/layout/DashboardHeader';
import { DashboardSidebar } from '../../components/dashboard/layout/DashboardSidebar';
import { DashboardMetrics } from '../../components/dashboard/DashboardMetrics';
import { endpoints } from '@/services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Query hooks for fetching data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: endpoints.users.getAll
  });

  const { data: mines, isLoading: minesLoading } = useQuery({
    queryKey: ['mines'],
    queryFn: endpoints.mines.getAll
  });

  const { data: minerals, isLoading: mineralsLoading } = useQuery({
    queryKey: ['minerals'],
    queryFn: endpoints.minerals.getAll
  });

  const { data: provinces, isLoading: provincesLoading } = useQuery({
    queryKey: ['provinces'],
    queryFn: endpoints.provinces.getAll
  });

  const { data: stations, isLoading: stationsLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: () => endpoints.monitoringStations.getAll()
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardMetrics data={{ users, mines, minerals, stations }} />;
      case 'users':
        return <UsersSection />;
      case 'mines':
        return <MinesSection />;
      case 'minerals':
        return <MineralsSection />;
      case 'pollutants':
        return <PollutantsSection />;
      case 'monitoring':
        return <MonitoringStationsSection />;
      case 'provinces':
        return <ProvincesSection />;
      case 'safety':
        return <SafetySection />;
      default:
        return <DashboardMetrics data={{ users, mines, minerals, stations }} />;
    }
  };

  const sidebarItems = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'mines', label: 'Mines', icon: Mountain },
    { id: 'minerals', label: 'Minerals', icon: Mountain },
    { id: 'provinces', label: 'Provinces', icon: MapPin },
    { id: 'monitoringstations', label: 'Monitoring Stations', icon: Activity },
    { id: 'notices', label: 'Notices', icon: FileText },
    { id: 'weather', label: 'Weather', icon: Cloud }
  ];

  // Show loading state if any essential data is loading
  const isLoading = usersLoading || minesLoading || mineralsLoading || provincesLoading || stationsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#151922] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151922]">
      <DashboardHeader onLogout={() => {
        localStorage.removeItem('user');
        navigate('/login');
      }} />
      
      <div className="flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          items={sidebarItems}
        />

        <main className="flex-1 ml-64 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Administrator Dashboard</h1>
          </div>
          <div className="bg-[#FFFFFF] rounded-lg shadow-lg p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
  
}