import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  const mockOnAddClick = vi.fn();

  it('renders empty state message', () => {
    render(<EmptyState onAddClick={mockOnAddClick} />);
    
    expect(screen.getByText('No addresses yet')).toBeInTheDocument();
    expect(screen.getByText('Add your first address to get started')).toBeInTheDocument();
  });

  it('renders Add New Address button', () => {
    render(<EmptyState onAddClick={mockOnAddClick} />);
    
    const button = screen.getByRole('button', { name: /add new address/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onAddClick when button is clicked', async () => {
    const user = userEvent.setup();
    render(<EmptyState onAddClick={mockOnAddClick} />);
    
    const button = screen.getByRole('button', { name: /add new address/i });
    await user.click(button);
    
    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });
});