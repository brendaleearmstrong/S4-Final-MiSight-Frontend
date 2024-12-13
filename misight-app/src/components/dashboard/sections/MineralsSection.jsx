import { useState } from 'react';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';

export function MineralsSection({ data, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingMineral, setEditingMineral] = useState(null);

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
    { name: 'name', label: 'Mineral Name', type: 'text' },
    { name: 'type', label: 'Type', type: 'text' }
  ];

  return (
    <div>
      <div className="flex justify-between mb-6">
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
        data={data}
        columns={columns}
        onEdit={(mineral) => {
          setEditingMineral(mineral);
          setShowModal(true);
        }}
        onDelete={onDelete}
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
            onEdit(editingMineral.id, data);
          } else {
            onAdd(data);
          }
          setShowModal(false);
          setEditingMineral(null);
        }}
        fields={fields}
        data={editingMineral}
      />
    </div>
  );
}