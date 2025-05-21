import { Host, CreateHostDTO, UpdateHostDTO } from '../types/host.types';
import { mockHostService } from '../mocks';
// Uncomment for real API implementation
// import apiClient from '../api/apiClient';

/**
 * Host Service
 * This service handles operations related to hosts.
 */
export const hostService = {
  /**
   * Get all hosts
   */
  getAll: async (): Promise<Host[]> => {
    try {
      // Currently using mock data for development
      return await mockHostService.getAll();
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockHostService.getAll();
      } else {
        const response = await apiClient.get<Host[]>('/hosts');
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch hosts');
    }
  },
  
  /**
   * Get host by ID
   */
  getById: async (id: string): Promise<Host> => {
    try {
      return await mockHostService.getById(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockHostService.getById(id);
      } else {
        const response = await apiClient.get<Host>(`/hosts/${id}`);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch host with ID ${id}`);
    }
  },
  
  /**
   * Create a new host
   */
  create: async (hostData: CreateHostDTO): Promise<Host> => {
    try {
      return await mockHostService.create(hostData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockHostService.create(hostData);
      } else {
        const response = await apiClient.post<Host>('/hosts', hostData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create host');
    }
  },
  
  /**
   * Update an existing host
   */
  update: async (id: string, hostData: UpdateHostDTO): Promise<Host> => {
    try {
      return await mockHostService.update(id, hostData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockHostService.update(id, hostData);
      } else {
        const response = await apiClient.put<Host>(`/hosts/${id}`, hostData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to update host with ID ${id}`);
    }
  },
  
  /**
   * Delete a host
   */
  delete: async (id: string): Promise<void> => {
    try {
      await mockHostService.delete(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        await mockHostService.delete(id);
      } else {
        await apiClient.delete(`/hosts/${id}`);
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to delete host with ID ${id}`);
    }
  },
};