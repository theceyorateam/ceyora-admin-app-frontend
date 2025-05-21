import packages from '../data/packages';
import durations from '../data/durations';
import { Package, CreatePackageDTO, UpdatePackageDTO } from '../../types/package.types';

// Add a delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Exchange rate for LKR to USD (this would typically be fetched from an API)
const EXCHANGE_RATE_LKR_TO_USD = 0.00333; // 1 LKR = 0.00333 USD (approx)

// Create a copy of the packages array to work with
let packagesList = [...packages];

export const mockPackageService = {
  // Get all packages
  getAll: async (): Promise<Package[]> => {
    await delay(300);
    
    // Populate durations and calculate USD prices
    const packagesWithDetails = packagesList.map(pkg => {
      // Get duration data
      const duration = durations.find(d => d.id === pkg.durationId);
      
      // Calculate USD price if not already set
      const priceUSD = pkg.priceUSD || Math.round(pkg.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
      
      return {
        ...pkg,
        duration,
        priceUSD,
      };
    });
    
    return packagesWithDetails;
  },
  
  // Get packages by journey ID
  getByJourneyId: async (journeyId: string): Promise<Package[]> => {
    await delay(300);
    
    // Filter packages by journey ID
    const journeyPackages = packagesList.filter(pkg => pkg.journeyId === journeyId);
    
    // Populate durations and calculate USD prices
    const packagesWithDetails = journeyPackages.map(pkg => {
      // Get duration data
      const duration = durations.find(d => d.id === pkg.durationId);
      
      // Calculate USD price if not already set
      const priceUSD = pkg.priceUSD || Math.round(pkg.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
      
      return {
        ...pkg,
        duration,
        priceUSD,
      };
    });
    
    return packagesWithDetails;
  },
  
  // Get package by ID
  getById: async (id: string): Promise<Package> => {
    await delay(200);
    const pkg = packagesList.find(pkg => pkg.id === id);
    
    if (!pkg) {
      throw new Error(`Package with ID ${id} not found`);
    }
    
    // Get duration data
    const duration = durations.find(d => d.id === pkg.durationId);
    
    // Calculate USD price if not already set
    const priceUSD = pkg.priceUSD || Math.round(pkg.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
    
    return {
      ...pkg,
      duration,
      priceUSD,
    };
  },
  
  // Create a new package
  create: async (packageData: CreatePackageDTO): Promise<Package> => {
    await delay(400);
    
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = (Math.max(...packagesList.map(p => parseInt(p.id)), 0) + 1).toString();
    
    // Calculate USD price
    const priceUSD = Math.round(packageData.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
    
    const newPackage: Package = {
      id: newId,
      ...packageData,
      priceUSD,
    };
    
    packagesList.push(newPackage);
    
    // Get duration data
    const duration = durations.find(d => d.id === newPackage.durationId);
    
    return {
      ...newPackage,
      duration,
    };
  },
  
  // Update an existing package
  update: async (id: string, packageData: UpdatePackageDTO): Promise<Package> => {
    await delay(400);
    
    const index = packagesList.findIndex(pkg => pkg.id === id);
    
    if (index === -1) {
      throw new Error(`Package with ID ${id} not found`);
    }
    
    // Calculate USD price if price in LKR is updated
    let priceUSD = packagesList[index].priceUSD;
    if (packageData.priceLKR) {
      priceUSD = Math.round(packageData.priceLKR * EXCHANGE_RATE_LKR_TO_USD);
    }
    
    // Update the package
    const updatedPackage = {
      ...packagesList[index],
      ...packageData,
      priceUSD,
    };
    
    packagesList[index] = updatedPackage;
    
    // Get duration data
    const duration = durations.find(d => d.id === updatedPackage.durationId);
    
    return {
      ...updatedPackage,
      duration,
    };
  },
  
  // Delete a package
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const index = packagesList.findIndex(pkg => pkg.id === id);
    
    if (index === -1) {
      throw new Error(`Package with ID ${id} not found`);
    }
    
    // Remove the package from the list
    packagesList = packagesList.filter(pkg => pkg.id !== id);
  },
};