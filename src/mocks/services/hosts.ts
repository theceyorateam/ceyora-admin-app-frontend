import hosts from '../data/hosts';
import { Host, CreateHostDTO, UpdateHostDTO } from '../../types/host.types';
import locations from '../data/locations';

// Add a delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a copy of the hosts array to work with
let hostsList = [...hosts];

export const mockHostService = {
  // Get all hosts
  getAll: async (): Promise<Host[]> => {
    await delay(300);
    
    // Populate location data for each host
    const hostsWithLocation = hostsList.map(host => {
      const location = locations.find(loc => loc.id === host.locationId);
      return {
        ...host,
        location: location || undefined
      };
    });
    
    return [...hostsWithLocation];
  },
  
  // Get host by ID
  getById: async (id: string): Promise<Host> => {
    await delay(200);
    const host = hostsList.find(host => host.id === id);
    
    if (!host) {
      throw new Error(`Host with ID ${id} not found`);
    }
    
    // Populate location data
    const location = locations.find(loc => loc.id === host.locationId);
    
    return { 
      ...host,
      location: location || undefined
    };
  },
  
  // Create a new host
  create: async (hostData: CreateHostDTO): Promise<Host> => {
    await delay(400);
    
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = (Math.max(...hostsList.map(h => parseInt(h.id)), 0) + 1).toString();
    
    // Set register date to today if not provided
    const registerDate = hostData.registerDate || new Date().toISOString().split('T')[0];
    
    const newHost: Host = {
      id: newId,
      firstName: hostData.firstName,
      lastName: hostData.lastName,
      locationId: hostData.locationId,
      address: hostData.address,
      description: hostData.description,
      registerDate,
      contactNumber1: hostData.contactNumber1,
      contactNumber2: hostData.contactNumber2,
      email: hostData.email,
      languages: hostData.languages,
      profilePhoto: hostData.profilePhoto
    };
    
    hostsList.push(newHost);
    
    // Populate location data
    const location = locations.find(loc => loc.id === newHost.locationId);
    
    return { 
      ...newHost,
      location: location || undefined
    };
  },
  
  // Update an existing host
  update: async (id: string, hostData: UpdateHostDTO): Promise<Host> => {
    await delay(400);
    
    const index = hostsList.findIndex(host => host.id === id);
    
    if (index === -1) {
      throw new Error(`Host with ID ${id} not found`);
    }
    
    // Update the host
    const updatedHost = {
      ...hostsList[index],
      ...hostData,
    };
    
    hostsList[index] = updatedHost;
    
    // Populate location data
    const location = locations.find(loc => loc.id === updatedHost.locationId);
    
    return { 
      ...updatedHost,
      location: location || undefined
    };
  },
  
  // Delete a host
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const index = hostsList.findIndex(host => host.id === id);
    
    if (index === -1) {
      throw new Error(`Host with ID ${id} not found`);
    }
    
    // Remove the host from the list
    hostsList = hostsList.filter(host => host.id !== id);
  },
};