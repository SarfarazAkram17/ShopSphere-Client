import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteModal from '../DeleteModal';

describe('DeleteModal', () => {
  const mockAddress = {
    _id: '123',
    name: 'John Doe',
    phone: '01234567890',
    address: '123 Main St',
    region: 'Dhaka',
    district: 'Dhaka',
    thana: 'Gulshan',
  };

  const mockProps = {
    address: mockAddress,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    isDeleting: false,
  };

  it('renders delete confirmation modal', () => {
    render(<DeleteModal {...mockProps} />);
    
    expect(screen.getByText(/delete address/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete this address/i)).toBeInTheDocument();
  });

  it('displays address information', () => {
    render(<DeleteModal {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('01234567890')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
  });

  it('renders Cancel and Delete buttons', () => {
    render(<DeleteModal {...mockProps} />);
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<DeleteModal {...mockProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    
    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<DeleteModal {...mockProps} />);
    
    const deleteButton = screen.getByRole('button', { name: /^delete$/i });
    await user.click(deleteButton);
    
    expect(mockProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows "Deleting..." when isDeleting is true', () => {
    render(<DeleteModal {...mockProps} isDeleting={true} />);
    
    expect(screen.getByRole('button', { name: /deleting/i })).toBeInTheDocument();
  });

  it('disables Delete button when isDeleting is true', () => {
    render(<DeleteModal {...mockProps} isDeleting={true} />);
    
    const deleteButton = screen.getByRole('button', { name: /deleting/i });
    expect(deleteButton).toBeDisabled();
  });
});