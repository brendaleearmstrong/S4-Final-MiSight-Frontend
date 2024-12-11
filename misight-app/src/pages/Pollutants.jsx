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
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { endpoints } from '@/api/apiClient';

export default function Pollutants() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPollutant, setEditingPollutant] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pollutants, isLoading } = useQuery(
    ['pollutants'], 
    () => endpoints.pollutants.getAll()
  );

  const categories = [
    'Air Quality',
    'Water Quality',
    'Soil Quality',
    'Noise',
    'Radiation'
  ];

  const units = [
    { value: 'mg/L', label: 'mg/L (milligrams per liter)' },
    { value: 'μg/m³', label: 'μg/m³ (micrograms per cubic meter)' },
    { value: 'ppm', label: 'ppm (parts per million)' },
    { value: 'ppb', label: 'ppb (parts per billion)' },
    { value: 'dB', label: 'dB (decibels)' },
    { value: 'Bq/m³', label: 'Bq/m³ (Becquerels per cubic meter)' },
    { value: 'pH', label: 'pH' }
  ];

  const createMutation = useMutation(
    (newPollutant) => endpoints.pollutants.create(newPollutant),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pollutants']);
        toast({ description: 'Pollutant added successfully' });
        setDialogOpen(false);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to add pollutant'
        });
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => endpoints.pollutants.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pollutants']);
        toast({ description: 'Pollutant updated successfully' });
        setDialogOpen(false);
        setEditingPollutant(null);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to update pollutant'
        });
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => endpoints.pollutants.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['pollutants']);
        toast({ description: 'Pollutant deleted successfully' });
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pollutantData = {
      name: formData.get('name'),
      category: formData.get('category'),
      unit: formData.get('unit'),
      benchmarkValue: parseFloat(formData.get('benchmarkValue')),
      benchmarkType: formData.get('benchmarkType'),
      description: formData.get('description')
    };

    if (editingPollutant) {
      updateMutation.mutate({ id: editingPollutant.id, data: pollutantData });
    } else {
      createMutation.mutate(pollutantData);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading pollutants data...</div>;
  }

  const totalPollutants = pollutants?.data?.length || 0;
  const activeMonitoring = pollutants?.data?.filter(p => p.monitoringStations?.length > 0)?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Pollutants Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPollutant(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Pollutant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPollutant ? 'Edit Pollutant' : 'Add New Pollutant'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Pollutant Name"
                defaultValue={editingPollutant?.name}
                required
              />

              <select
                name="category"
                className="w-full p-2 border rounded"
                defaultValue={editingPollutant?.category}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                name="unit"
                className="w-full p-2 border rounded"
                defaultValue={editingPollutant?.unit}
                required
              >
                <option value="">Select Unit</option>
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                ))}
              </select>

              <Input
                type="number"
                step="0.01"
                name="benchmarkValue"
                placeholder="Benchmark Value"
                defaultValue={editingPollutant?.benchmarkValue}
                required
              />

              <Input
                name="benchmarkType"
                placeholder="Benchmark Type (e.g., Maximum Daily, Annual Average)"
                defaultValue={editingPollutant?.benchmarkType}
                required
              />

              <Input
                name="description"
                placeholder="Description"
                defaultValue={editingPollutant?.description}
              />

              <Button type="submit" className="w-full">
                {editingPollutant ? 'Update' : 'Add'} Pollutant
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Pollutants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPollutants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{activeMonitoring}</div>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Benchmark</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Monitoring Stations</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pollutants?.data?.map(pollutant => (
            <TableRow key={pollutant.id}>
              <TableCell>{pollutant.name}</TableCell>
              <TableCell>{pollutant.category}</TableCell>
              <TableCell>{pollutant.unit}</TableCell>
              <TableCell>
                {pollutant.benchmarkValue} {pollutant.unit} ({pollutant.benchmarkType})
              </TableCell>
              <TableCell>{pollutant.description}</TableCell>
              <TableCell>
                {pollutant.monitoringStations?.length || 0} stations
              </TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingPollutant(pollutant);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this pollutant?')) {
                      deleteMutation.mutate(pollutant.id);
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