import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NoticesCard } from '@/components/dashboard/NoticesCard'

describe('NoticesCard', () => {
  const mockNotices = [
    {
      id: 1,
      title: 'Test Notice',
      message: 'Test Message',
      date: '2024-01-01'
    }
  ]

  test('renders notice items', () => {
    render(<NoticesCard notices={mockNotices} />)
    expect(screen.getByText('Test Notice')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })
})