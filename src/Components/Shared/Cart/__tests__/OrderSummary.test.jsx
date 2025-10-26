import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderSummary from '../OrderSummary';

describe('OrderSummary', () => {
  const defaultProps = {
    totalQuantity: 5,
    subtotal: 1000,
    deliveryFee: 150,
    total: 1150,
    onCheckout: vi.fn(),
  };

  it('renders order summary with all details', () => {
    render(<OrderSummary {...defaultProps} />);
    
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getByText(/delivery fee/i)).toBeInTheDocument();
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  it('displays correct item count - singular', () => {
    render(<OrderSummary {...defaultProps} totalQuantity={1} />);
    
    expect(screen.getByText(/1 Item/i)).toBeInTheDocument();
  });

  it('displays correct item count - plural', () => {
    render(<OrderSummary {...defaultProps} totalQuantity={5} />);
    
    expect(screen.getByText(/5 Items/i)).toBeInTheDocument();
  });

  it('displays correct monetary values', () => {
    render(<OrderSummary {...defaultProps} />);
    
    expect(screen.getByText(/৳ 1000\.00/)).toBeInTheDocument();
    expect(screen.getByText(/৳ 150/)).toBeInTheDocument();
    expect(screen.getByText(/৳ 1150\.00/)).toBeInTheDocument();
  });
});