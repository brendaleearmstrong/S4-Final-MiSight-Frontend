// src/components/dashboard/sections/MinesSection.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';
import { endpoints } from '@/services/api';

export function MinesSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingMine, setEditingMine] = useState(null);
  const queryClient = useQueryClient();

  // Fetch mines, provinces, and minerals data
  const { data: mines, isLoading: minesLoading } = useQuery({
    queryKey: ['mines'],
    queryFn: endpoints.mines.getAll
  });

  const { data: provinces = [] } = useQuery({
    queryKey: ['provinces'],
    queryFn: endpoints.provinces.getAll
  });

  const { data: minerals = [] } = useQuery({
    queryKey: ['minerals'],
    queryFn: endpoints.minerals.getAll
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (formData) => {
      // Transform form data to match API requirements
      const data = {
        name: formData.name,
        location: formData.location,
        company: formData.company,
        province_id: parseInt(formData.province_id),
        mineral_ids: formData.mineral_ids.map(id => parseInt(id))
      };
      
      console.log('Creating mine with data:', data);
      return await endpoints.mines.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('mines');
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Failed to create mine:', error);
      alert('Failed to create mine. Please try again.');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const preparedData = {
        name: data.name,
        location: data.location,
        company: data.company,
        province_id: parseInt(data.province_id),
        mineral_ids: data.mineral_ids.map(id => parseInt(id))
      };
      return await endpoints.mines.update(id, preparedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('mines');
      setShowModal(false);
      setEditingMine(null);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: endpoints.mines.delete,
    onSuccess: () => queryClient.invalidateQueries('mines')
  });

  const columns = [
    { key: 'name', label: 'Mine Name' },
    { key: 'location', label: 'Location' },
    { key: 'company', label: 'Company' },
    { 
      key: 'province',
      label: 'Province',
      render: (province) => province?.name || '-'
    },
    { 
      key: 'minerals', 
      label: 'Minerals',
      render: (minerals) => minerals?.map(m => m.name).join(', ') || '-'
    }
  ];

  const fields = [
    { 
      name: 'name', 
      label: 'Mine Name', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'location', 
      label: 'Location', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'company', 
      label: 'Company', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'province_id', 
      label: 'Province', 
      type: 'select',
      required: true,
      options: provinces.map(province => ({
        value: province.id.toString(),
        label: province.name
      }))
    },
    { 
      name: 'mineral_ids', 
      label: 'Minerals', 
      type: 'multiselect',
      required: true,
      options: minerals.map(mineral => ({
        value: mineral.id.toString(),
        label: mineral.name
      }))
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      if (editingMine) {
        await updateMutation.mutateAsync({ id: editingMine.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  if (minesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Mines Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mine
        </button>
      </div>

      <DataTable
        data={mines || []}
        columns={columns}
        onEdit={(mine) => {
          setEditingMine({
            ...mine,
            province_id: mine.province?.id.toString(),
            mineral_ids: mine.minerals?.map(m => m.id.toString()) || []
          });
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this mine?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      <ManagementModal
        title="Mine"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingMine(null);
        }}
        onSubmit={handleSubmit}
        fields={fields}
        data={editingMine}
      />
    </div>
  );
}