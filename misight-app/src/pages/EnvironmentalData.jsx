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
import { Calendar } from '@/components/ui/calendar';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { endpoints } from '@/api/apiClient';

export default function EnvironmentalData() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: envData, isLoading } = useQuery(
    ['environmental-data'], 
    () => endpoints.environmental.getAll()
  );
  
  const { data: mines } = useQuery(['mines'], () => endpoints.mines.getAll());
  const { data: stations } = useQuery(['stations'], () => endpoints.stations.getAll());
  const { data: pollutants } = useQuery(['pollutants'], () => endpoints.pollutants.getAll());

  const createMutation = useMutation(
    (newData) => endpoints.environmental.create(newData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['environmental-data']);
        toast({ description: 'Environmental data recorded successfully' });
        setDialogOpen(false);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to record data'
        });
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => endpoints.environmental.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['environmental-data']);
        toast({ description: 'Environmental data updated successfully' });
        setDialogOpen(false);
        setEditingData(null);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to update data'
        });
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => endpoints.environmental.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['environmental-data']);
        toast({ description: 'Environmental data deleted successfully' });
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const envDataPayload = {
      mine: { id: parseInt(formData.get('mineId')) },
      pollutant: { id: parseInt(formData.get('pollutantId')) },
      monitoringStation: { id: parseInt(formData.get('stationId')) },
      measuredValue: parseFloat(formData.get('measuredValue')),
      measurementDate: new Date(formData.get('measurementDate')).toISOString(),
      notes: formData.get('notes')
    };

    if (editingData) {
      updateMutation.mutate({ id: editingData.id, data: envDataPayload });
    } else {
      createMutation.mutate(envDataPayload);
    }
  };

  const isExceedingBenchmark = (data) => {
    return data.measuredValue > data.pollutant.benchmarkValue;
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading environmental data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Environmental Monitoring</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingData(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Record Measurement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingData ? 'Edit Measurement' : 'Record New Measurement'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <select
                name="mineId"
                className="w-full p-2 border rounded"
                defaultValue={editingData?.mine?.id}
                required
              >
                <option value="">Select Mine</option>
                {mines?.data?.map(mine => (
                  <option key={mine.id} value={mine.id}>{mine.name}</option>
                ))}
              </select>

              <select
                name="pollutantId"
                className="w-full p-2 border rounded"
                defaultValue={editingData?.pollutant?.id}
                required
              >
                <option value="">Select Pollutant</option>
                {pollutants?.data?.map(pollutant => (
                  <option key={pollutant.id} value={pollutant.id}>
                    {pollutant.name} ({pollutant.unit})
                  </option>
                ))}
              </select>

              <select
                name="stationId"
                className="w-full p-2 border rounded"
                defaultValue={editingData?.monitoringStation?.id}
                required
              >
                <option value="">Select Monitoring Station</option>
                {stations?.data?.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.location}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                step="0.01"
                name="measuredValue"
                placeholder="Measured Value"
                defaultValue={editingData?.measuredValue}
                required
              />

              <Input
                type="datetime-local"
                name="measurementDate"
                defaultValue={editingData?.measurementDate?.split('.')[0] || new Date().toISOString().split('.')[0]}
                required
              />

              <Input
                name="notes"
                placeholder="Notes"
                defaultValue={editingData?.notes}
              />

              <Button type="submit" className="w-full">
                {editingData ? 'Update' : 'Record'} Measurement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {envData?.data?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Critical Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {envData?.data?.filter(isExceedingBenchmark)?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Mine</TableHead>
            <TableHead>Pollutant</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {envData?.data?.map(data => (
            <TableRow key={data.id}>
              <TableCell>{new Date(data.measurementDate).toLocaleString()}</TableCell>
              <TableCell>{data.mine.name}</TableCell>
              <TableCell>{data.pollutant.name}</TableCell>
              <TableCell>
                {data.measuredValue} {data.pollutant.unit}
                {isExceedingBenchmark(data) && (
                  <AlertCircle className="inline ml-2 text-red-500 w-4 h-4" />
                )}
              </TableCell>
              <TableCell>{data.monitoringStation.location}</TableCell>
              <TableCell>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isExceedingBenchmark(data) 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isExceedingBenchmark(data) ? 'Exceeding' : 'Normal'}
                </div>
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingData(data);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this measurement?')) {
                      deleteMutation.mutate(data.id);
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