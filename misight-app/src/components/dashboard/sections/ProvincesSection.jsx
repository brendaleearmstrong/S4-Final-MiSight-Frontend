// src/components/dashboard/sections/ProvincesSection.jsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';
import { endpoints } from '@/services/api';

export function ProvincesSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingProvince, setEditingProvince] = useState(null);
  const queryClient = useQueryClient();

  // Fetch provinces with their related mines data
  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const response = await endpoints.provinces.getAll();
      return response;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const data = {
        name: formData.name,
        abbreviation: formData.abbreviation
      };
      const response = await endpoints.provinces.create(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('provinces');
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Failed to create province:', error);
      alert('Failed to create province. Please try again.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await endpoints.provinces.update(id, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('provinces');
      setShowModal(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await endpoints.provinces.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('provinces');
    }
  });

  // Calculate statistics
  const totalProvinces = provinces.length;
  const totalMines = provinces.reduce((sum, province) => sum + (province.mines?.length || 0), 0);
  const avgMinesPerProvince = totalMines / totalProvinces || 0;

  const columns = [
    { key: 'name', label: 'Province Name' },
    { key: 'abbreviation', label: 'Code' },
    { 
      key: 'mines', 
      label: 'Active Mines',
      render: (mines) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {mines?.length || 0} mines
        </span>
      )
    }
  ];

  const fields = [
    { 
      name: 'name', 
      label: 'Province Name', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'abbreviation', 
      label: 'Province Code', 
      type: 'text', 
      required: true,
      maxLength: 2
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
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{totalProvinces}</div>
            <div className="text-sm text-blue-600">Total Provinces</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">{totalMines}</div>
            <div className="text-sm text-green-600">Total Active Mines</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-700">
              {avgMinesPerProvince.toFixed(1)}
            </div>
            <div className="text-sm text-amber-600">Average Mines per Province</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Provinces Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Province
        </button>
      </div>

      <DataTable
        data={provinces}
        columns={columns}
        onEdit={(province) => {
          setEditingProvince(province);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this province?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      <ManagementModal
        title="Province"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProvince(null);
        }}
        onSubmit={(data) => {
          if (editingProvince) {
            updateMutation.mutate({ id: editingProvince.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={fields}
        data={editingProvince}
      />
    </div>
  );
}