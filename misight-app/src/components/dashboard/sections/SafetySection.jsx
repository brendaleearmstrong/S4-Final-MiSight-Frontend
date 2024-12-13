// src/components/dashboard/sections/SafetySection.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';
import { endpoints } from '@/services/api';

export function SafetySection() {
  const [showModal, setShowModal] = useState(false);
  const [editingSafety, setEditingSafety] = useState(null);
  const queryClient = useQueryClient();

  const { data: safetyData, isLoading } = useQuery({
    queryKey: ['safetyData'],
    queryFn: endpoints.safetyData.getAll
  });

  const { data: mines = [] } = useQuery({
    queryKey: ['mines'],
    queryFn: endpoints.mines.getAll
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const data = {
        dateRecorded: formData.dateRecorded,
        mineId: parseInt(formData.mine_id),
        lostTimeIncidents: parseInt(formData.lostTimeIncidents),
        nearMisses: parseInt(formData.nearMisses),
        safetyLevel: formData.safetyLevel
      };
      return await endpoints.safetyData.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('safetyData');
      setShowModal(false);
    }
  });

  const columns = [
    { key: 'dateRecorded', label: 'Date' },
    { 
      key: 'mine', 
      label: 'Mine',
      render: (mine) => mine?.name || '-'
    },
    { key: 'lostTimeIncidents', label: 'Lost Time Incidents' },
    { key: 'nearMisses', label: 'Near Misses' },
    { key: 'safetyLevel', label: 'Safety Level' }
  ];

  const fields = [
    { 
      name: 'dateRecorded', 
      label: 'Date', 
      type: 'date', 
      required: true 
    },
    { 
      name: 'mine_id', 
      label: 'Mine', 
      type: 'select',
      required: true,
      options: mines.map(mine => ({
        value: mine.id.toString(),
        label: mine.name
      }))
    },
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
        { value: 'NEEDS_IMPROVEMENT', label: 'Needs Improvement' },
        { value: 'CRITICAL', label: 'Critical' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Safety Data Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Safety Record
        </button>
      </div>

      <DataTable
        data={safetyData || []}
        columns={columns}
        onEdit={(record) => {
          setEditingSafety(record);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this safety record?')) {
            endpoints.safetyData.delete(id);
            queryClient.invalidateQueries('safetyData');
          }
        }}
      />

      <ManagementModal
        title="Safety Record"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSafety(null);
        }}
        onSubmit={(data) => {
          if (editingSafety) {
            // Handle update
            endpoints.safetyData.update(editingSafety.id, data);
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={fields}
        data={editingSafety}
      />
    </div>
  );
}