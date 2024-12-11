
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { endpoints } from '@/api/apiClient';

export default function MinesManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMine, setEditingMine] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mines, isLoading } = useQuery(['mines'], () => endpoints.mines.getAll());
  const { data: provinces } = useQuery(['provinces'], () => endpoints.provinces.getAll());

  const createMutation = useMutation(
    (newMine) => endpoints.mines.create(newMine),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['mines']);
        toast({ description: 'Mine created successfully' });
        setDialogOpen(false);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to create mine'
        });
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }) => endpoints.mines.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['mines']);
        toast({ description: 'Mine updated successfully' });
        setDialogOpen(false);
        setEditingMine(null);
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to update mine'
        });
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => endpoints.mines.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['mines']);
        toast({ description: 'Mine deleted successfully' });
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          description: error.response?.data?.message || 'Failed to delete mine'
        });
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const mineData = {
      name: formData.get('name'),
      location: formData.get('location'),
      company: formData.get('company'),
      province: { id: parseInt(formData.get('provinceId')) }
    };

    if (editingMine) {
      updateMutation.mutate({ id: editingMine.id, data: mineData });
    } else {
      createMutation.mutate(mineData);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading mines data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Mines Management</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMine(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Mine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMine ? 'Edit Mine' : 'Add New Mine'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Mine Name"
                defaultValue={editingMine?.name}
                required
              />
              <Input
                name="location"
                placeholder="Location"
                defaultValue={editingMine?.location}
                required
              />
              <Input
                name="company"
                placeholder="Company"
                defaultValue={editingMine?.company}
                required
              />
              <select
                name="provinceId"
                className="w-full p-2 border rounded"
                defaultValue={editingMine?.province?.id}
                required
              >
                <option value="">Select Province</option>
                {provinces?.data?.map(province => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              <Button type="submit" className="w-full">
                {editingMine ? 'Update' : 'Create'} Mine
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Province</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mines?.data?.map(mine => (
            <TableRow key={mine.id}>
              <TableCell>{mine.name}</TableCell>
              <TableCell>{mine.location}</TableCell>
              <TableCell>{mine.company}</TableCell>
              <TableCell>{mine.province.name}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingMine(mine);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this mine?')) {
                      deleteMutation.mutate(mine.id);
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