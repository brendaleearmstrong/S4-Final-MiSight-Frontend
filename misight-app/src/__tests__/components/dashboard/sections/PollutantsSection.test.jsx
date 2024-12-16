import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PollutantsSection } from '@/components/dashboard/sections/PollutantsSection'
import { endpoints } from '@/services/api'

vi.mock('@/services/api', () => ({
  endpoints: {
    pollutants: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

describe('PollutantsSection', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockPollutants = [
    {
      id: 1,
      name: 'PM2.5',
      category: 'AIR',
      unit: 'μg/m³',
      benchmarkValue: 25,
      benchmarkType: 'MAXIMUM'
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    endpoints.pollutants.getAll.mockResolvedValue(mockPollutants)
  })

  test('renders pollutants table', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PollutantsSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('PM2.5')).toBeInTheDocument()
      expect(screen.getByText('AIR')).toBeInTheDocument()
    })
  })

  test('validates form inputs', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PollutantsSection />
      </QueryClientProvider>
    )

    const addButton = await screen.findByText('Add Pollutant')
    fireEvent.click(addButton)

    const submitButton = screen.getByRole('button', { name: /create/i })
    fireEvent.click(submitButton)

    // Should show validation messages
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })
})