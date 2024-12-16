import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithProviders(ui, {
  preloadedState = {},
  route = '/',
  ...renderOptions
} = {}) {
  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  window.history.pushState({}, 'Test page', route);

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  };
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock Local Storage
export const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock Navigation
export const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));
