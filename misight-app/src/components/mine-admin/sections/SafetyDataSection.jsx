import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { ManagementModal } from '@/components/dashboard/ManagementModal';
import api from '@/services/api';

const SCULLY_MINE_ID = 3;

export function SafetyDataSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const queryClient = useQueryClient();

  const { data: safetyData, isLoading } = useQuery({
    queryKey: ['safety-data', SCULLY_MINE_ID],
    queryFn: () => api.safetyData.getByMine(SCULLY_MINE_ID)
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const preparedData = {
        ...data,
        mineId: SCULLY_MINE_ID,
        dateRecorded: new Date().toISOString(),
        lostTimeIncidents: parseInt(data.lostTimeIncidents),
        nearMisses: parseInt(data.nearMisses)
      };
      return await api.safetyData.create(preparedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['safety-data', SCULLY_MINE_ID]);
      setShowModal(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      return api.safetyData.update(id, {
        ...data,
        mineId: SCULLY_MINE_ID,
        lostTimeIncidents: parseInt(data.lostTimeIncidents),
        nearMisses: parseInt(data.nearMisses)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['safety-data', SCULLY_MINE_ID]);
      setShowModal(false);
      setEditingData(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.safetyData.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['safety-data', SCULLY_MINE_ID]);
    }
  });

  const columns = [
    { 
      key: 'dateRecorded', 
      label: 'Date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    { 
      key: 'lostTimeIncidents', 
      label: 'Lost Time Incidents'
    },
    { 
      key: 'nearMisses', 
      label: 'Near Misses'
    },
    { 
      key: 'safetyLevel', 
      label: 'Safety Level',
      render: (level) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
          level === 'FAIR' ? 'bg-yellow-100 text-yellow-800' :
          level === 'GOOD' ? 'bg-green-100 text-green-800' :
          level === 'EXCELLENT' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {level}
        </span>
      )
    }
  ];

  const fields = [
    {
      name: 'lostTimeIncidents',
      label: 'Lost Time Incidents',
      type: 'number',
      required: true,
      min: 0
    },
    {
      name: 'nearMisses',
      label: 'Near Misses',
      type: 'number',
      required: true,
      min: 0
    },
    {
      name: 'safetyLevel',
      label: 'Safety Level',
      type: 'select',
      required: true,
      options: [
        { value: 'EXCELLENT', label: 'Excellent' },
        { value: 'GOOD', label: 'Good' },
        { value: 'FAIR', label: 'Fair' },
        { value: 'CRITICAL', label: 'Critical' }
      ]
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Safety Reports - Scully Mine</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Safety Report
        </button>
      </div>

      <DataTable
        data={safetyData || []}
        columns={columns}
        onEdit={(record) => {
          setEditingData(record);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this safety report?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      <ManagementModal
        title="Safety Report"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingData(null);
        }}
        onSubmit={(data) => {
          if (editingData) {
            updateMutation.mutate({ id: editingData.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={fields}
        data={editingData}
      />
    </div>
  );
}

export default SafetyDataSection;