import { useState } from 'react';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';

export function ProvincesSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Mock data for Phase 1
  const [provinces] = useState([
    {
      id: 1,
      name: 'Newfoundland and Labrador',
      abbreviation: 'NL',
      activeMines: 5
    },
    {
      id: 2,
      name: 'Nova Scotia',
      abbreviation: 'NS',
      activeMines: 3
    },
    {
      id: 3,
      name: 'New Brunswick',
      abbreviation: 'NB',
      activeMines: 2
    },
    {
      id: 4,
      name: 'Quebec',
      abbreviation: 'QC',
      activeMines: 8
    },
    {
      id: 5,
      name: 'Ontario',
      abbreviation: 'ON',
      activeMines: 12
    }
  ]);

  const columns = [
    { key: 'name', label: 'Province Name' },
    { key: 'abbreviation', label: 'Code' },
    { 
      key: 'activeMines', 
      label: 'Active Mines',
      render: (value) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value} mines
        </span>
      )
    }
  ];

  const fields = [
    { name: 'name', label: 'Province Name', type: 'text' },
    { name: 'abbreviation', label: 'Province Code', type: 'text', maxLength: 2 }
  ];

  const handleAdd = (data) => {
    const newProvince = {
      id: provinces.length + 1,
      ...data,
      activeMines: 0
    };
    setProvinces([...provinces, newProvince]);
    setShowModal(false);
  };

  const handleEdit = (data) => {
    setProvinces(provinces.map(province => 
      province.id === editingItem.id 
        ? { ...province, ...data }
        : province
    ));
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this province?')) {
      setProvinces(provinces.filter(province => province.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Provinces Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Province
        </button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">{provinces.length}</div>
            <div className="text-sm text-blue-600">Total Provinces</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {provinces.reduce((sum, province) => sum + province.activeMines, 0)}
            </div>
            <div className="text-sm text-green-600">Total Active Mines</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-700">
              {Math.round(provinces.reduce((sum, province) => sum + province.activeMines, 0) / provinces.length)}
            </div>
            <div className="text-sm text-amber-600">Average Mines per Province</div>
          </div>
        </div>
      </div>

      <DataTable
        data={provinces}
        columns={columns}
        onEdit={(province) => {
          setEditingItem(province);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />

      {showModal && (
        <ManagementModal
          title="Province"
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          fields={fields}
          data={editingItem}
          onSubmit={(data) => {
            if (editingItem) {
              handleEdit(data);
            } else {
              handleAdd(data);
            }
          }}
        />
      )}
    </div>
  );
}