import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, Clock, TrendingUp, Mountain } from 'lucide-react';
import api, { SCULLY_MINE_ID } from '@/services/api';

const MOCK_DATA = {
  mineData: {
    id: SCULLY_MINE_ID,
    name: 'Scully Mine',
    location: 'Wabush, NL',
    company: 'Tacora Resources',
    minerals: ['Iron Ore'],
    active: true
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
      measuredValue: 42,
      pollutant: { name: 'PM10', benchmarkValue: 50, unit: 'μg/m³' }
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
    }
  ],
  minerals: [
    { id: 1, name: 'Iron Ore', type: 'Metallic' }
  ]
};

export function MineOverviewSection() {
  const { data: mineData, isLoading: mineLoading } = useQuery({
    queryKey: ['mine', SCULLY_MINE_ID],
    queryFn: async () => {
      try {
        return await api.endpoints.mines.getById(SCULLY_MINE_ID);
      } catch (error) {
        console.warn('Mine data API failed:', error);
        return MOCK_DATA.mineData;
      }
    }
  });

  const { data: environmentalData, isLoading: envLoading } = useQuery({
    queryKey: ['environmental-data', SCULLY_MINE_ID],
    queryFn: async () => {
      try {
        return await api.endpoints.environmentalData.getByMine(SCULLY_MINE_ID);
      } catch (error) {
        console.warn('Environmental data API failed:', error);
        return MOCK_DATA.environmentalData;
      }
    }
  });

  const { data: safetyData, isLoading: safetyLoading } = useQuery({
    queryKey: ['safety-data', SCULLY_MINE_ID],
    queryFn: async () => {
      try {
        return await api.endpoints.safetyData.getByMine(SCULLY_MINE_ID);
      } catch (error) {
        console.warn('Safety data API failed:', error);
        return MOCK_DATA.safetyData;
      }
    }
  });

  const { data: minerals, isLoading: mineralsLoading } = useQuery({
    queryKey: ['minerals', SCULLY_MINE_ID],
    queryFn: async () => {
      try {
        return await api.endpoints.minerals.getByMine(SCULLY_MINE_ID);
      } catch (error) {
        console.warn('Minerals API failed:', error);
        return MOCK_DATA.minerals;
      }
    }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Mine Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Active Minerals</h4>
            <div className="mt-2 space-y-1">
              {minerals?.map(mineral => (
                <p key={mineral.id} className="text-gray-900">{mineral.name}</p>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Safety Status</h4>
            <div className="mt-2 space-y-1">
              <p className="text-gray-900">
                Last Incident: {formatLastIncidentDate(safetyData)}
              </p>
              <p className="text-gray-900">
                Safety Level: {safetyData?.[0]?.safetyLevel || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
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

function formatLastIncidentDate(safetyData) {
  if (!safetyData?.length) return 'No data';
  
  const lastIncident = safetyData
    .filter(d => d.lostTimeIncidents > 0)
    .sort((a, b) => new Date(b.dateRecorded) - new Date(a.dateRecorded))[0];

  if (!lastIncident) return 'No incidents recorded';
  
  return new Date(lastIncident.dateRecorded).toLocaleDateString();
}

export default MineOverviewSection;