import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardSidebar } from '@/components/dashboard/layout/DashboardSidebar'

describe('DashboardSidebar', () => {
  const mockOnTabChange = vi.fn()

  test('renders navigation items', () => {
    render(
      <DashboardSidebar 
        activeTab="overview"
        onTabChange={mockOnTabChange}
      />
    )
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  test('handles tab changes', () => {
    render(
      <DashboardSidebar 
        activeTab="overview"
        onTabChange={mockOnTabChange}
      />
    )
    const usersTab = screen.getByText('Users')
    fireEvent.click(usersTab)
    expect(mockOnTabChange).toHaveBeenCalledWith('users')
  })
})