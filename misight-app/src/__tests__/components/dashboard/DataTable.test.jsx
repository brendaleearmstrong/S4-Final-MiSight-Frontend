import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '@/components/dashboard/DataTable';

describe('DataTable', () => {
  const mockData = [
    { id: 1, name: 'Test Item', status: 'Active' }
  ];

  const mockColumns = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' }
  ];

  const mockEdit = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with data', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('handles edit action', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    expect(mockEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('handles delete action', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockDelete).toHaveBeenCalledWith(mockData[0].id);
  });

  it('renders custom column render functions', () => {
    const customColumns = [
      ...mockColumns,
      {
        key: 'custom',
        label: 'Custom',
        render: (_, item) => `Custom ${item.name}`
      }
    ];

    const customData = [
      { ...mockData[0], custom: 'value' }
    ];

    render(
      <DataTable
        data={customData}
        columns={customColumns}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    expect(screen.getByText('Custom Test Item')).toBeInTheDocument();
  });
});