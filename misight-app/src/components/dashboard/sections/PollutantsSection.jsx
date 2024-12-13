import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';
import { endpoints } from '@/services/api';

export function PollutantsSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingPollutant, setEditingPollutant] = useState(null);
  const queryClient = useQueryClient();

  const { data: pollutants, isLoading } = useQuery({
    queryKey: ['pollutants'],
    queryFn: endpoints.pollutants.getAll
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const preparedData = {
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        benchmarkValue: parseFloat(formData.benchmarkValue),
        benchmarkType: formData.benchmarkType,
        description: formData.description
      };
      const response = await endpoints.pollutants.create(preparedData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('pollutants');
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Failed to create pollutant:', error);
      alert('Failed to create pollutant. Please try again.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const preparedData = {
        name: data.name,
        category: data.category,
        unit: data.unit,
        benchmarkValue: parseFloat(data.benchmarkValue),
        benchmarkType: data.benchmarkType,
        description: data.description
      };
      const response = await endpoints.pollutants.update(id, preparedData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('pollutants');
      setShowModal(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: endpoints.pollutants.delete,
    onSuccess: () => queryClient.invalidateQueries('pollutants')
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'unit', label: 'Unit' },
    { key: 'benchmarkValue', label: 'Benchmark Value' },
    { key: 'benchmarkType', label: 'Benchmark Type' }
  ];

  const fields = [
    { 
      name: 'name', 
      label: 'Pollutant Name', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'category', 
      label: 'Category', 
      type: 'select',
      required: true,
      options: [
        { value: 'AIR', label: 'Air Quality' },
        { value: 'WATER', label: 'Water Quality' },
        { value: 'SOIL', label: 'Soil Quality' },
        { value: 'NOISE', label: 'Noise Level' }
      ]
    },
    { 
      name: 'unit', 
      label: 'Unit', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'benchmarkValue', 
      label: 'Benchmark Value', 
      type: 'number',
      required: true,
      step: '0.01'
    },
    { 
      name: 'benchmarkType', 
      label: 'Benchmark Type', 
      type: 'select',
      required: true,
      options: [
        { value: 'MAXIMUM', label: 'Maximum Allowable' },
        { value: 'MINIMUM', label: 'Minimum Required' },
        { value: 'TARGET', label: 'Target Value' },
        { value: 'ALERT', label: 'Alert Level' }
      ]
    },
    { 
      name: 'description', 
      label: 'Description', 
      type: 'textarea'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Pollutants Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pollutant
        </button>
      </div>

      <DataTable
        data={pollutants || []}
        columns={columns}
        onEdit={(pollutant) => {
          setEditingPollutant(pollutant);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this pollutant?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      <ManagementModal
        title="Pollutant"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPollutant(null);
        }}
        onSubmit={(data) => {
          if (editingPollutant) {
            updateMutation.mutate({ id: editingPollutant.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={fields}
        data={editingPollutant}
      />
    </div>
  );
}