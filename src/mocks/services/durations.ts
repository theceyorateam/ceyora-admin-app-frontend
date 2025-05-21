import durations from '../data/durations';
import { Duration, CreateDurationDTO, UpdateDurationDTO } from '../../types/duration.types';

// Add a delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy of the durations array to work with
let durationsList = [...durations];

export const mockDurationService = {
  // Get all durations
  getAll: async (): Promise<Duration[]> => {
    await delay(300);
    return [...durationsList];
  },
  
  // Get duration by ID
  getById: async (id: string): Promise<Duration> => {
    await delay(200);
    const duration = durationsList.find(duration => duration.id === id);
    
    if (!duration) {
      throw new Error(`Duration with ID ${id} not found`);
    }
    
    return { ...duration };
  },
  
  // Create a new duration
  create: async (durationData: CreateDurationDTO): Promise<Duration> => {
    await delay(400);
    
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = (Math.max(...durationsList.map(d => parseInt(d.id)), 0) + 1).toString();
    
    const newDuration: Duration = {
      id: newId,
      duration: durationData.duration,
    };
    
    durationsList.push(newDuration);
    
    return { ...newDuration };
  },
  
  // Update an existing duration
  update: async (id: string, durationData: UpdateDurationDTO): Promise<Duration> => {
    await delay(400);
    
    const index = durationsList.findIndex(duration => duration.id === id);
    
    if (index === -1) {
      throw new Error(`Duration with ID ${id} not found`);
    }
    
    // Update the duration
    const updatedDuration = {
      ...durationsList[index],
      ...durationData,
    };
    
    durationsList[index] = updatedDuration;
    
    return { ...updatedDuration };
  },
  
  // Delete a duration
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const index = durationsList.findIndex(duration => duration.id === id);
    
    if (index === -1) {
      throw new Error(`Duration with ID ${id} not found`);
    }
    
    // Remove the duration from the list
    durationsList = durationsList.filter(duration => duration.id !== id);
  },
};