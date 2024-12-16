import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from '../../pages/Signup';

describe('Signup Page', () => {
  test('renders the signup form', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('validates input fields and submits the form', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const roleSelect = screen.getByLabelText(/role/i);
    const signupButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(roleSelect, { target: { value: 'USER' } });
    fireEvent.click(signupButton);

    expect(screen.getByLabelText(/username/i).value).toBe('testuser');
    expect(screen.getByLabelText(/password/i).value).toBe('password123');
    expect(screen.getByLabelText(/confirm password/i).value).toBe('password123');
    expect(screen.getByLabelText(/role/i).value).toBe('USER');
  });
});
