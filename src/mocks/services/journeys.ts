import journeys from '../data/journeys';
import packages from '../data/packages';
import locations from '../data/locations';
import tags from '../data/tags';
import hosts from '../data/hosts';
import { Journey, CreateJourneyDTO, UpdateJourneyDTO } from '../../types/journey.types';

// Add a delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Exchange rate for LKR to USD (this would typically be fetched from an API)
const EXCHANGE_RATE_LKR_TO_USD = 0.00333; // 1 LKR = 0.00333 USD (approx)

// Create copies of the arrays to work with
let journeysList = [...journeys];
let packagesList = [...packages];

export const mockJourneyService = {
  // Get all journeys
  getAll: async (): Promise<Journey[]> => {
    await delay(300);
    
    // Populate related entities and calculate USD prices
    const journeysWithDetails = journeysList.map(journey => {
      // Get location data
      const location = locations.find(loc => loc.id === journey.locationId);
      
      // Get tags data
      const journeyTags = tags.filter(tag => journey.tagIds.includes(tag.id));
      
      // Get host data
      const host = hosts.find(h => h.id === journey.hostId);
      
      // Calculate USD price if not already set
      const priceUSD = journey.priceUSD || Math.round(journey.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
      
      // Get related packages
      const journeyPackages = packagesList.filter(pkg => pkg.journeyId === journey.id);
      
      return {
        ...journey,
        location,
        tags: journeyTags,
        host,
        priceUSD,
        packages: journeyPackages,
      };
    });
    
    return journeysWithDetails;
  },
  
  // Get journey by ID
  getById: async (id: string): Promise<Journey> => {
    await delay(200);
    const journey = journeysList.find(journey => journey.id === id);
    
    if (!journey) {
      throw new Error(`Journey with ID ${id} not found`);
    }
    
    // Get location data
    const location = locations.find(loc => loc.id === journey.locationId);
    
    // Get tags data
    const journeyTags = tags.filter(tag => journey.tagIds.includes(tag.id));
    
    // Get host data
    const host = hosts.find(h => h.id === journey.hostId);
    
    // Calculate USD price if not already set
    const priceUSD = journey.priceUSD || Math.round(journey.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
    
    // Get related packages
    const journeyPackages = packagesList.filter(pkg => pkg.journeyId === journey.id);
    
    return {
      ...journey,
      location,
      tags: journeyTags,
      host,
      priceUSD,
      packages: journeyPackages,
    };
  },
  
  // Create a new journey
  create: async (journeyData: CreateJourneyDTO): Promise<Journey> => {
    await delay(400);
    
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = (Math.max(...journeysList.map(j => parseInt(j.id)), 0) + 1).toString();
    
    // Calculate USD price
    const priceUSD = Math.round(journeyData.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
    
    const newJourney: Journey = {
      id: newId,
      ...journeyData,
      priceUSD,
    };
    
    journeysList.push(newJourney);
    
    // Get populated data for the response
    const location = locations.find(loc => loc.id === newJourney.locationId);
    const journeyTags = tags.filter(tag => newJourney.tagIds.includes(tag.id));
    const host = hosts.find(h => h.id === newJourney.hostId);
    
    return {
      ...newJourney,
      location,
      tags: journeyTags,
      host,
      packages: [],
    };
  },
  
  // Update an existing journey
  update: async (id: string, journeyData: UpdateJourneyDTO): Promise<Journey> => {
    await delay(400);
    
    const index = journeysList.findIndex(journey => journey.id === id);
    
    if (index === -1) {
      throw new Error(`Journey with ID ${id} not found`);
    }
    
    // Calculate USD price if price in LKR is updated
    let priceUSD = journeysList[index].priceUSD;
    if (journeyData.priceLKR) {
      priceUSD = Math.round(journeyData.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
    }
    
    // Update the journey
    const updatedJourney = {
      ...journeysList[index],
      ...journeyData,
      priceUSD,
    };
    
    journeysList[index] = updatedJourney;
    
    // Get populated data for the response
    const location = locations.find(loc => loc.id === updatedJourney.locationId);
    const journeyTags = tags.filter(tag => updatedJourney.tagIds.includes(tag.id));
    const host = hosts.find(h => h.id === updatedJourney.hostId);
    const journeyPackages = packagesList.filter(pkg => pkg.journeyId === updatedJourney.id);
    
    return {
      ...updatedJourney,
      location,
      tags: journeyTags,
      host,
      packages: journeyPackages,
    };
  },
  
  // Delete a journey and its packages
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const index = journeysList.findIndex(journey => journey.id === id);
    
    if (index === -1) {
      throw new Error(`Journey with ID ${id} not found`);
    }
    
    // Remove the journey from the list
    journeysList = journeysList.filter(journey => journey.id !== id);
    
    // Remove related packages
    packagesList = packagesList.filter(pkg => pkg.journeyId !== id);
  },
};