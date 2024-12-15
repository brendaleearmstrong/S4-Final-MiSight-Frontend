import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '@/services/api';
import { SCULLY_MINE } from '@/services/api';

// Fallback mock data
const MOCK_DATA = [
  { measurementDate: '2024-12-01T00:00:00', measuredValue: 45 },
  { measurementDate: '2024-12-05T00:00:00', measuredValue: 52 },
  { measurementDate: '2024-12-10T00:00:00', measuredValue: 38 },
];

export function MineAdminEnvironmentalReport() {
  const [dateRange, setDateRange] = useState({
    start: `${new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split('T')[0]}T00:00:00`,
    end: `${new Date().toISOString().split('T')[0]}T23:59:59`,
  });

  // Fetch environmental data with fallback to mock data
  const { data: environmentalData, isLoading } = useQuery({
    queryKey: ['environmental-data', SCULLY_MINE.id, dateRange],
    queryFn: async () => {
      try {
        const response = await api.endpoints.environmentalData.getByMineAndDateRange(
          SCULLY_MINE.id,
          dateRange.start,
          dateRange.end
        );
        console.log('Fetched Environmental Data:', response);
        return response.length ? response : MOCK_DATA;
      } catch (error) {
        console.warn('Error fetching environmental data, using mock data:', error);
        return MOCK_DATA;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  // Process data for the LineChart
  const processedData = environmentalData?.map((data) => ({
    measurementDate: new Date(data.measurementDate).toISOString().split('T')[0],
    measuredValue: parseFloat(data.measuredValue) || 0,
  })) || [];

  console.log('Processed Data for Chart:', processedData);

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Environmental Report - Scully Mine</h2>
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Date Range:</label>
            <input
              type="date"
              value={dateRange.start.split('T')[0]}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  start: `${e.target.value}T00:00:00`,
                }))
              }
              className="px-2 py-1 border rounded"
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end.split('T')[0]}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  end: `${e.target.value}T23:59:59`,
                }))
              }
              className="px-2 py-1 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="bg-[#1a202c] text-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Environmental Measurement Trends</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <CartesianGrid stroke="#FFFFFF" strokeDasharray="3 3" />
              <XAxis
                dataKey="measurementDate"
                stroke="#FFFFFF"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a202c', color: '#FFFFFF' }}
                formatter={(value) => `${value} μg/m³`}
              />
              <Line
                type="monotone"
                dataKey="measuredValue"
                stroke="#F59E0B"
                name="Measured Value"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MineAdminEnvironmentalReport;

