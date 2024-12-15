import { useQuery } from '@tanstack/react-query';
import { Building2, Activity, AlertTriangle, Clock, TrendingUp, Mountain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/services/api';

const SCULLY_MINE_ID = 3;

export function MineOverviewSection() {
  const { data: mineData, isLoading: mineLoading } = useQuery({
    queryKey: ['mine', SCULLY_MINE_ID],
    queryFn: () => api.mines.getById(SCULLY_MINE_ID)
  });

  const { data: environmentalData, isLoading: envLoading } = useQuery({
    queryKey: ['environmental-data', SCULLY_MINE_ID],
    queryFn: () => api.environmentalData.getByMine(SCULLY_MINE_ID)
  });

  const { data: safetyData, isLoading: safetyLoading } = useQuery({
    queryKey: ['safety-data', SCULLY_MINE_ID],
    queryFn: () => api.safetyData.getByMine(SCULLY_MINE_ID)
  });

  const { data: minerals, isLoading: mineralsLoading } = useQuery({
    queryKey: ['minerals', SCULLY_MINE_ID],
    queryFn: () => api.minerals.getByMine(SCULLY_MINE_ID)
  });

  const isLoading = mineLoading || envLoading || safetyLoading || mineralsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const stats = [
    {
      title: "Lost Time Incidents",
      value: safetyData?.filter(d => d.lostTimeIncidents > 0).length || 0,
      change: "-50%",
      icon: AlertTriangle,
      color: "bg-red-500"
    },
    {
      title: "Environmental Alerts",
      value: environmentalData?.filter(d => 
        d.measuredValue > (d.pollutant?.benchmarkValue || 0)
      ).length || 0,
      change: "-25%",
      icon: Activity,
      color: "bg-amber-500"
    },
    {
      title: "Days Without Incident",
      value: calculateDaysWithoutIncident(safetyData),
      change: "+45",
      icon: Clock,
      color: "bg-green-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mine Info Card */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold">{mineData?.name}</h2>
            <p className="text-xl opacity-90">{mineData?.location}</p>
            <p className="opacity-75">{mineData?.company}</p>
          </div>
          <Mountain className="h-16 w-16 opacity-75" />
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-sm opacity-75">Minerals</h4>
            <p className="text-2xl font-bold mt-1">
              {minerals?.length || 0} Types
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-sm opacity-75">Latest Safety Level</h4>
            <p className="text-2xl font-bold mt-1">
              {safetyData?.[0]?.safetyLevel || 'N/A'}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <h4 className="text-sm opacity-75">Environmental Status</h4>
            <p className="text-2xl font-bold mt-1">Active</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {/* Add your charts here */}
    </div>
  );
}

function calculateDaysWithoutIncident(safetyData) {
  if (!safetyData?.length) return 0;
  
  const lastIncident = safetyData
    .filter(d => d.lostTimeIncidents > 0)
    .sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded))[0];

  if (!lastIncident) return safetyData.length;

  const lastIncidentDate = new Date(lastIncident.dateRecorded);
  const today = new Date();
  const diffTime = Math.abs(today - lastIncidentDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default MineOverviewSection;