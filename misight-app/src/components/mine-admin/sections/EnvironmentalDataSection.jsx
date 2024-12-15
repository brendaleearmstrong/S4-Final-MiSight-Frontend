import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ManagementModal } from '@/components/dashboard/ManagementModal';
import { SCULLY_MINE } from '@/services/api';
import api from '@/services/api';

// Fallback Mock Data
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

  // Fetch pollutants
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

  // Fetch environmental data
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

  // Calculate statistics
  const totalReports = environmentalData.length;
  const averageValue =
    (environmentalData.reduce((sum, report) => sum + report.measuredValue, 0) / totalReports).toFixed(2);
  const pollutantsExceeding = environmentalData.filter(
    (report) => report.measuredValue > report.pollutant.benchmarkValue
  ).length;

  // Prepare chart data
  const chartData = environmentalData.map((report) => ({
    date: new Date(report.measurementDate).toLocaleDateString(),
    value: report.measuredValue,
    pollutant: report.pollutant.name,
  }));

  // Form fields for adding a report
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
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Environmental Reports</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Environmental Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-bold">Total Reports</h3>
          <p className="text-2xl font-semibold">{totalReports}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-bold">Average Value</h3>
          <p className="text-2xl font-semibold">{averageValue}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-bold">Exceeding Limits</h3>
          <p className="text-2xl font-semibold">{pollutantsExceeding}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#1a202c] text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Measured Value Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#FFFFFF" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#FFFFFF" />
            <YAxis stroke="#FFFFFF" />
            <Tooltip contentStyle={{ backgroundColor: '#1a202c', color: '#FFFFFF' }} />
            <Line type="monotone" dataKey="value" stroke="#F59E0B" name="Measured Value" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Pollutant</th>
            <th className="p-3">Value</th>
            <th className="p-3">Station</th>
            <th className="p-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {environmentalData.map((report) => (
            <tr key={report.id} className="odd:bg-white even:bg-gray-50">
              <td className="p-3">{new Date(report.measurementDate).toLocaleDateString()}</td>
              <td className="p-3">
                {report.pollutant.name} ({report.pollutant.unit})
              </td>
              <td className="p-3">{report.measuredValue}</td>
              <td className="p-3">
                {report.monitoringStation?.name || 'N/A'} - {report.monitoringStation?.location || ''}
              </td>
              <td className="p-3">{report.notes || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

