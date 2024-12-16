// src/__tests__/pages/Signup.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../../pages/Signup';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock axios
vi.mock('axios', () => ({
    default: {
        post: vi.fn(() => Promise.resolve({ status: 201 }))
    }
}));

describe('Signup Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const renderSignup = () => {
        return render(
            <BrowserRouter>
                <Signup />
            </BrowserRouter>
        );
    };

    it('renders signup form', () => {
        renderSignup();
        
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('shows error when passwords do not match', async () => {
        renderSignup();
        
        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
        await userEvent.type(screen.getByLabelText(/confirm password/i), 'different');
        await userEvent.click(screen.getByRole('button', { name: /create account/i }));

        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('handles demo admin login', async () => {
        renderSignup();

        await userEvent.type(screen.getByLabelText(/username/i), 'admin');
        await userEvent.type(screen.getByLabelText(/^password$/i), 'admin123');
        await userEvent.type(screen.getByLabelText(/confirm password/i), 'admin123');
        await userEvent.click(screen.getByRole('button', { name: /create account/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/pages/AdminDashboard');
        expect(localStorage.getItem('user')).toBeTruthy();
        const storedUser = JSON.parse(localStorage.getItem('user'));
        expect(storedUser.role).toBe('ADMIN');
    });

    it('handles regular user signup', async () => {
        renderSignup();

        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
        await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
        await userEvent.click(screen.getByRole('button', { name: /create account/i }));

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('shows loading state during signup', async () => {
        renderSignup();

        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
        await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
        
        const submitButton = screen.getByRole('button', { name: /create account/i });
        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
        expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    });

    it('handles signup error', async () => {
        vi.mocked(axios.post).mockRejectedValueOnce(new Error('Signup failed'));
        
        renderSignup();

        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
        await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
        await userEvent.click(screen.getByRole('button', { name: /create account/i }));

        expect(await screen.findByText(/Failed to create account/i)).toBeInTheDocument();
    });
});