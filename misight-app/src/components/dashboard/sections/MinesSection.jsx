import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';
import { endpoints } from '../../../services/api';

export function MinesSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingMine, setEditingMine] = useState(null);
  const queryClient = useQueryClient();

  const { data: mines, isLoading, error } = useQuery({
    queryKey: ['mines'],
    queryFn: endpoints.mines.getAll,
    retry: 1
  });

  const createMutation = useMutation({
    mutationFn: endpoints.mines.create,
    onSuccess: () => {
      queryClient.invalidateQueries('mines');
      setShowModal(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => endpoints.mines.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries('mines');
      setShowModal(false);
      setEditingMine(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: endpoints.mines.delete,
    onSuccess: () => {
      queryClient.invalidateQueries('mines');
    }
  });

  const columns = [
    { key: 'name', label: 'Mine Name' },
    { key: 'location', label: 'Location' },
    { key: 'company', label: 'Company' },
    { 
      key: 'minerals', 
      label: 'Minerals',
      render: (minerals) => minerals?.map(m => m.name).join(', ') || '-'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Failed to load mines data. Please try again later.
        {error.message && <p className="text-sm mt-1">{error.message}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
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
          setEditingMine(mine);
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
        onSubmit={(data) => {
          if (editingMine) {
            updateMutation.mutate({ id: editingMine.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={[
          { name: 'name', label: 'Mine Name', type: 'text' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'province', label: 'Province', type: 'text' }
        ]}
        data={editingMine}
      />
    </div>
  );
}