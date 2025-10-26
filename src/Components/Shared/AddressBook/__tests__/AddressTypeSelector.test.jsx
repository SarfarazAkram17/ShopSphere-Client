import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddressTypeSelector from '../AddressTypeSelector';

describe('AddressTypeSelector', () => {
  const mockOnSelect = vi.fn();

  it('renders HOME and OFFICE buttons', () => {
    render(<AddressTypeSelector selectedType="HOME" onSelect={mockOnSelect} />);
    
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /office/i })).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(<AddressTypeSelector selectedType="HOME" onSelect={mockOnSelect} />);
    
    expect(screen.getByText(/select address type/i)).toBeInTheDocument();
  });

  it('highlights HOME when selected', () => {
    render(<AddressTypeSelector selectedType="HOME" onSelect={mockOnSelect} />);
    
    const homeButton = screen.getByRole('button', { name: /home/i });
    expect(homeButton).toHaveClass('border-orange-500');
  });

  it('highlights OFFICE when selected', () => {
    render(<AddressTypeSelector selectedType="OFFICE" onSelect={mockOnSelect} />);
    
    const officeButton = screen.getByRole('button', { name: /office/i });
    expect(officeButton).toHaveClass('border-teal-500');
  });

  it('calls onSelect with HOME when HOME button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddressTypeSelector selectedType="OFFICE" onSelect={mockOnSelect} />);
    
    const homeButton = screen.getByRole('button', { name: /home/i });
    await user.click(homeButton);
    
    expect(mockOnSelect).toHaveBeenCalledWith('HOME');
  });

  it('calls onSelect with OFFICE when OFFICE button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddressTypeSelector selectedType="HOME" onSelect={mockOnSelect} />);
    
    const officeButton = screen.getByRole('button', { name: /office/i });
    await user.click(officeButton);
    
    expect(mockOnSelect).toHaveBeenCalledWith('OFFICE');
  });
});