import { useState } from 'react';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';

export function UsersSection({ data, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' }
  ];

  const fields = [
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { 
      name: 'role', 
      label: 'Role', 
      type: 'select',
      options: ['Mine Admin', 'User/Stakeholder'] 
    }
  ];

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Users Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        onEdit={(user) => {
          setEditingUser(user);
          setShowModal(true);
        }}
        onDelete={onDelete}
      />

      <ManagementModal
        title="User"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSubmit={(data) => {
          if (editingUser) {
            onEdit(editingUser.id, data);
          } else {
            onAdd(data);
          }
          setShowModal(false);
          setEditingUser(null);
        }}
        fields={fields}
        data={editingUser}
      />
    </div>
  );
}