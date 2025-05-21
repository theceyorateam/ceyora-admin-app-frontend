import { Package, CreatePackageDTO, UpdatePackageDTO } from '../types/package.types';
import { mockPackageService } from '../mocks';
// Uncomment for real API implementation
// import apiClient from '../api/apiClient';

/**
 * Package Service
 * This service handles operations related to packages.
 */
export const packageService = {
  /**
   * Get all packages
   */
  getAll: async (): Promise<Package[]> => {
    try {
      // Currently using mock data for development
      return await mockPackageService.getAll();
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockPackageService.getAll();
      } else {
        const response = await apiClient.get<Package[]>('/packages');
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch packages');
    }
  },
  
  /**
   * Get packages by journey ID
   */
  getByJourneyId: async (journeyId: string): Promise<Package[]> => {
    try {
      return await mockPackageService.getByJourneyId(journeyId);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockPackageService.getByJourneyId(journeyId);
      } else {
        const response = await apiClient.get<Package[]>(`/journeys/${journeyId}/packages`);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch packages for journey with ID ${journeyId}`);
    }
  },
  
  /**
   * Get package by ID
   */
  getById: async (id: string): Promise<Package> => {
    try {
      return await mockPackageService.getById(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockPackageService.getById(id);
      } else {
        const response = await apiClient.get<Package>(`/packages/${id}`);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch package with ID ${id}`);
    }
  },
  
  /**
   * Create a new package
   */
  create: async (packageData: CreatePackageDTO): Promise<Package> => {
    try {
      return await mockPackageService.create(packageData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockPackageService.create(packageData);
      } else {
        const response = await apiClient.post<Package>('/packages', packageData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create package');
    }
  },
  
  /**
   * Update an existing package
   */
  update: async (id: string, packageData: UpdatePackageDTO): Promise<Package> => {
    try {
      return await mockPackageService.update(id, packageData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockPackageService.update(id, packageData);
      } else {
        const response = await apiClient.put<Package>(`/packages/${id}`, packageData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to update package with ID ${id}`);
    }
  },
  
  /**
   * Delete a package
   */
  delete: async (id: string): Promise<void> => {
    try {
      await mockPackageService.delete(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        await mockPackageService.delete(id);
      } else {
        await apiClient.delete(`/packages/${id}`);
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to delete package with ID ${id}`);
    }
  },
};