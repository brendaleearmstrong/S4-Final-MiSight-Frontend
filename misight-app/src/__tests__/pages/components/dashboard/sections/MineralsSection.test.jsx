import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MineralsSection } from './MineralsSection';

describe('MineralsSection', () => {
  const mockData = [
    { id: '1', name: 'Gold', type: 'Metallic', mines: ['Mine A', 'Mine B'] },
    { id: '2', name: 'Coal', type: 'Non-Metallic', mines: ['Mine C'] },
  ];

  const mockOnAdd = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();

    render(
      <MineralsSection
        data={mockData}
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
  });

  it('renders the minerals table with data', () => {
    expect(screen.getByText('Minerals Management')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('Coal')).toBeInTheDocument();
    expect(screen.getByText('Add Mineral')).toBeInTheDocument();
  });

  it('opens modal for adding a new mineral', () => {
    fireEvent.click(screen.getByText('Add Mineral'));
    expect(screen.getByText('Mineral')).toBeInTheDocument(); // Modal title
  });

  it('handles mineral creation', () => {
    fireEvent.click(screen.getByText('Add Mineral'));

    fireEvent.change(screen.getByLabelText('Mineral Name'), {
      target: { value: 'Iron' },
    });
    fireEvent.change(screen.getByLabelText('Type'), {
      target: { value: 'Metallic' },
    });

    fireEvent.click(screen.getByText('Save'));
    expect(mockOnAdd).toHaveBeenCalledWith({ name: 'Iron', type: 'Metallic' });
  });
});
