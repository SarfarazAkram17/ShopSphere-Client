import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from '../FormInput';

describe('FormInput', () => {
  const mockOnChange = vi.fn();

  it('renders input with label', () => {
    render(
      <FormInput
        label="Full Name"
        icon="user"
        value=""
        onChange={mockOnChange}
        placeholder="Enter your name"
      />
    );
    
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('displays required indicator when required is true', () => {
    render(
      <FormInput
        label="Phone"
        icon="phone"
        value=""
        onChange={mockOnChange}
        required
      />
    );
    
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not display required indicator when required is false', () => {
    render(
      <FormInput
        label="Building"
        icon="building"
        value=""
        onChange={mockOnChange}
      />
    );
    
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders with correct input type', () => {
    render(
      <FormInput
        label="Phone"
        icon="phone"
        type="tel"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText(/phone/i);
    expect(input).toHaveAttribute('type', 'tel');
  });

  it('defaults to text input type', () => {
    render(
      <FormInput
        label="Name"
        icon="user"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText(/name/i);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('displays current value', () => {
    render(
      <FormInput
        label="Name"
        icon="user"
        value="John Doe"
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByDisplayValue('John Doe');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup();
    render(
      <FormInput
        label="Name"
        icon="user"
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByLabelText(/name/i);
    await user.type(input, 'Test');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders with all icon types', () => {
    const icons = ['user', 'phone', 'building', 'location', 'map'];
    
    icons.forEach((icon) => {
      const { unmount } = render(
        <FormInput
          label={`Test ${icon}`}
          icon={icon}
          value=""
          onChange={mockOnChange}
        />
      );
      
      expect(screen.getByText(`Test ${icon}`)).toBeInTheDocument();
      unmount();
    });
  });
});