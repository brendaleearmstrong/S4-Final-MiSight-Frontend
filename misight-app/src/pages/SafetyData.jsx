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
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { endpoints } from '@/api/apiClient';

export default function SafetyData() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: safetyData, isLoading } = useQuery(
    ['safety-data'], 
    () => endpoints.safety.getAll()
  );
  
  const { data: mines } = useQuery(['mines'], () => endpoints.mines.getAll());

  const createMutation = useMutation(
    (newData) => endpoints.safety.create(newData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['safety-data']);
        toast({ description: 'Safety report recorded successfully' });
        setDialogOpen(false);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to record report'
        });
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => endpoints.safety.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['safety-data']);
        toast({ description: 'Safety report updated successfully' });
        setDialogOpen(false);
        setEditingData(null);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to update report'
        });
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => endpoints.safety.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['safety-data']);
        toast({ description: 'Safety report deleted successfully' });
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const safetyDataPayload = {
      mine: { id: parseInt(formData.get('mineId')) },
      dateRecorded: formData.get('dateRecorded'),
      lostTimeIncidents: parseInt(formData.get('lostTimeIncidents')),
      nearMisses: parseInt(formData.get('nearMisses')),
      safetyLevel: formData.get('safetyLevel'),
      description: formData.get('description')
    };

    if (editingData) {
      updateMutation.mutate({ id: editingData.id, data: safetyDataPayload });
    } else {
      createMutation.mutate(safetyDataPayload);
    }
  };

  const getSafetyLevelColor = (level) => {
    switch (level) {
      case 'EXCELLENT': return 'bg-green-100 text-green-800';
      case 'GOOD': return 'bg-blue-100 text-blue-800';
      case 'FAIR': return 'bg-yellow-100 text-yellow-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading safety data...</div>;
  }

  const totalIncidents = safetyData?.data?.reduce((acc, curr) => acc + curr.lostTimeIncidents, 0) || 0;
  const totalNearMisses = safetyData?.data?.reduce((acc, curr) => acc + curr.nearMisses, 0) || 0;
  const criticalReports = safetyData?.data?.filter(d => d.safetyLevel === 'CRITICAL')?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Safety Reports</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingData(null)}>
              <Plus className="w-4 h-4 mr-2" />
              New Safety Report
            </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingData ? 'Edit Safety Report' : 'New Safety Report'}
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
  
                <Input
                  type="date"
                  name="dateRecorded"
                  defaultValue={editingData?.dateRecorded || new Date().toISOString().split('T')[0]}
                  required
                />
  
                <Input
                  type="number"
                  name="lostTimeIncidents"
                  placeholder="Lost Time Incidents"
                  defaultValue={editingData?.lostTimeIncidents}
                  min="0"
                  required
                />
  
                <Input
                  type="number"
                  name="nearMisses"
                  placeholder="Near Misses"
                  defaultValue={editingData?.nearMisses}
                  min="0"
                  required
                />
  
                <select
                  name="safetyLevel"
                  className="w-full p-2 border rounded"
                  defaultValue={editingData?.safetyLevel}
                  required
                >
                  <option value="">Select Safety Level</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="CRITICAL">Critical</option>
                </select>
  
                <Input
                  name="description"
                  placeholder="Description"
                  defaultValue={editingData?.description}
                />
  
                <Button type="submit" className="w-full">
                  {editingData ? 'Update' : 'Create'} Report
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {safetyData?.data?.length || 0}
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Lost Time Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">
                {totalIncidents}
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Near Misses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {totalNearMisses}
              </div>
            </CardContent>
          </Card>
  
          <Card>
            <CardHeader>
              <CardTitle>Critical Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {criticalReports}
              </div>
            </CardContent>
          </Card>
        </div>
  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Mine</TableHead>
              <TableHead>Lost Time Incidents</TableHead>
              <TableHead>Near Misses</TableHead>
              <TableHead>Safety Level</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safetyData?.data?.map(data => (
              <TableRow key={data.id}>
                <TableCell>{new Date(data.dateRecorded).toLocaleDateString()}</TableCell>
                <TableCell>{data.mine.name}</TableCell>
                <TableCell>{data.lostTimeIncidents}</TableCell>
                <TableCell>{data.nearMisses}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSafetyLevelColor(data.safetyLevel)}`}>
                    {data.safetyLevel}
                    {data.safetyLevel === 'CRITICAL' && (
                      <AlertTriangle className="ml-1 w-4 h-4" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{data.description}</TableCell>
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
                      if (window.confirm('Are you sure you want to delete this report?')) {
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