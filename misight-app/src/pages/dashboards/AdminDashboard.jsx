import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Users, Mountain, Activity, AlertTriangle, Bell, Cloud, RadioTower, MapPin, FileText } from 'lucide-react';
import UsersSection from '../../components/dashboard/sections/UsersSection';
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
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading, isError: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: endpoints.users.getAll,
    retry: 1,
    retryDelay: 1000
  });

  const { data: mines, isLoading: minesLoading, isError: minesError } = useQuery({
    queryKey: ['mines'],
    queryFn: endpoints.mines.getAll,
    retry: 1,
    retryDelay: 1000
  });

  const { data: minerals, isLoading: mineralsLoading, isError: mineralsError } = useQuery({
    queryKey: ['minerals'],
    queryFn: endpoints.minerals.getAll,
    retry: 1,
    retryDelay: 1000
  });

  const { data: provinces, isLoading: provincesLoading, isError: provincesError } = useQuery({
    queryKey: ['provinces'],
    queryFn: endpoints.provinces.getAll,
    retry: 1,
    retryDelay: 1000
  });

  const { data: stations, isLoading: stationsLoading, isError: stationsError } = useQuery({
    queryKey: ['stations'],
    queryFn: () => endpoints.monitoringStations.getAll(),
    retry: 1,
    retryDelay: 1000
  });

  // Mutations for CRUD operations
  const createMutation = useMutation({
    mutationFn: (data) => {
      switch (activeTab) {
        case 'users':
          return endpoints.users.create(data);
        case 'mines':
          return endpoints.mines.create(data);
        case 'minerals':
          return endpoints.minerals.create(data);
        case 'provinces':
          return endpoints.provinces.create(data);
        case 'monitoringstations':
          return endpoints.monitoringStations.create(data);
        default:
          throw new Error('Invalid section');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([activeTab]);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      switch (activeTab) {
        case 'users':
          return endpoints.users.update(id, data);
        case 'mines':
          return endpoints.mines.update(id, data);
        case 'minerals':
          return endpoints.minerals.update(id, data);
        case 'provinces':
          return endpoints.provinces.update(id, data);
        case 'monitoringstations':
          return endpoints.monitoringStations.update(id, data);
        default:
          throw new Error('Invalid section');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([activeTab]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => {
      switch (activeTab) {
        case 'users':
          return endpoints.users.delete(id);
        case 'mines':
          return endpoints.mines.delete(id);
        case 'minerals':
          return endpoints.minerals.delete(id);
        case 'provinces':
          return endpoints.provinces.delete(id);
        case 'monitoringstations':
          return endpoints.monitoringStations.delete(id);
        default:
          throw new Error('Invalid section');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([activeTab]);
    }
  });

  const handleAdd = (data) => {
    createMutation.mutate(data);
  };

  const handleEdit = (id, data) => {
    updateMutation.mutate({ id, data });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardMetrics data={{ users, mines, minerals, stations }} />;
      case 'users':
        return (
          <UsersSection
            data={users}
            loading={usersLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case 'mines':
        return (
          <MinesSection
            data={mines}
            loading={minesLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case 'minerals':
        return (
          <MineralsSection
            data={minerals}
            loading={mineralsLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case 'pollutants':
        return <PollutantsSection />;
      case 'monitoring':
        return (
          <MonitoringStationsSection
            data={stations}
            loading={stationsLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case 'provinces':
        return (
          <ProvincesSection
            data={provinces}
            loading={provincesLoading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
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

  const isLoading = (usersLoading || minesLoading || mineralsLoading || provincesLoading || stationsLoading) && 
                    !(usersError || minesError || mineralsError || provincesError || stationsError);

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
          <div className="bg-white rounded-lg shadow-lg p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}