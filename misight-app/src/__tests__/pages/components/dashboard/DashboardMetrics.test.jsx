import { DashboardMetrics } from '../../../components/dashboard/DashboardMetrics';

describe('DashboardMetrics', () => {
 const mockData = {
   users: [{ id: 1, name: 'Test User' }],
   mines: [{ id: 1, name: 'Test Mine' }],
   minerals: [{ id: 1, name: 'Iron' }],
   stations: [{ id: 1, name: 'Station 1' }]
 };

 test('renders all metric cards', () => {
   render(<DashboardMetrics data={mockData} />);
   expect(screen.getByText('Total Users')).toBeInTheDocument();
   expect(screen.getByText('Active Mines')).toBeInTheDocument();
   expect(screen.getByText('Mineral Types')).toBeInTheDocument();
   expect(screen.getByText('Monitoring Stations')).toBeInTheDocument();
 });

 test('displays correct counts', () => {
   render(<DashboardMetrics data={mockData} />);
   expect(screen.getByText('1')).toBeInTheDocument();
 });
});
