import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AddressGrid from '../AddressGrid';

describe('AddressGrid', () => {
  const mockAddresses = [
    {
      _id: '1',
      name: 'John Doe',
      phone: '01234567890',
      address: '123 Main St',
      region: 'Dhaka',
      district: 'Dhaka',
      thana: 'Gulshan',
      label: 'HOME',
      isDefaultShipping: true,
      isDefaultBilling: false,
    },
    {
      _id: '2',
      name: 'Jane Smith',
      phone: '01987654321',
      address: '456 Park Ave',
      region: 'Chattogram',
      district: 'Chattogram',
      thana: 'Panchlaish',
      label: 'OFFICE',
      isDefaultShipping: false,
      isDefaultBilling: true,
    },
  ];

  const mockOnEdit = vi.fn();

  it('renders all addresses', () => {
    render(<AddressGrid addresses={mockAddresses} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders empty when no addresses provided', () => {
    const { container } = render(<AddressGrid addresses={[]} onEdit={mockOnEdit} />);
    
    const grid = container.querySelector('.grid');
    expect(grid?.children.length).toBe(0);
  });

  it('applies grid layout classes', () => {
    const { container } = render(<AddressGrid addresses={mockAddresses} onEdit={mockOnEdit} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('renders correct number of address cards', () => {
    render(<AddressGrid addresses={mockAddresses} onEdit={mockOnEdit} />);
    
    const editButtons = screen.getAllByRole('button', { name: /edit address/i });
    expect(editButtons).toHaveLength(2);
  });
});