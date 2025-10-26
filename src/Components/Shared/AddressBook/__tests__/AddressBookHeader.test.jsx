import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressBookHeader from '../AddressBookHeader';

describe('AddressBookHeader', () => {
  const mockProps = {
    onAddClick: vi.fn(),
    onDefaultShippingClick: vi.fn(),
    onDefaultBillingClick: vi.fn(),
  };

  it('renders header with title and description', () => {
    render(<AddressBookHeader {...mockProps} />);
    
    expect(screen.getByText('Address Book')).toBeInTheDocument();
    expect(screen.getByText('Manage your delivery and billing addresses')).toBeInTheDocument();
  });

  it('renders Add Address button', () => {
    render(<AddressBookHeader {...mockProps} />);
    
    const addButton = screen.getByRole('button', { name: /add address/i });
    expect(addButton).toBeInTheDocument();
  });

  it('calls onAddClick when Add Address button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddressBookHeader {...mockProps} />);
    
    const addButton = screen.getByRole('button', { name: /add address/i });
    await user.click(addButton);
    
    expect(mockProps.onAddClick).toHaveBeenCalledTimes(1);
  });

  it('renders Set Default Shipping button', () => {
    render(<AddressBookHeader {...mockProps} />);
    
    const shippingButton = screen.getByRole('button', { name: /set default shipping/i });
    expect(shippingButton).toBeInTheDocument();
  });

  it('calls onDefaultShippingClick when Set Default Shipping is clicked', async () => {
    const user = userEvent.setup();
    render(<AddressBookHeader {...mockProps} />);
    
    const shippingButton = screen.getByRole('button', { name: /set default shipping/i });
    await user.click(shippingButton);
    
    expect(mockProps.onDefaultShippingClick).toHaveBeenCalledTimes(1);
  });

  it('renders Set Default Billing button', () => {
    render(<AddressBookHeader {...mockProps} />);
    
    const billingButton = screen.getByRole('button', { name: /set default billing/i });
    expect(billingButton).toBeInTheDocument();
  });

  it('calls onDefaultBillingClick when Set Default Billing is clicked', async () => {
    const user = userEvent.setup();
    render(<AddressBookHeader {...mockProps} />);
    
    const billingButton = screen.getByRole('button', { name: /set default billing/i });
    await user.click(billingButton);
    
    expect(mockProps.onDefaultBillingClick).toHaveBeenCalledTimes(1);
  });

  it('does not call handlers when buttons are not clicked', () => {
    render(<AddressBookHeader {...mockProps} />);
    
    expect(mockProps.onAddClick).not.toHaveBeenCalled();
    expect(mockProps.onDefaultShippingClick).not.toHaveBeenCalled();
    expect(mockProps.onDefaultBillingClick).not.toHaveBeenCalled();
  });
});