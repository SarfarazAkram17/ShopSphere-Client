import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAddressForm } from '../useAddressForm';

// Mock fetch
global.fetch = vi.fn();

describe('useAddressForm', () => {
  const mockRegions = ['Dhaka', 'Chattogram', 'Rajshahi'];
  const mockOutlets = [
    {
      region: 'Dhaka',
      district: 'Dhaka',
      covered_area: ['Gulshan', 'Banani', 'Dhanmondi'],
    },
    {
      region: 'Dhaka',
      district: 'Gazipur',
      covered_area: ['Tongi', 'Kaliakair'],
    },
    {
      region: 'Chattogram',
      district: 'Chattogram',
      covered_area: ['Panchlaish', 'Agrabad'],
    },
  ];

  beforeEach(() => {
    fetch.mockImplementation((url) => {
      if (url.includes('regions.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockRegions),
        });
      }
      if (url.includes('outlets.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockOutlets),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default form data', () => {
    const { result } = renderHook(() => useAddressForm());
    
    expect(result.current.formData).toEqual({
      name: '',
      phone: '',
      region: '',
      district: '',
      thana: '',
      building: '',
      address: '',
      label: 'HOME',
    });
  });

  it('loads regions from API', async () => {
    const { result } = renderHook(() => useAddressForm());
    
    await waitFor(() => {
      expect(result.current.regions).toEqual(mockRegions);
    });
  });

  it('updates districts when region is selected', async () => {
    const { result } = renderHook(() => useAddressForm());
    
    await waitFor(() => {
      expect(result.current.outlets.length).toBeGreaterThan(0);
    });
    
    const regionOption = { value: 'Dhaka', label: 'Dhaka' };
    result.current.handleRegionChange(regionOption);
    
    await waitFor(() => {
      expect(result.current.districts).toEqual(['Dhaka', 'Gazipur']);
      expect(result.current.formData.region).toBe('Dhaka');
    });
  });

  it('resets form data correctly', async () => {
    const { result } = renderHook(() => useAddressForm());
    
    result.current.setFormData({
      name: 'John',
      phone: '123',
      region: 'Dhaka',
      district: 'Dhaka',
      thana: 'Gulshan',
      building: '123',
      address: 'Test',
      label: 'OFFICE',
    });
    
    result.current.resetForm();
    
    await waitFor(() => {
      expect(result.current.formData).toEqual({
        name: '',
        phone: '',
        region: '',
        district: '',
        thana: '',
        building: '',
        address: '',
        label: 'HOME',
      });
    });
  });
});