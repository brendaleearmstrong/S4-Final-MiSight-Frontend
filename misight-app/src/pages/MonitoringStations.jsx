
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, Activity } from 'lucide-react';
import { endpoints } from '@/api/apiClient';

export default function MonitoringStations() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stations, isLoading } = useQuery(
    ['monitoring-stations'], 
    () => endpoints.stations.getAll()
  );
  
  const { data: provinces } = useQuery(['provinces'], () => endpoints.provinces.getAll());
  const { data: pollutants } = useQuery(['pollutants'], () => endpoints.pollutants.getAll());

  const createMutation = useMutation(
    (newStation) => endpoints.stations.create(newStation),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['monitoring-stations']);
        toast({ description: 'Monitoring station added successfully' });
        setDialogOpen(false);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to add station'
        });
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => endpoints.stations.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['monitoring-stations']);
        toast({ description: 'Monitoring station updated successfully' });
        setDialogOpen(false);
        setEditingStation(null);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to update station'
        });
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => endpoints.stations.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['monitoring-stations']);
        toast({ description: 'Monitoring station deleted successfully' });
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const stationData = {
      location: formData.get('location'),
      name: formData.get('name'),
      province: { id: parseInt(formData.get('provinceId')) },
      pollutants: Array.from(formData.getAll('pollutantIds')).map(id => ({ id: parseInt(id) }))
    };

    if (editingStation) {
      updateMutation.mutate({ id: editingStation.id, data: stationData });
    } else {
      createMutation.mutate(stationData);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading monitoring stations...</div>;
  }

  const totalStations = stations?.data?.length || 0;
  const activeStations = stations?.data?.filter(s => s.pollutants?.length > 0)?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Monitoring Stations</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStation(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Station
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingStation ? 'Edit Monitoring Station' : 'Add New Monitoring Station'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Station Name"
                defaultValue={editingStation?.name}
                required
              />

              <Input
                name="location"
                placeholder="Location"
                defaultValue={editingStation?.location}
                required
              />

              <select
                name="provinceId"
                className="w-full p-2 border rounded"
                defaultValue={editingStation?.province?.id}
                required
              >
                <option value="">Select Province</option>
                {provinces?.data?.map(province => (
                  <option key={province.id} value={province.id}>{province.name}</option>
                ))}
              </select>

              <div className="space-y-2">
                <label className="text-sm font-medium">Monitored Pollutants</label>
                <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-2">
                  {pollutants?.data?.map(pollutant => (
                    <div key={pollutant.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="pollutantIds"
                        value={pollutant.id}
                        defaultChecked={editingStation?.pollutants?.some(p => p.id === pollutant.id)}
                        className="rounded border-gray-300"
                      />
                      <label>{pollutant.name} ({pollutant.unit})</label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingStation ? 'Update' : 'Add'} Station
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{activeStations}</div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Province</TableHead>
            <TableHead>Monitored Pollutants</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations?.data?.map(station => (
            <TableRow key={station.id}>
              <TableCell>{station.name}</TableCell>
              <TableCell>{station.location}</TableCell>
              <TableCell>{station.province.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {station.pollutants?.map(pollutant => (
                    <span 
                      key={pollutant.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {pollutant.name}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingStation(station);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this station?')) {
                      deleteMutation.mutate(station.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}