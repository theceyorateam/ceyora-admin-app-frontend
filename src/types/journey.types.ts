import { Location } from './location.types';
import { Tag } from './tag.types';
import { Host } from './host.types';
import { Package } from './package.types';

export interface Journey {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  locationId: string;
  location?: Location;
  priceLKR: number;
  priceUSD?: number;
  tagIds: string[];
  tags?: Tag[];
  baseImage: string;
  otherImages: string[];
  hostId: string;
  host?: Host;
  packages?: Package[];
  hidden?: boolean; // New property to hide journeys
}

export interface CreateJourneyDTO {
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  locationId: string;
  priceLKR: number;
  tagIds: string[];
  baseImage: string;
  otherImages: string[];
  hostId: string;
  hidden?: boolean;
}

export interface UpdateJourneyDTO {
  title?: string;
  subtitle?: string;
  summary?: string;
  description?: string;
  locationId?: string;
  priceLKR?: number;
  tagIds?: string[];
  baseImage?: string;
  otherImages?: string[];
  hostId?: string;
  hidden?: boolean;
}