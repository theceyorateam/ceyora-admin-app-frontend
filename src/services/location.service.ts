import { Location, CreateLocationDTO, UpdateLocationDTO } from '../types/location.types';
import { mockLocationService } from '../mocks';
// Uncomment for real API implementation
// import apiClient from '../api/apiClient';

/**
 * Location Service
 * This service handles operations related to locations.
 */
export const locationService = {
  /**
   * Get all locations
   */
  getAll: async (): Promise<Location[]> => {
    try {
      // Currently using mock data for development
      return await mockLocationService.getAll();
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockLocationService.getAll();
      } else {
        const response = await apiClient.get<Location[]>('/locations');
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch locations');
    }
  },
  
  /**
   * Get location by ID
   */
  getById: async (id: string): Promise<Location> => {
    try {
      return await mockLocationService.getById(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockLocationService.getById(id);
      } else {
        const response = await apiClient.get<Location>(`/locations/${id}`);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch location with ID ${id}`);
    }
  },
  
  /**
   * Create a new location
   */
  create: async (locationData: CreateLocationDTO): Promise<Location> => {
    try {
      return await mockLocationService.create(locationData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockLocationService.create(locationData);
      } else {
        const response = await apiClient.post<Location>('/locations', locationData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create location');
    }
  },
  
  /**
   * Update an existing location
   */
  update: async (id: string, locationData: UpdateLocationDTO): Promise<Location> => {
    try {
      return await mockLocationService.update(id, locationData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockLocationService.update(id, locationData);
      } else {
        const response = await apiClient.put<Location>(`/locations/${id}`, locationData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to update location with ID ${id}`);
    }
  },
  
  /**
   * Delete a location
   */
  delete: async (id: string): Promise<void> => {
    try {
      await mockLocationService.delete(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        await mockLocationService.delete(id);
      } else {
        await apiClient.delete(`/locations/${id}`);
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to delete location with ID ${id}`);
    }
  },
};