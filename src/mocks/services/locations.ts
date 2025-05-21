import locations from '../data/locations';
import { Location, CreateLocationDTO, UpdateLocationDTO } from '../../types/location.types';

// Add a delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy of the locations array to work with
let locationsList = [...locations];

export const mockLocationService = {
  // Get all locations
  getAll: async (): Promise<Location[]> => {
    await delay(300);
    return [...locationsList];
  },
  
  // Get location by ID
  getById: async (id: string): Promise<Location> => {
    await delay(200);
    const location = locationsList.find(location => location.id === id);
    
    if (!location) {
      throw new Error(`Location with ID ${id} not found`);
    }
    
    return { ...location };
  },
  
  // Create a new location
  create: async (locationData: CreateLocationDTO): Promise<Location> => {
    await delay(400);
    
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = (Math.max(...locationsList.map(l => parseInt(l.id)), 0) + 1).toString();
    
    const newLocation: Location = {
      id: newId,
      name: locationData.name,
    };
    
    locationsList.push(newLocation);
    
    return { ...newLocation };
  },
  
  // Update an existing location
  update: async (id: string, locationData: UpdateLocationDTO): Promise<Location> => {
    await delay(400);
    
    const index = locationsList.findIndex(location => location.id === id);
    
    if (index === -1) {
      throw new Error(`Location with ID ${id} not found`);
    }
    
    // Update the location
    const updatedLocation = {
      ...locationsList[index],
      ...locationData,
    };
    
    locationsList[index] = updatedLocation;
    
    return { ...updatedLocation };
  },
  
  // Delete a location
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const index = locationsList.findIndex(location => location.id === id);
    
    if (index === -1) {
      throw new Error(`Location with ID ${id} not found`);
    }
    
    // Remove the location from the list
    locationsList = locationsList.filter(location => location.id !== id);
  },
};