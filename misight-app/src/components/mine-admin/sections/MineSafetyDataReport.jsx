import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, Gauge, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '@/services/api';
import { SCULLY_MINE } from '@/services/api';

const COLORS = ['#F59E0B', '#1a202c', '#FFFFFF'];

const MOCK_DATA = {
  safetyData: [
    { id: 1, dateRecorded: '2024-01-15', lostTimeIncidents: 2, nearMisses: 4, safetyLevel: 'FAIR' },
    { id: 2, dateRecorded: '2024-02-10', lostTimeIncidents: 1, nearMisses: 3, safetyLevel: 'GOOD' },
    { id: 3, dateRecorded: '2024-03-05', lostTimeIncidents: 0, nearMisses: 6, safetyLevel: 'GOOD' },
    { id: 4, dateRecorded: '2024-04-20', lostTimeIncidents: 3, nearMisses: 5, safetyLevel: 'CRITICAL' },
    { id: 5, dateRecorded: '2024-05-30', lostTimeIncidents: 0, nearMisses: 2, safetyLevel: 'EXCELLENT' },
  ],
};

export function MineAdminSafetyReport() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const { data: safetyData, isLoading } = useQuery({
    queryKey: ['safety-data', SCULLY_MINE.id, dateRange],
    queryFn: async () => {
      try {
        const response = await api.endpoints.safetyData.getByMineAndDateRange(
          SCULLY_MINE.id,
          dateRange.start,
          dateRange.end
        );
        return response.length ? response : MOCK_DATA.safetyData;
      } catch (error) {
        console.warn('Error fetching safety data:', error);
        return MOCK_DATA.safetyData; // Fallback to mock data
      }
    },
    placeholderData: MOCK_DATA.safetyData, // Placeholder for smoother UI transitions
  });

  const handleExport = async () => {
    try {
      const response = await api.endpoints.safetyData.exportByMine(SCULLY_MINE.id);
      const filename = `safety-report-${dateRange.start}-${dateRange.end}.xlsx`;
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const safetyMetrics = {
    totalIncidents: safetyData.reduce((sum, record) => sum + record.lostTimeIncidents, 0),
    totalNearMisses: safetyData.reduce((sum, record) => sum + record.nearMisses, 0),
    safetyLevels: safetyData.reduce((acc, record) => {
      acc[record.safetyLevel] = (acc[record.safetyLevel] || 0) + 1;
      return acc;
    }, {}),
  };

  const pieData = Object.entries(safetyMetrics.safetyLevels).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Safety Report - Scully Mine</h2>
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Date Range:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="px-2 py-1 border rounded"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="px-2 py-1 border rounded"
            />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Lost Time Incidents</h3>
            <ShieldAlert className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{safetyMetrics.totalIncidents}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Near Misses</h3>
            <AlertTriangle className="text-red-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{safetyMetrics.totalNearMisses}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Incident Rate</h3>
            <Gauge className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {((safetyMetrics.totalIncidents / safetyData.length) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-[#1a202c] text-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Safety Incidents Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safetyData}>
                <CartesianGrid stroke="#FFFFFF" strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateRecorded"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  stroke="#FFFFFF"
                />
                <YAxis stroke="#FFFFFF" />
                <Tooltip contentStyle={{ backgroundColor: '#1a202c', color: '#FFFFFF' }} />
                <Line
                  type="monotone"
                  dataKey="lostTimeIncidents"
                  stroke="#F59E0B"
                  name="Lost Time Incidents"
                />
                <Line
                  type="monotone"
                  dataKey="nearMisses"
                  stroke="#FFFFFF"
                  name="Near Misses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#1a202c] text-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Safety Level Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#F59E0B"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a202c', color: '#FFFFFF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MineAdminSafetyReport;
