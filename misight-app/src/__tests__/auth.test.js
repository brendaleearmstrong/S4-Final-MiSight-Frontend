// src/__tests__/auth.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Signup from '../pages/Signup';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock fetch
window.fetch = vi.fn();

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    fetch.mockClear();
  });

  test('renders signup form correctly', () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('validates password match', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Fill form with non-matching passwords
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('handles demo admin login correctly', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Fill form with admin demo credentials
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'admin123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'admin123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      // Check if user was stored in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser).toEqual({
        username: 'admin',
        role: 'ADMIN'
      });
      // Check navigation
      expect(mockNavigate).toHaveBeenCalledWith('/AdminDashboard');
    });
  });

  test('handles demo mine admin login correctly', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Fill form with mine admin demo credentials
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'mine' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'mine123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'mine123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser).toEqual({
        username: 'mine',
        role: 'MINE_ADMIN'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/MineAdminDashboard');
    });
  });

  test('handles demo user login correctly', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Fill form with user demo credentials
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'user' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'user123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'user123' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      expect(storedUser).toEqual({
        username: 'user',
        role: 'USER'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/UserDashboard');
    });
  });

  test('handles signup error', async () => {
    // Mock fetch for failed signup
    window.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Failed to create account')
      })
    );

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Fill form with non-demo account
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'newuser' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to create account')).toBeInTheDocument();
    });
  });

  test('disables submit button while loading', async () => {
    // Mock fetch with delay for non-demo account
    window.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ 
        ok: true,
        json: () => Promise.resolve({})
      }), 100))
    );

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'newuser' }
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Button should be disabled and show loading state
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
  });
});