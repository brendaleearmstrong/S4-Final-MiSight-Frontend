import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserDashboard from '../../pages/UserDashboard';
import { AuthProvider } from '../../../contexts/AuthContext';

const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          {children}
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('UserDashboard', () => {
  test('renders main dashboard elements', () => {
    render(
      <TestWrapper>
        <UserDashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Community Portal')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Environmental Data')).toBeInTheDocument();
    expect(screen.getByText('Safety Reports')).toBeInTheDocument();
  });

  test('navigation works between tabs', () => {
    render(
      <TestWrapper>
        <UserDashboard />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Environmental Data'));
    expect(screen.getByText(/Environmental/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Safety Reports'));
    expect(screen.getByText(/Safety/i)).toBeInTheDocument();
  });

  test('logout button functions correctly', () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', () => ({
      ...vi.importActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <TestWrapper>
        <UserDashboard />
      </TestWrapper>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('renders key metrics section', () => {
    render(
      <TestWrapper>
        <UserDashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Air Quality Index')).toBeInTheDocument();
    expect(screen.getByText('Safety Score')).toBeInTheDocument();
    expect(screen.getByText('Community Projects')).toBeInTheDocument();
  });

  test('renders weather section', () => {
    render(
      <TestWrapper>
        <UserDashboard />
      </TestWrapper>
    );

    expect(screen.getByText('5-Day Weather')).toBeInTheDocument();
    const weatherElements = screen.getAllByText(/°C/);
    expect(weatherElements.length).toBeGreaterThan(0);
  });
});