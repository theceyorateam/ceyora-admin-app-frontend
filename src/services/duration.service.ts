import { Duration, CreateDurationDTO, UpdateDurationDTO } from '../types/duration.types';
import { mockDurationService } from '../mocks';
// Uncomment for real API implementation
// import apiClient from '../api/apiClient';

/**
 * Duration Service
 * This service handles operations related to durations.
 */
export const durationService = {
  /**
   * Get all durations
   */
  getAll: async (): Promise<Duration[]> => {
    try {
      // Currently using mock data for development
      return await mockDurationService.getAll();
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockDurationService.getAll();
      } else {
        const response = await apiClient.get<Duration[]>('/durations');
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch durations');
    }
  },
  
  /**
   * Get duration by ID
   */
  getById: async (id: string): Promise<Duration> => {
    try {
      return await mockDurationService.getById(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockDurationService.getById(id);
      } else {
        const response = await apiClient.get<Duration>(`/durations/${id}`);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch duration with ID ${id}`);
    }
  },
  
  /**
   * Create a new duration
   */
  create: async (durationData: CreateDurationDTO): Promise<Duration> => {
    try {
      return await mockDurationService.create(durationData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockDurationService.create(durationData);
      } else {
        const response = await apiClient.post<Duration>('/durations', durationData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create duration');
    }
  },
  
  /**
   * Update an existing duration
   */
  update: async (id: string, durationData: UpdateDurationDTO): Promise<Duration> => {
    try {
      return await mockDurationService.update(id, durationData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockDurationService.update(id, durationData);
      } else {
        const response = await apiClient.put<Duration>(`/durations/${id}`, durationData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to update duration with ID ${id}`);
    }
  },
  
  /**
   * Delete a duration
   */
  delete: async (id: string): Promise<void> => {
    try {
      await mockDurationService.delete(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        await mockDurationService.delete(id);
      } else {
        await apiClient.delete(`/durations/${id}`);
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to delete duration with ID ${id}`);
    }
  },
};