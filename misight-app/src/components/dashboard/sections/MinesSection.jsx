import { useState } from 'react';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';

export function MinesSection({ data, minerals, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingMine, setEditingMine] = useState(null);

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

  const fields = [
    { name: 'name', label: 'Mine Name', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'company', label: 'Company', type: 'text' },
    { 
      name: 'minerals', 
      label: 'Minerals', 
      type: 'multiselect',
      options: minerals?.map(m => ({ value: m.id, label: m.name })) || [] 
    }
  ];

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
        data={data}
        columns={columns}
        onEdit={(mine) => {
          setEditingMine(mine);
          setShowModal(true);
        }}
        onDelete={onDelete}
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
            onEdit(editingMine.id, data);
          } else {
            onAdd(data);
          }
          setShowModal(false);
          setEditingMine(null);
        }}
        fields={fields}
        data={editingMine}
      />
    </div>
  );
}