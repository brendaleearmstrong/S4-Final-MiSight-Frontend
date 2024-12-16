import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserDashboard from '../../src/pages/dashboards/UserDashboard';
import { AuthProvider } from '../../src/contexts/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('UserDashboard Component', () => {
  const renderDashboard = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserDashboard />
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it('renders dashboard with key metrics', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Air Quality Index')).toBeInTheDocument();
      expect(screen.getByText('Safety Score')).toBeInTheDocument();
      expect(screen.getByText('Community Projects')).toBeInTheDocument();
    });
  });

  it('displays environmental data chart', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Iron Ore Production')).toBeInTheDocument();
      expect(screen.getByText('Air Quality Trends')).toBeInTheDocument();
    });
  });
});