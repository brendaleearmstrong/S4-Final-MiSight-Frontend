import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { ManagementModal } from '@/components/dashboard/ManagementModal';
import { SCULLY_MINE } from '@/services/api';
import { MineAdminSafetyReport } from './MineSafetyDataReport';
import api from '@/services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MOCK_DATA = {
  safetyData: [
    {
      id: 1,
      dateRecorded: '2024-12-01',
      lostTimeIncidents: 0,
      nearMisses: 1,
      safetyLevel: 'GOOD',
    },
    {
      id: 2,
      dateRecorded: '2024-12-02',
      lostTimeIncidents: 1,
      nearMisses: 2,
      safetyLevel: 'FAIR',
    },
  ],
};

const fields = [
  {
    name: 'lostTimeIncidents',
    label: 'Lost Time Incidents',
    type: 'number',
    required: true,
    min: 0,
  },
  {
    name: 'nearMisses',
    label: 'Near Misses',
    type: 'number',
    required: true,
    min: 0,
  },
  {
    name: 'safetyLevel',
    label: 'Safety Level',
    type: 'select',
    required: true,
    options: [
      { value: 'CRITICAL', label: 'Critical' },
      { value: 'FAIR', label: 'Fair' },
      { value: 'GOOD', label: 'Good' },
      { value: 'EXCELLENT', label: 'Excellent' },
    ],
  },
  {
    name: 'notes',
    label: 'Notes',
    type: 'textarea',
  },
];

export function SafetyDataSection() {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: safetyData } = useQuery({
    queryKey: ['safety-data', SCULLY_MINE.id],
    queryFn: async () => {
      try {
        return await api.endpoints.safetyData.getByMine(SCULLY_MINE.id);
      } catch (error) {
        console.warn('Safety API failed, using mock data:', error);
        return MOCK_DATA.safetyData;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const preparedData = {
        mine: { id: SCULLY_MINE.id },
        lostTimeIncidents: parseInt(data.lostTimeIncidents),
        nearMisses: parseInt(data.nearMisses),
        safetyLevel: data.safetyLevel,
        dateRecorded: new Date().toISOString().split('T')[0],
        notes: data.notes || '',
      };

      return await api.endpoints.safetyData.create(preparedData);
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['safety-data', SCULLY_MINE.id], (old) => [
        ...(old || []),
        newData,
      ]);
      setShowModal(false);
    },
  });

  return (
    <div className="p-6 bg-white text-gray-900 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Safety Report</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Safety Report
        </button>
      </div>

      {/* Visualization */}
      <div className="bg-dark-blue p-4 rounded-lg shadow mb-6">
        <h3 className="text-white text-lg font-semibold mb-4">Safety Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={safetyData}>
              <CartesianGrid stroke="#F59E0B" strokeDasharray="3 3" />
              <XAxis
                dataKey="dateRecorded"
                stroke="#FFFFFF"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis stroke="#FFFFFF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E3A8A',
                  color: '#FFFFFF',
                  border: 'none',
                }}
                labelStyle={{ color: '#F59E0B' }}
              />
              <Line
                type="monotone"
                dataKey="lostTimeIncidents"
                stroke="#F59E0B"
                strokeWidth={2}
                name="Lost Time Incidents"
              />
              <Line
                type="monotone"
                dataKey="nearMisses"
                stroke="#FFFFFF"
                strokeWidth={2}
                name="Near Misses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <MineAdminSafetyReport data={safetyData} />

      <ManagementModal
        title="Safety Report"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={createMutation.mutate}
        fields={fields}
      />
    </div>
  );
}

export default SafetyDataSection;
