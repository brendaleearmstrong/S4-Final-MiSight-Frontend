// src/pages/dashboards/AdminDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Mountain, Activity, AlertTriangle, FileText, Cloud } from 'lucide-react';
import { UsersSection } from '../../components/dashboard/sections/UsersSection';
import { MinesSection } from '../../components/dashboard/sections/MinesSection';
import { MineralsSection } from '../../components/dashboard/sections/MineralsSection';
import { PollutantsSection } from '../../components/dashboard/sections/PollutantsSection';
import { ProvincesSection } from '../../components/dashboard/sections/ProvincesSection';
import { SafetySection } from '../../components/dashboard/sections/SafetySection';
import { DashboardHeader } from '../../components/dashboard/layout/DashboardHeader';
import { DashboardSidebar } from '../../components/dashboard/layout/DashboardSidebar';
import { DashboardMetrics } from '../../components/dashboard/DashboardMetrics';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [data] = useState({
    users: [
      { id: 1, username: 'admin', email: 'admin@misight.com', role: 'Admin' },
      { id: 2, username: 'mine_admin', email: 'mine@misight.com', role: 'Mine Admin' }
    ],
    mines: [
      { id: 1, name: 'Voiseys Bay', location: 'Labrador', company: 'Vale' },
      { id: 2, name: 'Long Harbour', location: 'Newfoundland', company: 'Vale' }
    ],
    minerals: [
      { id: 1, name: 'Nickel', type: 'Metal' },
      { id: 2, name: 'Copper', type: 'Metal' }
    ],
    provinces: [
      { id: 1, name: 'Newfoundland and Labrador', code: 'NL' },
      { id: 2, name: 'Nova Scotia', code: 'NS' }
    ]
  });

  const handleAdd = (section, newData) => {
    console.log(`Adding to ${section}:`, newData);
  };

  const handleEdit = (section, id, updatedData) => {
    console.log(`Editing ${section} with ID ${id}:`, updatedData);
  };

  const handleDelete = (section, id) => {
    console.log(`Deleting from ${section} with ID:`, id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardMetrics data={data} />;
      case 'users':
        return (
          <UsersSection
            data={data.users}
            onAdd={(data) => handleAdd('users', data)}
            onEdit={(id, data) => handleEdit('users', id, data)}
            onDelete={(id) => handleDelete('users', id)}
          />
        );
      case 'mines':
        return (
          <MinesSection
            data={data.mines}
            minerals={data.minerals}
            onAdd={(data) => handleAdd('mines', data)}
            onEdit={(id, data) => handleEdit('mines', id, data)}
            onDelete={(id) => handleDelete('mines', id)}
          />
        );
      case 'minerals':
        return (
          <MineralsSection
            data={data.minerals}
            onAdd={(data) => handleAdd('minerals', data)}
            onEdit={(id, data) => handleEdit('minerals', id, data)}
            onDelete={(id) => handleDelete('minerals', id)}
          />
        );
      case 'pollutants':
        return <PollutantsSection />;
      case 'provinces':
        return <ProvincesSection />;
      case 'safety':
        return <SafetySection />;
      default:
        return <DashboardMetrics data={data} />;
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'mines', label: 'Mines', icon: Mountain },
    { id: 'minerals', label: 'Minerals', icon: Activity },
    { id: 'pollutants', label: 'Pollutants', icon: AlertTriangle },
    { id: 'provinces', label: 'Provinces', icon: FileText },
    { id: 'safety', label: 'Safety Data', icon: Cloud }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
}