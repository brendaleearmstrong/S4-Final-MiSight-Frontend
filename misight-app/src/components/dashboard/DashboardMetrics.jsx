// src/components/dashboard/DashboardMetrics.jsx
import { StatsOverview } from './stats/StatsOverview';
import { WeatherCard } from './WeatherCard';
import { NoticesCard } from './NoticesCard';

export function DashboardMetrics({ data }) {
  return (
    <div className="space-y-6">
      <StatsOverview data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherCard />
        <NoticesCard />
      </div>
    </div>
  );
}