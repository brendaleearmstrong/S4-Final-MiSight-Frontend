import { useState } from 'react';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';

export function PollutantsSection({ data, onAdd, onEdit, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [editingPollutant, setEditingPollutant] = useState(null);

  // Mock data for Phase 1
  const mockPollutants = [
    {
      id: 1,
      name: 'PM2.5',
      category: 'Air Quality',
      unit: 'µg/m³',
      threshold: 25
    },
    {
      id: 2,
      name: 'PM10',
      category: 'Air Quality',
      unit: 'µg/m³',
      threshold: 50
    }
  ];

  const columns = [
    { key: 'name', label: 'Pollutant Name' },
    { key: 'category', label: 'Category' },
    { key: 'unit', label: 'Unit' },
    { key: 'threshold', label: 'Threshold' }
  ];

  const fields = [
    { name: 'name', label: 'Pollutant Name', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'unit', label: 'Unit', type: 'text' },
    { name: 'threshold', label: 'Threshold', type: 'number' }
  ];

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Pollutants Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pollutant
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-amber-800">
          Phase 1 Preview: Showing mock data. API integration coming in Phase 2.
        </p>
      </div>

      <DataTable
        data={mockPollutants}
        columns={columns}
        onEdit={(pollutant) => {
          setEditingPollutant(pollutant);
          setShowModal(true);
        }}
        onDelete={onDelete}
      />

      <ManagementModal
        title="Pollutant"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPollutant(null);
        }}
        onSubmit={(data) => {
          if (editingPollutant) {
            onEdit(editingPollutant.id, data);
          } else {
            onAdd(data);
          }
          setShowModal(false);
          setEditingPollutant(null);
        }}
        fields={fields}
        data={editingPollutant}
      />
    </div>
  );
}