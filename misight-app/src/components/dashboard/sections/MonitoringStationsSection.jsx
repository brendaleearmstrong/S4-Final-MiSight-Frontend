import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/dashboard/DataTable';
import { ManagementModal } from '@/components/dashboard/ManagementModal';
import { endpoints } from '@/services/api';

export function MonitoringStationsSection() {
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const queryClient = useQueryClient();

  // Fetch monitoring stations data
  const { data: stations, isLoading: stationsLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: () => endpoints.monitoringStations.getAll()
  });

  // Fetch provinces for the dropdown
  const { data: provinces } = useQuery({
    queryKey: ['provinces'],
    queryFn: endpoints.provinces.getAll
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const preparedData = {
        name: data.name,
        location: data.location,
        province: { id: parseInt(data.province_id) }
      };
      return await endpoints.monitoringStations.create(preparedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stations']);
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Failed to create station:', error);
      alert('Failed to create monitoring station. Please try again.');
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const preparedData = {
        name: data.name,
        location: data.location,
        province: { id: parseInt(data.province_id) }
      };
      return await endpoints.monitoringStations.update(id, preparedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stations']);
      setShowModal(false);
      setEditingStation(null);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => endpoints.monitoringStations.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['stations']);
    }
  });

  const columns = [
    { key: 'name', label: 'Station Name' },
    { key: 'location', label: 'Location' },
    { 
      key: 'province', 
      label: 'Province',
      render: (province) => province?.name || '-'
    }
  ];

  const fields = [
    { 
      name: 'name', 
      label: 'Station Name', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'location', 
      label: 'Location', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'province_id', 
      label: 'Province', 
      type: 'select',
      required: true,
      options: provinces?.map(province => ({
        value: province.id.toString(),
        label: province.name
      })) || []
    }
  ];

  if (stationsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Monitoring Stations</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Station
        </button>
      </div>

      <DataTable
        data={stations || []}
        columns={columns}
        onEdit={(station) => {
          setEditingStation({
            ...station,
            province_id: station.province?.id.toString()
          });
          setShowModal(true);
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this monitoring station?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      <ManagementModal
        title="Monitoring Station"
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingStation(null);
        }}
        onSubmit={(data) => {
          if (editingStation) {
            updateMutation.mutate({ id: editingStation.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        fields={fields}
        data={editingStation}
      />
    </div>
  );
}

export default MonitoringStationsSection;