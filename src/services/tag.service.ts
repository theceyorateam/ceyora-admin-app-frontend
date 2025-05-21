import { Tag, CreateTagDTO, UpdateTagDTO } from '../types/tag.types';
import { mockTagService } from '../mocks';
// Uncomment for real API implementation
// import apiClient from '../api/apiClient';

/**
 * Tag Service
 * This service handles operations related to tags.
 */
export const tagService = {
  /**
   * Get all tags
   */
  getAll: async (): Promise<Tag[]> => {
    try {
      // Currently using mock data for development
      return await mockTagService.getAll();
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockTagService.getAll();
      } else {
        const response = await apiClient.get<Tag[]>('/tags');
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tags');
    }
  },
  
  /**
   * Get tag by ID
   */
  getById: async (id: string): Promise<Tag> => {
    try {
      return await mockTagService.getById(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockTagService.getById(id);
      } else {
        const response = await apiClient.get<Tag>(`/tags/${id}`);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch tag with ID ${id}`);
    }
  },
  
  /**
   * Create a new tag
   */
  create: async (tagData: CreateTagDTO): Promise<Tag> => {
    try {
      return await mockTagService.create(tagData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockTagService.create(tagData);
      } else {
        const response = await apiClient.post<Tag>('/tags', tagData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create tag');
    }
  },
  
  /**
   * Update an existing tag
   */
  update: async (id: string, tagData: UpdateTagDTO): Promise<Tag> => {
    try {
      return await mockTagService.update(id, tagData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockTagService.update(id, tagData);
      } else {
        const response = await apiClient.put<Tag>(`/tags/${id}`, tagData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to update tag with ID ${id}`);
    }
  },
  
  /**
   * Delete a tag
   */
  delete: async (id: string): Promise<void> => {
    try {
      await mockTagService.delete(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        await mockTagService.delete(id);
      } else {
        await apiClient.delete(`/tags/${id}`);
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to delete tag with ID ${id}`);
    }
  },
};