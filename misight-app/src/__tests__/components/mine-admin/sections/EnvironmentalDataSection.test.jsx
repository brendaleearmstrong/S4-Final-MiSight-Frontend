import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EnvironmentalDataSection } from '@/components/mine-admin/sections/EnvironmentalDataSection'
import { api } from '@/services/api'

vi.mock('@/services/api', () => ({
  api: {
    endpoints: {
      environmentalData: {
        getByMine: vi.fn(),
        create: vi.fn()
      },
      pollutants: {
        getAll: vi.fn()
      }
    }
  },
  SCULLY_MINE: { id: 1 }
}))

describe('EnvironmentalDataSection', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockEnvironmentalData = [
    {
      id: 1,
      measurementDate: '2024-12-01T00:00:00',
      measuredValue: 45,
      pollutant: { name: 'PM10', unit: 'μg/m³', benchmarkValue: 50 },
      monitoringStation: { name: 'North Station' }
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    api.endpoints.environmentalData.getByMine.mockResolvedValue(mockEnvironmentalData)
  })

  test('renders environmental data table and charts', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EnvironmentalDataSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Environmental Monitoring')).toBeInTheDocument()
      expect(screen.getByText('PM10')).toBeInTheDocument()
      expect(screen.getByText('North Station')).toBeInTheDocument()
    })
  })

  test('calculates and displays statistics correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EnvironmentalDataSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('45')).toBeInTheDocument() // measured value
      expect(screen.getByText('Total Reports')).toBeInTheDocument()
    })
  })
})