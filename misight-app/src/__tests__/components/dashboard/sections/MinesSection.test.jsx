// src/__tests__/components/dashboard/sections/MinesSection.test.jsx
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MinesSection } from '@/components/dashboard/sections/MinesSection'
import { endpoints } from '@/services/api'

vi.mock('@/services/api', () => ({
  endpoints: {
    mines: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    provinces: {
      getAll: vi.fn()
    },
    minerals: {
      getAll: vi.fn()
    }
  }
}))

describe('MinesSection', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockMines = [
    {
      id: 1,
      name: 'Test Mine',
      location: 'Test Location',
      company: 'Test Company',
      province: { id: 1, name: 'Test Province' },
      minerals: [{ id: 1, name: 'Iron' }]
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    endpoints.mines.getAll.mockResolvedValue(mockMines)
    endpoints.provinces.getAll.mockResolvedValue([{ id: 1, name: 'Test Province' }])
    endpoints.minerals.getAll.mockResolvedValue([{ id: 1, name: 'Iron' }])
  })

  test('renders mines table with data', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MinesSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Mine')).toBeInTheDocument()
      expect(screen.getByText('Test Company')).toBeInTheDocument()
    })
  })

  test('handles mine creation', async () => {
    const newMine = {
      name: 'New Mine',
      location: 'New Location',
      company: 'New Company',
      province_id: '1',
      mineral_ids: ['1']
    }

    endpoints.mines.create.mockResolvedValue({ id: 2, ...newMine })

    render(
      <QueryClientProvider client={queryClient}>
        <MinesSection />
      </QueryClientProvider>
    )

    const addButton = await screen.findByText('Add Mine')
    fireEvent.click(addButton)

    // Fill form
    fireEvent.change(screen.getByLabelText('Mine Name'), { 
      target: { value: newMine.name } 
    })
    fireEvent.change(screen.getByLabelText('Location'), { 
      target: { value: newMine.location } 
    })
    fireEvent.change(screen.getByLabelText('Company'), { 
      target: { value: newMine.company } 
    })

    const submitButton = screen.getByRole('button', { name: /create/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(endpoints.mines.create).toHaveBeenCalled()
    })
  })
})
