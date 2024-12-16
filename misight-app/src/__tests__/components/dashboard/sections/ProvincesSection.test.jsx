import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProvincesSection } from '@/components/dashboard/sections/ProvincesSection'
import axios from 'axios'

vi.mock('axios')

describe('ProvincesSection', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  const mockProvinces = [
    {
      id: 1,
      name: 'Test Province',
      abbreviation: 'TP',
      mines: [
        { id: 1, name: 'Test Mine 1' },
        { id: 2, name: 'Test Mine 2' }
      ]
    }
  ]

  beforeEach(() => {
    vi.resetAllMocks()
    axios.get.mockImplementation((url) => {
      if (url.includes('/provinces')) {
        return Promise.resolve({ data: mockProvinces })
      }
      if (url.includes('/mines')) {
        return Promise.resolve({ data: mockProvinces[0].mines })
      }
      return Promise.reject(new Error('Not found'))
    })
  })

  test('renders provinces table and statistics', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProvincesSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Province')).toBeInTheDocument()
      expect(screen.getByText('2 mines')).toBeInTheDocument()
    })

    // Check statistics
    expect(screen.getByText('Total Provinces')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('handles province creation', async () => {
    axios.post.mockResolvedValueOnce({ 
      data: { id: 2, name: 'New Province', abbreviation: 'NP' }
    })

    render(
      <QueryClientProvider client={queryClient}>
        <ProvincesSection />
      </QueryClientProvider>
    )

    // Click add button
    fireEvent.click(screen.getByText('Add Province'))

    // Fill form
    fireEvent.change(screen.getByLabelText('Province Name'), {
      target: { value: 'New Province' }
    })
    fireEvent.change(screen.getByLabelText('Province Code'), {
      target: { value: 'NP' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create/i }))

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/provinces'),
        expect.objectContaining({
          name: 'New Province',
          abbreviation: 'NP'
        })
      )
    })
  })

  test('handles province deletion with confirmation', async () => {
    axios.delete.mockResolvedValueOnce({})

    render(
      <QueryClientProvider client={queryClient}>
        <ProvincesSection />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Province')).toBeInTheDocument()
    })

    // Mock window.confirm
    const mockConfirm = vi.spyOn(window, 'confirm')
    mockConfirm.mockImplementation(() => true)

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/provinces/1')
      )
    })

    mockConfirm.mockRestore()
  })
})
