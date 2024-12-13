// src/components/dashboard/sections/MineralsSection.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';
import { endpoints } from '@/services/api';

export function MineralsSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingMineral, setEditingMineral] = useState(null);
  const queryClient = useQueryClient();

  const { data: minerals, isLoading } = useQuery({
    queryKey: ['minerals'],
    queryFn: endpoints.minerals.getAll
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const data = {
        name: formData.name,
        type: formData.type
      };
      return await endpoints.minerals.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('minerals');
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Failed to create mineral:', error);
      alert('Failed to create mineral. Please try again.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await endpoints.minerals.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('minerals');
      setShowModal(false);
    }
  });

  const columns = [
    { key: 'name', label: 'Mineral Name' },
    { key: 'type', label: 'Type' },
    { 
      key: 'mines', 
      label: 'Active Mines',
      render: (mines) => mines?.length || 0 
    }
  ];

  const fields = [
    { 
      name: 'name', 
      label: 'Mineral Name', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'type', 
      label: 'Type', 
      type: 'select',
      required: true,
      options: [
        { value: 'METAL', label: 'Metal' },
        { value: 'NON_METAL', label: 'Non-Metal' },
        { value: 'PRECIOUS', label: 'Precious Metal' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Minerals Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mineral
        </button>
      </div>

      <DataTable
        data={minerals || []}
        columns={columns}
        onEdit={(mineral) => {
          setEditingMineral(mineral);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this mineral?')) {
            endpoints.minerals.delete(id);
            queryClient.invalidateQueries('minerals');
          }
        }}
      />

      <ManagementModal
        title="Mineral"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMineral(null);
        }}
        onSubmit={(data) => {
          if (editingMineral) {
            updateMutation.mutate({ id: editingMineral.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={fields}
        data={editingMineral}
      />
    </div>
  );
}