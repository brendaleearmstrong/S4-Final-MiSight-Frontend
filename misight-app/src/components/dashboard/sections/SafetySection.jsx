import { useState } from 'react';
import { DataTable } from '../DataTable';
import { ManagementModal } from '../ManagementModal';
import { Plus } from 'lucide-react';

export function SafetySection() {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Mock data for Phase 1
  const [safetyData] = useState([
    {
      id: 1,
      date: '2024-03-01',
      mine: 'Voiseys Bay',
      lostTimeIncidents: 0,
      nearMisses: 2,
      safetyLevel: 'GOOD'
    },
    {
      id: 2,
      date: '2024-03-02',
      mine: 'Long Harbour',
      lostTimeIncidents: 1,
      nearMisses: 3,
      safetyLevel: 'FAIR'
    },
    {
      id: 3,
      date: '2024-03-03',
      mine: 'Scully Mine',
      lostTimeIncidents: 0,
      nearMisses: 1,
      safetyLevel: 'EXCELLENT'
    },
    {
      id: 4,
      date: '2024-03-04',
      mine: 'Pine Cove',
      lostTimeIncidents: 2,
      nearMisses: 4,
      safetyLevel: 'NEEDS_IMPROVEMENT'
    }
  ]);

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'mine', label: 'Mine' },
    { key: 'lostTimeIncidents', label: 'Lost Time Incidents' },
    { key: 'nearMisses', label: 'Near Misses' },
    { 
      key: 'safetyLevel', 
      label: 'Safety Level',
      render: (value) => {
        const colors = {
          EXCELLENT: 'text-green-600',
          GOOD: 'text-blue-600',
          FAIR: 'text-yellow-600',
          NEEDS_IMPROVEMENT: 'text-red-600'
        };
        return <span className={colors[value] || ''}>{value}</span>;
      }
    }
  ];

  const fields = [
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'mine', label: 'Mine', type: 'text' },
    { name: 'lostTimeIncidents', label: 'Lost Time Incidents', type: 'number' },
    { name: 'nearMisses', label: 'Near Misses', type: 'number' },
    { 
      name: 'safetyLevel', 
      label: 'Safety Level', 
      type: 'select',
      options: ['EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_IMPROVEMENT']
    }
  ];

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">Safety Data Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Safety Report
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p className="text-amber-800">
          Phase 1 Preview: Showing mock safety data for demonstration. API integration planned for Phase 2.
        </p>
      </div>

      <DataTable
        data={safetyData}
        columns={columns}
        onEdit={(item) => {
          setEditingItem(item);
          setShowModal(true);
        }}
        onDelete={(id) => console.log('Delete safety record:', id)}
      />

      {showModal && (
        <ManagementModal
          title="Safety Report"
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          fields={fields}
          data={editingItem}
          onSubmit={(data) => {
            console.log('Submit safety report:', data);
            setShowModal(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}