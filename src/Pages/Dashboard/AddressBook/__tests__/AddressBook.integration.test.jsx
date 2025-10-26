import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '../../../../test/test-utils';
import AddressBook from '../AddressBook';

// Mock hooks
vi.mock('../../../../Hooks/useAxiosSecure', () => ({
  default: () => ({
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
    put: vi.fn().mockResolvedValue({ data: { success: true } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } }),
  }),
}));

vi.mock('../../../../Hooks/useAuth', () => ({
  default: () => ({
    user: { email: 'test@example.com', name: 'Test User' },
    userEmail: 'test@example.com',
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('AddressBook Integration', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    global.fetch = vi.fn((url) => {
      if (url.includes('regions.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(['Dhaka', 'Chattogram']),
        });
      }
      if (url.includes('outlets.json')) {
        return Promise.resolve({
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  it('renders address book header', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddressBook />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Address Book')).toBeInTheDocument();
    });
  });

  it('shows empty state when no addresses exist', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddressBook />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No addresses yet')).toBeInTheDocument();
    });
  });
});