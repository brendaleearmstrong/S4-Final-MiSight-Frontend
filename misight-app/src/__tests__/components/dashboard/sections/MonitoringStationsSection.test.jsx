

// src/__tests__/components/dashboard/sections/MonitoringStationsSection.test.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MonitoringStationsSection } from '@/components/dashboard/sections/MonitoringStationsSection'
import { endpoints } from '@/services/api'

vi.mock('@/services/api', () => ({
  endpoints: {
    monitoringStations: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    provinces: {
      getAll: vi.fn()
    }
  }
}))

describe('MonitoringStationsSection', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockStations = [
    {
      id: 1,
      name: 'Test Station',
      location: 'Test Location',
      province: { id: 1, name: 'Test Province' }
    }
  ]

  const mockProvinces = [
    { id: 1, name: 'Test Province' }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    endpoints.monitoringStations.getAll.mockResolvedValue(mockStations)
    endpoints.provinces.getAll.mockResolvedValue(mockProvinces)
  })

  test('renders monitoring stations table', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MonitoringStationsSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Station')).toBeInTheDocument()
      expect(screen.getByText('Test Location')).toBeInTheDocument()
    })
  })

  test('handles station creation', async () => {
    const newStation = {
      name: 'New Station',
      location: 'New Location',
      province_id: '1'
    }

    endpoints.monitoringStations.create.mockResolvedValue({
      id: 2,
      name: newStation.name,
      location: newStation.location,
      province: mockProvinces[0]
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MonitoringStationsSection />
      </QueryClientProvider>
    )

    const addButton = await screen.findByText('Add Station')
    fireEvent.click(addButton)

    const nameInput = screen.getByLabelText('Station Name')
    const locationInput = screen.getByLabelText('Location')
    
    fireEvent.change(nameInput, { target: { value: newStation.name } })
    fireEvent.change(locationInput, { target: { value: newStation.location } })

    const submitButton = screen.getByRole('button', { name: /create/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(endpoints.monitoringStations.create).toHaveBeenCalled()
    })
  })
})
