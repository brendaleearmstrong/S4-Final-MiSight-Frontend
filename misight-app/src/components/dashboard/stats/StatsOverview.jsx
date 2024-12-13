import { useQueries } from '@tanstack/react-query';
import { StatsCard } from './StatsCard';
import { Users, Mountain, Activity, Bell } from 'lucide-react';
import { endpoints } from '../../../services/api';

export function StatsOverview() {
  const results = useQueries({
    queries: [
      { queryKey: ['mines'], queryFn: endpoints.mines.getAll },
      { queryKey: ['users'], queryFn: endpoints.users.getAll },
      { queryKey: ['minerals'], queryFn: endpoints.minerals.getAll }
    ]
  });

  const [mines, users, minerals] = results;
  const alerts = 0; // This would come from a real alerts endpoint

  const stats = [
    {
      title: 'Total Mines',
      value: mines.data?.length || 0,
      trend: 5,
      icon: Mountain
    },
    {
      title: 'Active Users',
      value: users.data?.length || 0,
      trend: 12,
      icon: Users
    },
    {
      title: 'Active Minerals',
      value: minerals.data?.length || 0,
      trend: 3,
      icon: Activity
    },
    {
      title: 'Alerts',
      value: alerts,
      trend: -8,
      icon: Bell
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          trend={stat.trend}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}