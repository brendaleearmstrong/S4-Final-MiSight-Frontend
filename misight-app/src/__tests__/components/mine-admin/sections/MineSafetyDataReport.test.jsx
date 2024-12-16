import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MineSafetyDataReport } from '@/components/mine-admin/sections/MineSafetyDataReport'
import { api, SCULLY_MINE } from '@/services/api'

vi.mock('@/services/api', () => ({
  api: {
    endpoints: {
      safetyData: {
        getByMineAndDateRange: vi.fn(),
        exportByMine: vi.fn()
      }
    }
  },
  SCULLY_MINE: { id: 1 }
}))

describe('MineSafetyDataReport', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockSafetyData = [
    {
      id: 1,
      dateRecorded: '2024-01-15',
      lostTimeIncidents: 2,
      nearMisses: 4,
      safetyLevel: 'FAIR'
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    api.endpoints.safetyData.getByMineAndDateRange.mockResolvedValue(mockSafetyData)
  })

  test('renders safety metrics correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineSafetyDataReport />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Lost Time Incidents')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  test('handles date range changes', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineSafetyDataReport />
      </QueryClientProvider>
    )

    const dateInputs = screen.getAllByRole('textbox')
    fireEvent.change(dateInputs[0], { target: { value: '2024-01-01' } })

    await waitFor(() => {
      expect(api.endpoints.safetyData.getByMineAndDateRange).toHaveBeenCalled()
    })
  })
})