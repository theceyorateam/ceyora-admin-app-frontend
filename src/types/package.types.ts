import { Duration } from './duration.types';

export interface Package {
  id: string;
  journeyId: string;
  name: string;
  priceLKR: number;
  priceUSD?: number;
  description: string;
  durationId: string;
  duration?: Duration;
  inclusions: string[];
  maxGuests: number;
  hidden?: boolean; // New property to hide packages
}

export interface CreatePackageDTO {
  journeyId: string;
  name: string;
  priceLKR: number;
  description: string;
  durationId: string;
  inclusions: string[];
  maxGuests: number;
  hidden?: boolean;
}

export interface UpdatePackageDTO {
  name?: string;
  priceLKR?: number;
  description?: string;
  durationId?: string;
  inclusions?: string[];
  maxGuests?: number;
  hidden?: boolean;
}