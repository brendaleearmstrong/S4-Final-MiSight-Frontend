import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ManagementModal } from '@/components/dashboard/ManagementModal'

describe('ManagementModal', () => {
  const mockProps = {
    title: 'Test Modal',
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    fields: [
      { name: 'testField', label: 'Test Field', type: 'text' }
    ]
  }

  test('renders modal when open', () => {
    render(<ManagementModal {...mockProps} />)
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  test('calls onClose when close button clicked', () => {
    render(<ManagementModal {...mockProps} />)
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(mockProps.onClose).toHaveBeenCalled()
  })
})