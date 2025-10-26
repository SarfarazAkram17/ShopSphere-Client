import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddressMutations } from '../useAddressMutations';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAddressMutations', () => {
  const mockAxiosSecure = {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  const mockRefetch = vi.fn();
  const mockCallbacks = {
    onAddSuccess: vi.fn(),
    onUpdateSuccess: vi.fn(),
    onDeleteSuccess: vi.fn(),
    onDefaultShippingSuccess: vi.fn(),
    onDefaultBillingSuccess: vi.fn(),
  };

  const userEmail = 'test@example.com';

  it('returns all mutation functions', () => {
    const { result } = renderHook(
      () => useAddressMutations(mockAxiosSecure, userEmail, mockRefetch, mockCallbacks),
      { wrapper: createWrapper() }
    );

    expect(result.current.addMutation).toBeDefined();
    expect(result.current.updateMutation).toBeDefined();
    expect(result.current.deleteMutation).toBeDefined();
    expect(result.current.setDefaultShippingMutation).toBeDefined();
    expect(result.current.setDefaultBillingMutation).toBeDefined();
  });

  it('calls add mutation with correct parameters', async () => {
    mockAxiosSecure.post.mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(
      () => useAddressMutations(mockAxiosSecure, userEmail, mockRefetch, mockCallbacks),
      { wrapper: createWrapper() }
    );

    const newAddress = {
      name: 'John Doe',
      phone: '01234567890',
      address: '123 Main St',
    };

    result.current.addMutation.mutate(newAddress);

    await waitFor(() => {
      expect(mockAxiosSecure.post).toHaveBeenCalledWith(
        `/users/address?email=${userEmail}`,
        newAddress
      );
    });
  });
});