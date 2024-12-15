import { useState } from 'react';
import { ManagementModal } from '../ManagementModal';
import { DataTable } from '../DataTable';
import { Plus } from 'lucide-react';

export function UsersSection({ data, loading, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role' },
    { key: 'lastLogin', label: 'Last Login' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Users Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        onEdit={(item) => {
          setSelectedItem(item);
          setShowModal(true);
        }}
        onDelete={onDelete}
        loading={loading}
      />

      {showModal && (
        <ManagementModal
          type="users"
          data={selectedItem}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onSubmit={(data) => {
            if (selectedItem) {
              onEdit(selectedItem.id, data);
            } else {
              onAdd(data);
            }
            setShowModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
