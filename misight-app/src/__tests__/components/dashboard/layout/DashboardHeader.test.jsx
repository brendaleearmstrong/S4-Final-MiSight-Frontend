import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('DashboardHeader', () => {
  test('renders header with logout button', () => {
    render(
      <BrowserRouter>
        <DashboardHeader />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('handles logout when clicked', () => {
    const mockOnLogout = vi.fn();
    
    render(
      <BrowserRouter>
        <DashboardHeader onLogout={mockOnLogout} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(mockOnLogout).toHaveBeenCalled();
  });
});