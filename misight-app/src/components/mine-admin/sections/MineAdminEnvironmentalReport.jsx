import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivitySquare, AlertCircle, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '@/services/api';

const SCULLY_MINE_ID = 3;

export function MineAdminEnvironmentalReport() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const { data: environmentalData, isLoading: envLoading } = useQuery({
    queryKey: ['environmental-data', SCULLY_MINE_ID, dateRange],
    queryFn: () => api.environmentalData.getByMineAndDateRange(
      SCULLY_MINE_ID,
      dateRange.start,
      dateRange.end
    )
  });

  if (envLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const exceedancesByPollutant = environmentalData?.reduce((acc, reading) => {
    const pollutant = reading.pollutant?.name;
    if (!pollutant) return acc;
    
    if (!acc[pollutant]) {
      acc[pollutant] = {
        total: 0,
        exceeded: 0
      };
    }
    
    acc[pollutant].total++;
    if (reading.measuredValue > reading.pollutant.benchmarkValue) {
      acc[pollutant].exceeded++;
    }
    
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Environmental Report - Scully Mine</h2>
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
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Total Measurements</h3>
            <ActivitySquare className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{environmentalData?.length || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Exceedances</h3>
            <AlertCircle className="text-red-500" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {environmentalData?.filter(d => 
              d.measuredValue > (d.pollutant?.benchmarkValue || 0)
            ).length || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between">
            <h3 className="font-semibold">Pollutants Monitored</h3>
            <BarChart3 className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2">
            {Object.keys(exceedancesByPollutant || {}).length}
          </p>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Measurement Trends</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={environmentalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="measurementDate" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="measuredValue" 
                stroke="#F59E0B" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exceedance Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Exceedance Summary</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(exceedancesByPollutant || {}).map(([name, data]) => ({
              name,
              total: data.total,
              exceeded: data.exceeded
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#F59E0B" name="Total Measurements" />
              <Bar dataKey="exceeded" fill="#EF4444" name="Exceedances" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MineAdminEnvironmentalReport;