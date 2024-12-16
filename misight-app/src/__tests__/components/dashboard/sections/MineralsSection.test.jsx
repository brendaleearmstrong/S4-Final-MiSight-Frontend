import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MineralsSection } from '@/components/dashboard/sections/MineralsSection'
import { endpoints } from '@/services/api'

vi.mock('@/services/api', () => ({
  endpoints: {
    minerals: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  }
}))

describe('MineralsSection', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockMinerals = [
    { id: 1, name: 'Iron', type: 'METAL', mines: [] }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    endpoints.minerals.getAll.mockResolvedValue(mockMinerals)
  })

  test('renders minerals table with data', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineralsSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Minerals Management')).toBeInTheDocument()
      expect(screen.getByText('Iron')).toBeInTheDocument()
    })
  })

  test('opens modal for adding new mineral', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineralsSection />
      </QueryClientProvider>
    )

    const addButton = await screen.findByText('Add Mineral')
    fireEvent.click(addButton)

    expect(screen.getByText('Mineral Name')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
  })

  test('handles mineral creation', async () => {
    endpoints.minerals.create.mockResolvedValue({ id: 2, name: 'Gold', type: 'PRECIOUS' })

    render(
      <QueryClientProvider client={queryClient}>
        <MineralsSection />
      </QueryClientProvider>
    )

    const addButton = await screen.findByText('Add Mineral')
    fireEvent.click(addButton)

    const nameInput = screen.getByLabelText('Mineral Name')
    const typeSelect = screen.getByLabelText('Type')
    
    fireEvent.change(nameInput, { target: { value: 'Gold' } })
    fireEvent.change(typeSelect, { target: { value: 'PRECIOUS' } })

    const submitButton = screen.getByRole('button', { name: /create/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(endpoints.minerals.create).toHaveBeenCalled()
    })
  })
})