import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MineOverviewSection } from '@/components/mine-admin/sections/MineOverviewSection'

const queryClient = new QueryClient()

describe('MineOverviewSection', () => {
  const mockData = {
    mineData: {
      name: 'Test Mine',
      location: 'Test Location',
      company: 'Test Company'
    },
    environmentalData: [],
    safetyData: [],
    minerals: []
  }

  test('renders mine information', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineOverviewSection mockData={mockData} />
      </QueryClientProvider>
    )
    expect(screen.getByText('Test Mine')).toBeInTheDocument()
    expect(screen.getByText('Test Location')).toBeInTheDocument()
    expect(screen.getByText('Test Company')).toBeInTheDocument()
  })

  test('renders statistics cards', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MineOverviewSection mockData={mockData} />
      </QueryClientProvider>
    )
    expect(screen.getByText('Lost Time Incidents')).toBeInTheDocument()
    expect(screen.getByText('Environmental Alerts')).toBeInTheDocument()
  })
})