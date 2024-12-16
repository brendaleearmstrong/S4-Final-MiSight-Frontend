import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader'

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}))

describe('DashboardHeader', () => {
  test('renders header with title', () => {
    render(<DashboardHeader />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  test('handles logout', () => {
    const mockNavigate = vi.fn()
    vi.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate
    }))

    render(<DashboardHeader />)
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })
})