// src/components/dashboard/stats/StatsOverview.jsx
import { StatsCard } from './StatsCard';
import { Users, Mountain, Activity, Bell } from 'lucide-react';

export function StatsOverview({ data }) {
  const stats = [
    {
      title: 'Total Mines',
      value: data?.mines?.length || 0,
      trend: 5,
      icon: Mountain
    },
    {
      title: 'Active Users',
      value: data?.users?.length || 0,
      trend: 12,
      icon: Users
    },
    {
      title: 'Active Minerals',
      value: data?.minerals?.length || 0,
      trend: 3,
      icon: Activity
    },
    {
      title: 'Alerts',
      value: data?.alerts || 0,
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