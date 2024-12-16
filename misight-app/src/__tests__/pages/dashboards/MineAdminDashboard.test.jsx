import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MineAdminDashboard from '@/pages/dashboards/MineAdminDashboard'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

describe('MineAdminDashboard', () => {
  test('renders navigation tabs', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MineAdminDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    )
    expect(screen.getByText('Mine Overview')).toBeInTheDocument()
    expect(screen.getByText('Environmental Reports')).toBeInTheDocument()
    expect(screen.getByText('Safety Reports')).toBeInTheDocument()
  })

  test('switches content based on tab selection', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MineAdminDashboard />
        </BrowserRouter>
      </QueryClientProvider>
    )
    
    const envTab = screen.getByText('Environmental Reports')
    fireEvent.click(envTab)
    expect(screen.getByText('Environmental Monitoring')).toBeInTheDocument()
  })
})
