import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { ManagementModal } from '@/components/dashboard/ManagementModal';
import api from '@/services/api';

const SCULLY_MINE_ID = 3;

export function EnvironmentalDataSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const queryClient = useQueryClient();

  // Fetch required data
  const { data: environmentalData, isLoading: dataLoading } = useQuery({
    queryKey: ['environmental-data', SCULLY_MINE_ID],
    queryFn: () => api.environmentalData.getByMine(SCULLY_MINE_ID)
  });

  const { data: pollutants, isLoading: pollutantsLoading } = useQuery({
    queryKey: ['pollutants'],
    queryFn: () => api.pollutants.getAll()
  });

  const { data: stations, isLoading: stationsLoading } = useQuery({
    queryKey: ['stations', SCULLY_MINE_ID],
    queryFn: () => api.monitoringStations.getByProvince(1) // Scully Mine is in NL (province_id = 1)
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const preparedData = {
        ...data,
        mineId: SCULLY_MINE_ID,
        measurementDate: new Date().toISOString(),
        pollutantId: parseInt(data.pollutantId),
        stationId: parseInt(data.stationId),
        measuredValue: parseFloat(data.measuredValue)
      };
      return await api.environmentalData.create(preparedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['environmental-data', SCULLY_MINE_ID]);
      setShowModal(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => {
      return api.environmentalData.update(id, {
        ...data,
        mineId: SCULLY_MINE_ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['environmental-data', SCULLY_MINE_ID]);
      setShowModal(false);
      setEditingData(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.environmentalData.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['environmental-data', SCULLY_MINE_ID]);
    }
  });

  const isLoading = dataLoading || pollutantsLoading || stationsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  const columns = [
    { 
      key: 'measurementDate', 
      label: 'Date',
      render: (date) => new Date(date).toLocaleDateString()
    },
    { 
      key: 'pollutant', 
      label: 'Pollutant',
      render: (pollutant) => pollutant?.name || '-'
    },
    { 
      key: 'measuredValue', 
      label: 'Value',
      render: (value, row) => `${value} ${row.pollutant?.unit || ''}`
    },
    { 
      key: 'monitoringStation', 
      label: 'Station',
      render: (station) => station?.location || '-'
    }
  ];

  const fields = [
    {
      name: 'pollutantId',
      label: 'Pollutant',
      type: 'select',
      required: true,
      options: pollutants?.map(p => ({
        value: p.id.toString(),
        label: `${p.name} (${p.unit})`
      })) || []
    },
    {
      name: 'measuredValue',
      label: 'Measured Value',
      type: 'number',
      required: true,
      step: '0.01'
    },
    {
      name: 'stationId',
      label: 'Monitoring Station',
      type: 'select',
      required: true,
      options: stations?.map(s => ({
        value: s.id.toString(),
        label: s.location
      })) || []
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Environmental Data - Scully Mine</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Measurement
        </button>
      </div>

      <DataTable
        data={environmentalData || []}
        columns={columns}
        onEdit={(record) => {
          setEditingData(record);
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this measurement?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      <ManagementModal
        title="Environmental Measurement"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingData(null);
        }}
        onSubmit={(data) => {
          if (editingData) {
            updateMutation.mutate({ id: editingData.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={fields}
        data={editingData}
      />
    </div>
  );
}

export default EnvironmentalDataSection;