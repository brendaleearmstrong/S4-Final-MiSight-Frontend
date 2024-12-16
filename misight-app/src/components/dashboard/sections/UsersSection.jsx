import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';
import { endpoints } from '@/services/api';

export function UsersSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: endpoints.users.getAll
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      return await endpoints.users.create(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowModal(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await endpoints.users.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setShowModal(false);
      setEditingUser(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: endpoints.users.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    }
  });

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {status || 'active'}
        </span>
      )
    }
  ];

  const fields = [
    { 
      name: 'username', 
      label: 'Username', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'password', 
      label: 'Password', 
      type: 'password',
      required: !editingUser
    },
    { 
      name: 'role', 
      label: 'Role', 
      type: 'select',
      required: true,
      options: [
        { value: 'USER', label: 'User' },
        { value: 'MINE_ADMIN', label: 'Mine Admin' },
        { value: 'ADMIN', label: 'Admin' }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <DataTable
        data={users || []}
        columns={columns}
        onEdit={(user) => {
          setEditingUser(user);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this user?')) {
            deleteMutation.mutate(id);
          }
        }}
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
            updateMutation.mutate({ id: editingUser.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={fields}
        data={editingUser}
      />
    </div>
  );
}

export default UsersSection;