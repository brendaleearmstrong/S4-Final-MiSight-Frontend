import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';
import axios from 'axios';

export function ProvincesSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingProvince, setEditingProvince] = useState(null);
  const queryClient = useQueryClient();

  // Direct fetch from API endpoint
  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ['provinces-with-mines'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8080/api/provinces');
      const provincesData = response.data;
      
      // Fetch mine data for each province
      const provincesWithMines = await Promise.all(
        provincesData.map(async (province) => {
          const minesResponse = await axios.get(`http://localhost:8080/api/mines?province=${province.id}`);
          return {
            ...province,
            mines: minesResponse.data || []
          };
        })
      );
      
      return provincesWithMines;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post('http://localhost:8080/api/provinces', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['provinces-with-mines']);
      setShowModal(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await axios.put(`http://localhost:8080/api/provinces/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['provinces-with-mines']);
      setShowModal(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`http://localhost:8080/api/provinces/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['provinces-with-mines']);
    }
  });

  const columns = [
    { key: 'name', label: 'Province Name' },
    { key: 'abbreviation', label: 'Code' },
    { 
      key: 'mines', 
      label: 'Active Mines',
      render: (mines, province) => (
        <div className="flex items-center">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
            ${(mines?.length || 0) > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
          >
            {mines?.length || 0} {(mines?.length || 0) === 1 ? 'mine' : 'mines'}
          </span>
          {mines?.length > 0 && (
            <div className="ml-2 text-xs text-gray-500">
              {mines.slice(0, 2).map(mine => mine.name).join(', ')}
              {mines.length > 2 && '...'}
            </div>
          )}
        </div>
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

  // Calculate statistics
  const stats = {
    totalProvinces: provinces.length,
    totalMines: provinces.reduce((total, province) => total + (province.mines?.length || 0), 0),
    avgMinesPerProvince: (provinces.reduce((total, province) => 
      total + (province.mines?.length || 0), 0) / Math.max(provinces.length, 1)).toFixed(1)
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{stats.totalProvinces}</div>
            <div className="text-sm text-blue-600">Total Provinces</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">{stats.totalMines}</div>
            <div className="text-sm text-green-600">Total Active Mines</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-700">{stats.avgMinesPerProvince}</div>
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