// src/components/dashboard/sections/UsersSection.jsx
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
      const data = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        privileges: formData.privileges || []
      };
      return await endpoints.users.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setShowModal(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await endpoints.users.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      setShowModal(false);
    }
  });

  const columns = [
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role' },
    { 
      key: 'privileges', 
      label: 'Privileges',
      render: (privileges) => privileges?.join(', ') || '-'
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
        { value: 'ADMIN', label: 'Admin' },
        { value: 'MINE_ADMIN', label: 'Mine Admin' },
        { value: 'USER', label: 'User' }
      ]
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
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
        data={users || []}
        columns={columns}
        onEdit={(user) => {
          setEditingUser(user);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this user?')) {
            endpoints.users.delete(id);
            queryClient.invalidateQueries('users');
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