// src/__tests__/components/dashboard/DataTable.test.jsx
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DataTable } from '@/components/dashboard/DataTable'

describe('DataTable', () => {
  const mockData = [
    { id: 1, name: 'Test Item', status: 'Active' }
  ]

  const mockColumns = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' }
  ]

  test('renders table with correct columns', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  test('handles edit action', () => {
    const mockEdit = vi.fn()
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns}
        onEdit={mockEdit}
        onDelete={() => {}}
      />
    )
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    expect(mockEdit).toHaveBeenCalledWith(mockData[0])
  })
})