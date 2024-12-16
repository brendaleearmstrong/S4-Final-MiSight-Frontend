import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, AlertCircle, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ManagementModal } from '@/components/dashboard/ManagementModal';
import { SCULLY_MINE } from '@/services/api';
import api from '@/services/api';

// Fallback Mock Data remains the same
const MOCK_ENVIRONMENTAL_DATA = [
  { id: 1, measurementDate: '2024-12-01T00:00:00', measuredValue: 45, pollutant: { name: 'PM10', unit: 'μg/m³', benchmarkValue: 50 }, monitoringStation: { name: 'North Station', location: 'North Side' }, notes: 'Monthly check' },
  { id: 2, measurementDate: '2024-12-02T00:00:00', measuredValue: 42, pollutant: { name: 'PM10', unit: 'μg/m³', benchmarkValue: 50 }, monitoringStation: { name: 'South Station', location: 'South Side' }, notes: 'Normal levels' },
  { id: 3, measurementDate: '2024-12-03T00:00:00', measuredValue: 60, pollutant: { name: 'SO2', unit: 'ppb', benchmarkValue: 75 }, monitoringStation: { name: 'East Station', location: 'East Side' }, notes: 'Slight increase' },
];

const MOCK_POLLUTANTS = [
  { id: 1, name: 'PM10', unit: 'μg/m³', benchmarkValue: 50, category: 'Particulate Matter' },
  { id: 2, name: 'SO2', unit: 'ppb', benchmarkValue: 75, category: 'Sulfur Dioxide' },
];

export function EnvironmentalDataSection() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  // Data fetching logic remains the same
  const { data: pollutants = MOCK_POLLUTANTS } = useQuery({
    queryKey: ['pollutants'],
    queryFn: async () => {
      try {
        return await api.endpoints.pollutants.getAll();
      } catch {
        return MOCK_POLLUTANTS;
      }
    },
  });

  const { data: environmentalData = MOCK_ENVIRONMENTAL_DATA, isLoading } = useQuery({
    queryKey: ['environmental-data', SCULLY_MINE.id],
    queryFn: async () => {
      try {
        return await api.endpoints.environmentalData.getByMine(SCULLY_MINE.id);
      } catch {
        return MOCK_ENVIRONMENTAL_DATA;
      }
    },
  });

  // Statistics calculations
  const totalReports = environmentalData.length;
  const averageValue = (environmentalData.reduce((sum, report) => sum + report.measuredValue, 0) / totalReports).toFixed(2);
  const pollutantsExceeding = environmentalData.filter((report) => report.measuredValue > report.pollutant.benchmarkValue).length;

  // Chart data preparation
  const chartData = environmentalData.map((report) => ({
    date: new Date(report.measurementDate).toLocaleDateString(),
    value: report.measuredValue,
    pollutant: report.pollutant.name,
    benchmark: report.pollutant.benchmarkValue,
  }));

  // Form fields configuration
  const fields = [
    {
      name: 'pollutantId',
      label: 'Pollutant',
      type: 'select',
      required: true,
      options: pollutants.map((p) => ({
        value: p.id.toString(),
        label: `${p.name} (${p.unit})`,
      })),
    },
    {
      name: 'measuredValue',
      label: 'Measured Value',
      type: 'number',
      required: true,
      step: '0.01',
    },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-800">Environmental Monitoring</h2>
            <p className="text-gray-600">Real-time environmental data monitoring for Scully Mine</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Environmental Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-gray-600 text-sm">Total Reports</p>
              <p className="text-2xl font-bold text-gray-800">{totalReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <Info className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-gray-600 text-sm">Average Value</p>
              <p className="text-2xl font-bold text-gray-800">{averageValue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-gray-600 text-sm">Exceeding Limits</p>
              <p className="text-2xl font-bold text-gray-800">{pollutantsExceeding}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Measurement Trends</h3>
          <p className="text-sm text-gray-600">Historical view of environmental measurements</p>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#4B5563"
                tick={{ fill: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                stroke="#4B5563"
                tick={{ fill: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: '#1F2937' }}
                itemStyle={{ color: '#1F2937' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', stroke: '#F59E0B', r: 4 }}
                name="Measured Value"
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#DC2626"
                strokeDasharray="5 5"
                name="Benchmark"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Reports</h3>
          <p className="text-sm text-gray-600">Comprehensive list of all environmental measurements</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Pollutant</th>
                <th className="px-6 py-4 font-medium">Value</th>
                <th className="px-6 py-4 font-medium">Station</th>
                <th className="px-6 py-4 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {environmentalData.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800">
                    {new Date(report.measurementDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {report.pollutant.name} ({report.pollutant.unit})
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    <span className={`font-medium ${
                      report.measuredValue > report.pollutant.benchmarkValue 
                        ? 'text-amber-600' 
                        : 'text-amber-500'
                    }`}>
                      {report.measuredValue}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {report.monitoringStation?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {report.notes || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ManagementModal
        title="Add Environmental Report"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => console.log('Submit:', data)}
        fields={fields}
      />
    </div>
  );
}

export default EnvironmentalDataSection;