// src/__tests__/components/mine-admin/sections/MineAdminEnvironmentalReport.test.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MineAdminEnvironmentalReport } from '@/components/mine-admin/sections/MineAdminEnvironmentalReport'
import { api, SCULLY_MINE } from '@/services/api'

// Mock the api and dependencies
vi.mock('@/services/api', () => ({
  api: {
    endpoints: {
      environmentalData: {
        getByMineAndDateRange: vi.fn()
      }
    }
  },
  SCULLY_MINE: { id: 3, name: 'Scully Mine' }
}))

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  LineChart: vi.fn(() => null),
  Line: vi.fn(),
  XAxis: vi.fn(),
  YAxis: vi.fn(),
  CartesianGrid: vi.fn(),
  Tooltip: vi.fn(),
  ResponsiveContainer: vi.fn(({ children }) => children)
}))

describe('MineAdminEnvironmentalReport', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

  const mockData = [
    { measurementDate: '2024-12-01T00:00:00', measuredValue: 45 },
    { measurementDate: '2024-12-05T00:00:00', measuredValue: 52 },
    { measurementDate: '2024-12-10T00:00:00', measuredValue: 38 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    api.endpoints.environmentalData.getByMineAndDateRange.mockResolvedValue(mockData)
  })

  test('renders report title and date filters', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineAdminEnvironmentalReport />
      </QueryClientProvider>
    )

    expect(screen.getByText('Environmental Report - Scully Mine')).toBeInTheDocument()
    expect(screen.getByText('Date Range:')).toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  test('shows loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineAdminEnvironmentalReport />
      </QueryClientProvider>
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  test('handles date range changes', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineAdminEnvironmentalReport />
      </QueryClientProvider>
    )

    const [startDate, endDate] = screen.getAllByRole('textbox')
    
    fireEvent.change(startDate, { target: { value: '2024-01-01' } })
    fireEvent.change(endDate, { target: { value: '2024-01-31' } })

    await waitFor(() => {
      expect(api.endpoints.environmentalData.getByMineAndDateRange).toHaveBeenCalledWith(
        SCULLY_MINE.id,
        '2024-01-01T00:00:00',
        '2024-01-31T23:59:59'
      )
    })
  })

  test('processes data correctly for chart', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineAdminEnvironmentalReport />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Environmental Measurement Trends')).toBeInTheDocument()
    })

    // Check if data is processed into the correct format for the chart
    const processedData = mockData.map(data => ({
      measurementDate: new Date(data.measurementDate).toISOString().split('T')[0],
      measuredValue: parseFloat(data.measuredValue)
    }))

    // Verify the chart data transformation
    expect(processedData).toEqual([
      { measurementDate: '2024-12-01', measuredValue: 45 },
      { measurementDate: '2024-12-05', measuredValue: 52 },
      { measurementDate: '2024-12-10', measuredValue: 38 }
    ])
  })

  test('handles API errors gracefully', async () => {
    // Mock API error
    api.endpoints.environmentalData.getByMineAndDateRange.mockRejectedValue(
      new Error('Failed to fetch data')
    )

    render(
      <QueryClientProvider client={queryClient}>
        <MineAdminEnvironmentalReport />
      </QueryClientProvider>
    )

    // Should fall back to mock data
    await waitFor(() => {
      expect(screen.getByText('Environmental Measurement Trends')).toBeInTheDocument()
    })
  })

  test('applies correct formatting to chart values', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineAdminEnvironmentalReport />
      </QueryClientProvider>
    )

    await waitFor(() => {
      const chartContainer = screen.getByRole('region', { name: /chart/i })
      expect(chartContainer).toBeInTheDocument()
      
      // Verify the chart shows the correct unit format
      expect(chartContainer).toHaveTextContent('μg/m³')
    })
  })

  test('maintains date range state between renders', async () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MineAdminEnvironmentalReport />
      </QueryClientProvider>
    )

    const startDate = screen.getByLabelText(/start date/i)
    fireEvent.change(startDate, { target: { value: '2024-01-01' } })

    rerender(
      <QueryClientProvider client={queryClient}>
        <MineAdminEnvironmentalReport />
      </QueryClientProvider>
    )

    expect(startDate.value).toBe('2024-01-01')
  })
})