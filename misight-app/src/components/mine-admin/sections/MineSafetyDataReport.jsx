import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, Gauge, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api, { downloadFile } from '@/services/api';

const SCULLY_MINE_ID = 3;
const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

export function MineAdminSafetyReport() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const { data: safetyData, isLoading } = useQuery({
    queryKey: ['safety-data', SCULLY_MINE_ID, dateRange],
    queryFn: () => api.safetyData.getByMineAndDateRange(
      SCULLY_MINE_ID,
      dateRange.start,
      dateRange.end
    )
  });

  const handleExport = async () => {
    try {
      const response = await api.safetyData.exportByMine(SCULLY_MINE_ID);
      downloadFile(response.data, `scully-mine-safety-report-${dateRange.start}-${dateRange.end}.xlsx`);
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
    totalIncidents: safetyData?.reduce((sum, record) => sum + record.lostTimeIncidents, 0) || 0,
    totalNearMisses: safetyData?.reduce((sum, record) => sum + record.nearMisses, 0) || 0,
    safetyLevels: safetyData?.reduce((acc, record) => {
      acc[record.safetyLevel] = (acc[record.safetyLevel] || 0) + 1;
      return acc;
    }, {})
  };

  const pieData = Object.entries(safetyMetrics.safetyLevels || {}).map(([name, value]) => ({
    name,
    value
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
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-2 py-1 border rounded"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-2 py-1 border rounded"
            />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Lost Time Incidents</h3>
            <ShieldAlert className="text-red-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{safetyMetrics.totalIncidents}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Near Misses</h3>
            <AlertTriangle className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{safetyMetrics.totalNearMisses}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Incident Rate</h3>
            <Gauge className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {((safetyMetrics.totalIncidents / (safetyData?.length || 1)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Safety Incidents Over Time</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safetyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="dateRecorded" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                name="Lost Time Incidents"
                dataKey="lostTimeIncidents" 
                stroke="#EF4444" 
              />
              <Line 
                type="monotone" 
                name="Near Misses"
                dataKey="nearMisses" 
                stroke="#F59E0B" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Safety Levels Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Safety Level Distribution</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MineAdminSafetyReport;