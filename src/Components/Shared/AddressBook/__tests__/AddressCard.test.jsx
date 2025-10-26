import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressCard from '../AddressCard';

describe('AddressCard', () => {
  const mockAddress = {
    _id: '123',
    name: 'John Doe',
    phone: '01234567890',
    address: '123 Main St',
    region: 'Dhaka',
    district: 'Dhaka',
    thana: 'Gulshan',
    label: 'HOME',
    isDefaultShipping: true,
    isDefaultBilling: false,
  };

  const mockOnEdit = vi.fn();

  it('renders address information correctly', () => {
    render(<AddressCard address={mockAddress} onEdit={mockOnEdit} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('01234567890')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText(/Dhaka.*Dhaka.*Gulshan/)).toBeInTheDocument();
  });

  it('displays HOME label for home addresses', () => {
    render(<AddressCard address={mockAddress} onEdit={mockOnEdit} />);
    
    const labels = screen.getAllByText('HOME');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('displays OFFICE label for office addresses', () => {
    const officeAddress = { ...mockAddress, label: 'OFFICE' };
    render(<AddressCard address={officeAddress} onEdit={mockOnEdit} />);
    
    const labels = screen.getAllByText('OFFICE');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('shows default shipping badge when isDefaultShipping is true', () => {
    render(<AddressCard address={mockAddress} onEdit={mockOnEdit} />);
    
    expect(screen.getByText(/default shipping/i)).toBeInTheDocument();
  });

  it('shows default billing badge when isDefaultBilling is true', () => {
    const addressWithBilling = { ...mockAddress, isDefaultBilling: true };
    render(<AddressCard address={addressWithBilling} onEdit={mockOnEdit} />);
    
    expect(screen.getByText(/default billing/i)).toBeInTheDocument();
  });

  it('does not show badges when address is not default', () => {
    const regularAddress = { ...mockAddress, isDefaultShipping: false, isDefaultBilling: false };
    render(<AddressCard address={regularAddress} onEdit={mockOnEdit} />);
    
    expect(screen.queryByText(/default shipping/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/default billing/i)).not.toBeInTheDocument();
  });

  it('calls onEdit with address when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddressCard address={mockAddress} onEdit={mockOnEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit address/i });
    await user.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockAddress);
  });

  it('renders edit button', () => {
    render(<AddressCard address={mockAddress} onEdit={mockOnEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit address/i });
    expect(editButton).toBeInTheDocument();
  });
});