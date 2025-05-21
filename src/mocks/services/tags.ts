import tags from '../data/tags';
import { Tag, CreateTagDTO, UpdateTagDTO } from '../../types/tag.types';

// Add a delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy of the tags array to work with
let tagsList = [...tags];

export const mockTagService = {
  // Get all tags
  getAll: async (): Promise<Tag[]> => {
    await delay(300);
    return [...tagsList];
  },
  
  // Get tag by ID
  getById: async (id: string): Promise<Tag> => {
    await delay(200);
    const tag = tagsList.find(tag => tag.id === id);
    
    if (!tag) {
      throw new Error(`Tag with ID ${id} not found`);
    }
    
    return { ...tag };
  },
  
  // Create a new tag
  create: async (tagData: CreateTagDTO): Promise<Tag> => {
    await delay(400);
    
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = (Math.max(...tagsList.map(t => parseInt(t.id)), 0) + 1).toString();
    
    const newTag: Tag = {
      id: newId,
      name: tagData.name,
    };
    
    tagsList.push(newTag);
    
    return { ...newTag };
  },
  
  // Update an existing tag
  update: async (id: string, tagData: UpdateTagDTO): Promise<Tag> => {
    await delay(400);
    
    const index = tagsList.findIndex(tag => tag.id === id);
    
    if (index === -1) {
      throw new Error(`Tag with ID ${id} not found`);
    }
    
    // Update the tag
    const updatedTag = {
      ...tagsList[index],
      ...tagData,
    };
    
    tagsList[index] = updatedTag;
    
    return { ...updatedTag };
  },
  
  // Delete a tag
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const index = tagsList.findIndex(tag => tag.id === id);
    
    if (index === -1) {
      throw new Error(`Tag with ID ${id} not found`);
    }
    
    // Remove the tag from the list
    tagsList = tagsList.filter(tag => tag.id !== id);
  },
};