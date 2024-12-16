import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import AdminDashboard from '../../pages/AdminDashboard';

const queryClient = new QueryClient({
 defaultOptions: {
   queries: {
     retry: false,
   },
 },
});

const MockAdminDashboard = () => {
 return (
   <QueryClientProvider client={queryClient}>
     <BrowserRouter>
       <AdminDashboard />
     </BrowserRouter>
   </QueryClientProvider>
 );
};

describe('AdminDashboard', () => {
 test('renders loading spinner initially', () => {
   render(<MockAdminDashboard />);
   expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
 });

 test('renders sidebar navigation items', async () => {
   render(<MockAdminDashboard />);
   const sidebarItems = await screen.findAllByRole('button');
   expect(sidebarItems).toHaveLength(7);
   expect(screen.getByText('Users')).toBeInTheDocument();
   expect(screen.getByText('Mines')).toBeInTheDocument();
   expect(screen.getByText('Minerals')).toBeInTheDocument();
 });

 test('renders header content', () => {
   render(<MockAdminDashboard />);
   expect(screen.getByText('Administrator Dashboard')).toBeInTheDocument();
 });

 test('handles logout', () => {
   const mockNavigate = vi.fn();
   vi.mock('react-router-dom', () => ({
     ...vi.importActual('react-router-dom'),
     useNavigate: () => mockNavigate
   }));

   render(<MockAdminDashboard />);
   const logoutButton = screen.getByText('Logout');
   fireEvent.click(logoutButton);
   
   expect(mockNavigate).toHaveBeenCalledWith('/login');
   expect(localStorage.getItem('user')).toBeNull();
 });

 test('switches content based on active tab', async () => {
   render(<MockAdminDashboard />);
   
   const usersTab = await screen.findByText('Users');
   fireEvent.click(usersTab);
   expect(screen.getByText('Users Management')).toBeInTheDocument();

   const minesTab = screen.getByText('Mines');
   fireEvent.click(minesTab);
   expect(screen.getByText('Mines Management')).toBeInTheDocument();
 });
});
