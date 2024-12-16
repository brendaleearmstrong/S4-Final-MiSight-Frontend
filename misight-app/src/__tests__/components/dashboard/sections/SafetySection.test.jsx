// src/__tests__/components/dashboard/sections/SafetySection.test.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafetySection } from '@/components/dashboard/sections/SafetySection'
import { endpoints } from '@/services/api'

vi.mock('@/services/api', () => ({
  endpoints: {
    safetyData: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    mines: {
      getAll: vi.fn()
    }
  }
}))

describe('SafetySection', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockMines = [
    { id: 1, name: 'Test Mine 1' },
    { id: 2, name: 'Test Mine 2' }
  ]

  const mockSafetyData = [
    {
      id: 1,
      dateRecorded: '2024-01-15',
      mine: { id: 1, name: 'Test Mine 1' },
      lostTimeIncidents: 0,
      nearMisses: 2,
      safetyLevel: 'GOOD'
    },
    {
      id: 2,
      dateRecorded: '2024-01-16',
      mine: { id: 2, name: 'Test Mine 2' },
      lostTimeIncidents: 1,
      nearMisses: 3,
      safetyLevel: 'FAIR'
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    endpoints.safetyData.getAll.mockResolvedValue(mockSafetyData)
    endpoints.mines.getAll.mockResolvedValue(mockMines)
  })

  test('renders safety data management interface', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SafetySection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Safety Data Management')).toBeInTheDocument()
      expect(screen.getByText('Add Safety Record')).toBeInTheDocument()
    })

    // Verify table headers
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Mine')).toBeInTheDocument()
    expect(screen.getByText('Lost Time Incidents')).toBeInTheDocument()
    expect(screen.getByText('Near Misses')).toBeInTheDocument()
    expect(screen.getByText('Safety Level')).toBeInTheDocument()
  })

  test('handles safety record creation', async () => {
    const newRecord = {
      dateRecorded: '2024-01-17',
      mine_id: '1',
      lostTimeIncidents: 0,
      nearMisses: 1,
      safetyLevel: 'EXCELLENT'
    }

    endpoints.safetyData.create.mockResolvedValueOnce({
      id: 3,
      ...newRecord,
      mine: mockMines[0]
    })

    render(
      <QueryClientProvider client={queryClient}>
        <SafetySection />
      </QueryClientProvider>
    )

    // Open modal
    fireEvent.click(screen.getByText('Add Safety Record'))

    // Fill form
    await waitFor(() => {
      expect(screen.getByLabelText('Mine')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Mine'), {
      target: { value: newRecord.mine_id }
    })
    fireEvent.change(screen.getByLabelText('Lost Time Incidents'), {
      target: { value: newRecord.lostTimeIncidents }
    })
    fireEvent.change(screen.getByLabelText('Near Misses'), {
      target: { value: newRecord.nearMisses }
    })
    fireEvent.change(screen.getByLabelText('Safety Level'), {
      target: { value: newRecord.safetyLevel }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(endpoints.safetyData.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mine_id: expect.any(Number),
          lostTimeIncidents: newRecord.lostTimeIncidents,
          nearMisses: newRecord.nearMisses,
          safetyLevel: newRecord.safetyLevel
        })
      )
    })
  })

  test('validates form fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SafetySection />
      </QueryClientProvider>
    )

    fireEvent.click(screen.getByText('Add Safety Record'))
    
    const createButton = await screen.findByRole('button', { name: /create/i })
    fireEvent.click(createButton)

    await waitFor(() => {
      // Check for required field validations
      expect(screen.getAllByText(/required/i)).toHaveLength(4)
    })
  })

  test('handles record deletion', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SafetySection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Mine 1')).toBeInTheDocument()
    })

    // Mock confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true)

    // Find and click delete button
    const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0]
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(endpoints.safetyData.delete).toHaveBeenCalledWith(mockSafetyData[0].id)
    })
  })

  test('displays safety levels correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SafetySection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('GOOD')).toBeInTheDocument()
      expect(screen.getByText('FAIR')).toBeInTheDocument()
    })
  })

  test('handles API errors gracefully', async () => {
    endpoints.safetyData.getAll.mockRejectedValueOnce(new Error('API Error'))

    render(
      <QueryClientProvider client={queryClient}>
        <SafetySection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Safety Data Management')).toBeInTheDocument()
    })
  })

  test('updates existing safety record', async () => {
    const updatedRecord = {
      ...mockSafetyData[0],
      lostTimeIncidents: 1,
      safetyLevel: 'FAIR'
    }

    endpoints.safetyData.update.mockResolvedValueOnce(updatedRecord)

    render(
      <QueryClientProvider client={queryClient}>
        <SafetySection />
      </QueryClientProvider>
    )

    // Wait for data to load and click edit
    await waitFor(() => {
      expect(screen.getByText('Test Mine 1')).toBeInTheDocument()
    })

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0]
    fireEvent.click(editButton)

    // Update form fields
    fireEvent.change(screen.getByLabelText('Lost Time Incidents'), {
      target: { value: updatedRecord.lostTimeIncidents }
    })
    fireEvent.change(screen.getByLabelText('Safety Level'), {
      target: { value: updatedRecord.safetyLevel }
    })

    // Submit updates
    fireEvent.click(screen.getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(endpoints.safetyData.update).toHaveBeenCalledWith(
        mockSafetyData[0].id,
        expect.objectContaining({
          lostTimeIncidents: updatedRecord.lostTimeIncidents,
          safetyLevel: updatedRecord.safetyLevel
        })
      )
    })
  })
})