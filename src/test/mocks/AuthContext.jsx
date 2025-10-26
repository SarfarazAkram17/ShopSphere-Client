import { createContext } from 'react';
import { vi } from 'vitest';

export const AuthContext = createContext({
  user: null,
  userEmail: null,
  loading: false,
  logOutUser: vi.fn(),
});

export const createMockAuthContext = (overrides = {}) => ({
  user: { email: 'test@example.com', name: 'Test User' },
  userEmail: 'test@example.com',
  loading: false,
  logOutUser: vi.fn(),
  ...overrides,
});