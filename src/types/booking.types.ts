// src/types/booking.types.ts (updated)
import { User } from './auth.types';
import { Journey } from './journey.types';
import { Package } from './package.types';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';

export interface RefundPolicy {
  fullRefundBeforeDays: number;  // Number of days before journey start date for full refund
  partialRefundBeforeDays: number; // Number of days before journey start date for partial refund
  partialRefundPercentage: number; // Percentage of refund for partial refunds (0-100)
}

export interface BookingPayment {
  id: string;
  amount: number;
  currency: string; // 'LKR' or 'USD'
  method: 'card' | 'bank_transfer' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  transactionId?: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  userId?: string; // Optional for future user account integration
  user?: User;      // Optional for future user account integration
  accessToken: string; // Unique token for link-based access
  journeyId: string;
  journey?: Journey;
  packageId: string;
  package?: Package;
  bookingDate: string; // When the booking was made
  journeyDate: string; // When the journey is scheduled
  status: BookingStatus;
  guestCount: number;
  totalPriceLKR: number;
  totalPriceUSD?: number;
  specialRequests?: string;
  payments: BookingPayment[];
  refundedAmount?: number;
  refundDate?: string;
  refundReason?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreateBookingDTO {
  userId?: string; // Optional for future user account integration
  journeyId: string;
  packageId: string;
  journeyDate: string;
  guestCount: number;
  specialRequests?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface UpdateBookingDTO {
  journeyDate?: string;
  status?: BookingStatus;
  guestCount?: number;
  specialRequests?: string;
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface ProcessRefundDTO {
  reason: string;
  fullRefund?: boolean; // If not provided, calculate based on refund policy
}

export interface BookingTokenVerifyResponse {
  isValid: boolean;
  booking?: Booking;
}