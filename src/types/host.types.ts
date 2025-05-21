import { Location } from './location.types';

export interface Host {
  id: string;
  firstName: string;
  lastName: string;
  locationId: string;
  location?: Location; // For populated data
  address: string;
  description: string;
  registerDate: string;
  contactNumber1: string;
  contactNumber2?: string;
  email: string;
  languages: string[];
  profilePhoto: string;
}

export interface CreateHostDTO {
  firstName: string;
  lastName: string;
  locationId: string;
  address: string;
  description: string;
  registerDate?: string;
  contactNumber1: string;
  contactNumber2?: string;
  email: string;
  languages: string[];
  profilePhoto: string;
}

export interface UpdateHostDTO {
  firstName?: string;
  lastName?: string;
  locationId?: string;
  address?: string;
  description?: string;
  registerDate?: string;
  contactNumber1?: string;
  contactNumber2?: string;
  email?: string;
  languages?: string[];
  profilePhoto?: string;
}