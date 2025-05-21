// src/mocks/data/bookings.ts (updated with noRefundBeforeDays)
import { Booking, BookingStatus, RefundPolicy } from '../../types/booking.types';

// Helper function to generate a random access token
const generateAccessToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Default refund policy
export const refundPolicy: RefundPolicy = {
  fullRefundBeforeDays: 7,  // Full refund if cancelled 7 days or more before journey date
  partialRefundBeforeDays: 3, // Partial refund if cancelled 3-6 days before journey date
  noRefundBeforeDays: 1, // No refund if cancelled less than 1 day before journey date
  partialRefundPercentage: 50 // 50% refund for partial refunds
};

// Mock Bookings data
const bookings: Booking[] = [
  {
    id: '1',
    userId: '1', // Optional - for future user account integration
    accessToken: 'booking-access-token-1',
    journeyId: '1', // Spiritual Retreat in Kandy
    packageId: '1', // Temple Meditation Experience
    bookingDate: '2025-04-15',
    journeyDate: '2025-05-25',
    status: 'confirmed',
    guestCount: 2,
    totalPriceLKR: 30000,
    totalPriceUSD: 100,
    specialRequests: 'Vegetarian meals required',
    payments: [
      {
        id: '1',
        amount: 30000,
        currency: 'LKR',
        method: 'card',
        status: 'completed',
        transactionId: 'TRX123456',
        timestamp: '2025-04-15T14:30:00Z'
      }
    ],
    contactInfo: {
      name: 'Admin User',
      email: 'admin@ceyora.com',
      phone: '+94 77 123 4567'
    }
  },
  {
    id: '2',
    accessToken: 'booking-access-token-2',
    journeyId: '2', // Beach Adventure in Mirissa
    packageId: '3', // Whale Watching Expedition
    bookingDate: '2025-03-20',
    journeyDate: '2025-05-30',
    status: 'pending',
    guestCount: 4,
    totalPriceLKR: 72000,
    totalPriceUSD: 240,
    payments: [
      {
        id: '2',
        amount: 36000,
        currency: 'LKR',
        method: 'bank_transfer',
        status: 'completed',
        transactionId: 'BT789012',
        timestamp: '2025-03-20T10:15:00Z'
      },
      {
        id: '3',
        amount: 36000,
        currency: 'LKR',
        method: 'card',
        status: 'pending',
        timestamp: '2025-03-20T10:16:00Z'
      }
    ],
    contactInfo: {
      name: 'Guest User',
      email: 'guest@example.com',
      phone: '+94 77 987 6543'
    }
  },
  {
    id: '3',
    accessToken: 'booking-access-token-3',
    journeyId: '3', // Culinary Tour of Colombo
    packageId: '5', // Market to Table Cooking Experience
    bookingDate: '2025-02-10',
    journeyDate: '2025-04-05',
    status: 'completed',
    guestCount: 2,
    totalPriceLKR: 18000,
    totalPriceUSD: 60,
    specialRequests: 'No seafood please',
    payments: [
      {
        id: '4',
        amount: 18000,
        currency: 'LKR',
        method: 'cash',
        status: 'completed',
        timestamp: '2025-02-10T09:30:00Z'
      }
    ],
    contactInfo: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+94 77 123 4567'
    }
  },
  {
    id: '4',
    accessToken: 'booking-access-token-4',
    journeyId: '1', // Spiritual Retreat in Kandy
    packageId: '2', // Full Day Sacred Sites Tour
    bookingDate: '2025-03-15',
    journeyDate: '2025-04-10',
    status: 'cancelled',
    guestCount: 1,
    totalPriceLKR: 25000,
    totalPriceUSD: 83,
    refundedAmount: 25000,
    refundDate: '2025-03-17',
    refundReason: 'Change of plans',
    payments: [
      {
        id: '5',
        amount: 25000,
        currency: 'LKR',
        method: 'card',
        status: 'refunded',
        transactionId: 'TRX567890',
        timestamp: '2025-03-15T16:45:00Z'
      }
    ],
    contactInfo: {
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      phone: '+94 77 987 6543'
    }
  },
  {
    id: '5',
    accessToken: 'booking-access-token-5',
    journeyId: '2', // Beach Adventure in Mirissa
    packageId: '4', // Surf Lesson Package
    bookingDate: '2025-04-20',
    journeyDate: '2025-06-15',
    status: 'confirmed',
    guestCount: 3,
    totalPriceLKR: 36000,
    totalPriceUSD: 120,
    specialRequests: 'Beginner surfing lessons, never surfed before',
    payments: [
      {
        id: '6',
        amount: 36000,
        currency: 'LKR',
        method: 'card',
        status: 'completed',
        transactionId: 'TRX123789',
        timestamp: '2025-04-20T11:30:00Z'
      }
    ],
    contactInfo: {
      name: 'Miguel Rodriguez',
      email: 'miguel@example.com',
      phone: '+94 77 123 4567'
    }
  }
];

export default bookings;