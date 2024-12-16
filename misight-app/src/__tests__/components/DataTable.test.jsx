import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from '../../src/components/dashboard/DataTable';

describe('DataTable Component', () => {
  const mockData = [
    { id: 1, name: 'Test Mine', location: 'Test Location' },
    { id: 2, name: 'Another Mine', location: 'Another Location' },
  ];

  const mockColumns = [
    { key: 'name', label: 'Mine Name' },
    { key: 'location', label: 'Location' },
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it('renders table with correct data', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Mine')).toBeInTheDocument();
    expect(screen.getByText('Another Mine')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('calls edit handler when edit button is clicked', () => {
    render(
      <DataTable
        data={mockData}
        columns={mockColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });
});