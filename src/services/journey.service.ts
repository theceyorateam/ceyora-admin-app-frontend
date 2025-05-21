import { Journey, CreateJourneyDTO, UpdateJourneyDTO } from '../types/journey.types';
import { mockJourneyService } from '../mocks';
// Uncomment for real API implementation
// import apiClient from '../api/apiClient';

/**
 * Journey Service
 * This service handles operations related to journeys.
 */
export const journeyService = {
  /**
   * Get all journeys
   */
  getAll: async (): Promise<Journey[]> => {
    try {
      // Currently using mock data for development
      return await mockJourneyService.getAll();
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockJourneyService.getAll();
      } else {
        const response = await apiClient.get<Journey[]>('/journeys');
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch journeys');
    }
  },
  
  /**
   * Get journey by ID
   */
  getById: async (id: string): Promise<Journey> => {
    try {
      return await mockJourneyService.getById(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockJourneyService.getById(id);
      } else {
        const response = await apiClient.get<Journey>(`/journeys/${id}`);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch journey with ID ${id}`);
    }
  },
  
  /**
   * Create a new journey
   */
  create: async (journeyData: CreateJourneyDTO): Promise<Journey> => {
    try {
      return await mockJourneyService.create(journeyData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockJourneyService.create(journeyData);
      } else {
        const response = await apiClient.post<Journey>('/journeys', journeyData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create journey');
    }
  },
  
  /**
   * Update an existing journey
   */
  update: async (id: string, journeyData: UpdateJourneyDTO): Promise<Journey> => {
    try {
      return await mockJourneyService.update(id, journeyData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockJourneyService.update(id, journeyData);
      } else {
        const response = await apiClient.put<Journey>(`/journeys/${id}`, journeyData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to update journey with ID ${id}`);
    }
  },
  
  /**
   * Delete a journey
   */
  delete: async (id: string): Promise<void> => {
    try {
      await mockJourneyService.delete(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        await mockJourneyService.delete(id);
      } else {
        await apiClient.delete(`/journeys/${id}`);
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to delete journey with ID ${id}`);
    }
  },
};