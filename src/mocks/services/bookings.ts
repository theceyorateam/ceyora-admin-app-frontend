import bookings, { refundPolicy } from '../data/bookings';
import journeys from '../data/journeys';
import packages from '../data/packages';
import users from '../data/users';
import { Booking, CreateBookingDTO, UpdateBookingDTO, ProcessRefundDTO, BookingStatus, BookingTokenVerifyResponse } from '../../types/booking.types';

// Add a delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Exchange rate for LKR to USD (this would typically be fetched from an API)
const EXCHANGE_RATE_LKR_TO_USD = 0.00333; // 1 LKR = 0.00333 USD (approx)

// Create a copy of the bookings array to work with
let bookingsList = [...bookings];

// Helper function to generate a unique access token
const generateAccessToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Helper function to check if a booking is eligible for refund (updated version)
const calculateRefundAmount = (booking: Booking): { isEligible: boolean; amount: number; isFullRefund: boolean } => {
  // Booking must be confirmed or pending to be eligible for refund
  if (booking.status !== 'confirmed' && booking.status !== 'pending') {
    return { isEligible: false, amount: 0, isFullRefund: false };
  }
  
  // Calculate days remaining before journey
  const journeyDate = new Date(booking.journeyDate);
  const currentDate = new Date();
  const daysRemaining = Math.floor((journeyDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Check refund eligibility based on refund policy
  if (daysRemaining >= refundPolicy.fullRefundBeforeDays) {
    // Full refund
    return { isEligible: true, amount: booking.totalPriceLKR, isFullRefund: true };
  } else if (daysRemaining >= refundPolicy.partialRefundBeforeDays) {
    // Partial refund
    const refundAmount = booking.totalPriceLKR * (refundPolicy.partialRefundPercentage / 100);
    return { isEligible: true, amount: refundAmount, isFullRefund: false };
  } else if (daysRemaining >= refundPolicy.noRefundBeforeDays) {
    // No refund, but can still cancel
    return { isEligible: false, amount: 0, isFullRefund: false };
  } else {
    // No cancellation allowed
    return { isEligible: false, amount: 0, isFullRefund: false };
  }
};

export const mockBookingService = {
  // Get all bookings (for admin use)
  getAll: async (): Promise<Booking[]> => {
    await delay(300);
    
    // Populate related entities
    const bookingsWithDetails = bookingsList.map(booking => {
      // Get user
      const user = booking.userId ? users.find(u => u.id === booking.userId) : undefined;
      
      // Get journey
      const journey = journeys.find(j => j.id === booking.journeyId);
      
      // Get package
      const pkg = packages.find(p => p.id === booking.packageId);
      
      return {
        ...booking,
        user,
        journey,
        package: pkg,
      };
    });
    
    return [...bookingsWithDetails];
  },
  
  // Get booking by ID (for admin use)
  getById: async (id: string): Promise<Booking> => {
    await delay(200);
    
    const booking = bookingsList.find(booking => booking.id === id);
    
    if (!booking) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    // Get user if userId exists
    const user = booking.userId ? users.find(u => u.id === booking.userId) : undefined;
    
    // Get journey
    const journey = journeys.find(j => j.id === booking.journeyId);
    
    // Get package
    const pkg = packages.find(p => p.id === booking.packageId);
    
    return {
      ...booking,
      user,
      journey,
      package: pkg,
    };
  },
  
  // Verify and get booking by access token (for public access)
  getByAccessToken: async (token: string): Promise<BookingTokenVerifyResponse> => {
    await delay(200);
    
    const booking = bookingsList.find(booking => booking.accessToken === token);
    
    if (!booking) {
      return { isValid: false };
    }
    
    // Get journey
    const journey = journeys.find(j => j.id === booking.journeyId);
    
    // Get package
    const pkg = packages.find(p => p.id === booking.packageId);
    
    return {
      isValid: true,
      booking: {
        ...booking,
        journey,
        package: pkg,
      }
    };
  },
  
  // Create a new booking
  create: async (bookingData: CreateBookingDTO): Promise<Booking> => {
    await delay(400);
    
    // Generate a new ID (in a real app, this would be done by the backend)
    const newId = (Math.max(...bookingsList.map(b => parseInt(b.id)), 0) + 1).toString();
    
    // Generate a unique access token
    const accessToken = generateAccessToken();
    
    // Get package to calculate price
    const pkg = packages.find(p => p.id === bookingData.packageId);
    
    if (!pkg) {
      throw new Error(`Package with ID ${bookingData.packageId} not found`);
    }
    
    // Calculate total price
    const totalPriceLKR = pkg.priceLKR * bookingData.guestCount;
    const totalPriceUSD = Math.round(totalPriceLKR * EXCHANGE_RATE_LKR_TO_USD);
    
    // Create payment record (assuming a pending payment)
    const paymentId = `payment_${Date.now()}`;
    
    const newBooking: Booking = {
      id: newId,
      userId: bookingData.userId, // Optional - might be undefined for public bookings
      accessToken,
      journeyId: bookingData.journeyId,
      packageId: bookingData.packageId,
      bookingDate: new Date().toISOString().split('T')[0],
      journeyDate: bookingData.journeyDate,
      status: 'pending',
      guestCount: bookingData.guestCount,
      totalPriceLKR,
      totalPriceUSD,
      specialRequests: bookingData.specialRequests,
      payments: [
        {
          id: paymentId,
          amount: totalPriceLKR,
          currency: 'LKR',
          method: 'card', // Default method
          status: 'pending',
          timestamp: new Date().toISOString()
        }
      ],
      contactInfo: bookingData.contactInfo,
    };
    
    bookingsList.push(newBooking);
    
    // Get user, journey, and package for response
    const user = newBooking.userId ? users.find(u => u.id === newBooking.userId) : undefined;
    const journey = journeys.find(j => j.id === newBooking.journeyId);
    
    return {
      ...newBooking,
      user,
      journey,
      package: pkg,
    };
  },
  
  // Update an existing booking (can be used by admin or via access token)
  update: async (id: string, bookingData: UpdateBookingDTO): Promise<Booking> => {
    await delay(400);
    
    const index = bookingsList.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    // Update the booking
    const updatedBooking = {
      ...bookingsList[index],
      ...bookingData,
      // Handle nested contactInfo object
      contactInfo: bookingData.contactInfo 
        ? { ...bookingsList[index].contactInfo, ...bookingData.contactInfo }
        : bookingsList[index].contactInfo
    };
    
    bookingsList[index] = updatedBooking;
    
    // Get user, journey, and package for response
    const user = updatedBooking.userId ? users.find(u => u.id === updatedBooking.userId) : undefined;
    const journey = journeys.find(j => j.id === updatedBooking.journeyId);
    const pkg = packages.find(p => p.id === updatedBooking.packageId);
    
    return {
      ...updatedBooking,
      user,
      journey,
      package: pkg,
    };
  },
  
  // Update a booking by access token (for public access)
  updateByAccessToken: async (token: string, bookingData: UpdateBookingDTO): Promise<BookingTokenVerifyResponse> => {
    await delay(400);
    
    const booking = bookingsList.find(booking => booking.accessToken === token);
    
    if (!booking) {
      return { isValid: false };
    }
    
    const index = bookingsList.findIndex(booking => booking.accessToken === token);
    
    // Update the booking
    const updatedBooking = {
      ...bookingsList[index],
      ...bookingData,
      // Handle nested contactInfo object
      contactInfo: bookingData.contactInfo 
        ? { ...bookingsList[index].contactInfo, ...bookingData.contactInfo }
        : bookingsList[index].contactInfo
    };
    
    bookingsList[index] = updatedBooking;
    
    // Get journey and package for response
    const journey = journeys.find(j => j.id === updatedBooking.journeyId);
    const pkg = packages.find(p => p.id === updatedBooking.packageId);
    
    return {
      isValid: true,
      booking: {
        ...updatedBooking,
        journey,
        package: pkg,
      }
    };
  },
  
  // Process refund for a booking
  processRefund: async (id: string, refundData: ProcessRefundDTO): Promise<Booking> => {
    await delay(500);
    
    const index = bookingsList.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    const booking = bookingsList[index];
    
    // Check refund eligibility
    let refundAmount: number;
    let isFullRefund: boolean;
    
    if (refundData.fullRefund !== undefined) {
      // Force a specific refund type if specified
      isFullRefund = refundData.fullRefund;
      refundAmount = isFullRefund ? booking.totalPriceLKR : booking.totalPriceLKR * (refundPolicy.partialRefundPercentage / 100);
    } else {
      // Calculate based on policy
      const refundInfo = calculateRefundAmount(booking);
      
      if (!refundInfo.isEligible) {
        throw new Error('Booking is not eligible for refund based on the current refund policy');
      }
      
      refundAmount = refundInfo.amount;
      isFullRefund = refundInfo.isFullRefund;
    }
    
    // Update payment status
    const updatedPayments = booking.payments.map(payment => ({
      ...payment,
      status: 'refunded' as const
    }));
    
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      status: 'refunded',
      refundedAmount: refundAmount,
      refundDate: new Date().toISOString().split('T')[0],
      refundReason: refundData.reason,
      payments: updatedPayments
    };
    
    bookingsList[index] = updatedBooking;
    
    // Get user, journey, and package for response
    const user = updatedBooking.userId ? users.find(u => u.id === updatedBooking.userId) : undefined;
    const journey = journeys.find(j => j.id === updatedBooking.journeyId);
    const pkg = packages.find(p => p.id === updatedBooking.packageId);
    
    return {
      ...updatedBooking,
      user,
      journey,
      package: pkg,
    };
  },
  
  // Process refund for a booking by access token (for public access)
  processRefundByAccessToken: async (token: string, refundData: ProcessRefundDTO): Promise<BookingTokenVerifyResponse> => {
    await delay(500);
    
    const booking = bookingsList.find(booking => booking.accessToken === token);
    
    if (!booking) {
      return { isValid: false };
    }
    
    const index = bookingsList.findIndex(booking => booking.accessToken === token);
    
    // Check refund eligibility
    let refundAmount: number;
    let isFullRefund: boolean;
    
    if (refundData.fullRefund !== undefined) {
      // Force a specific refund type if specified
      isFullRefund = refundData.fullRefund;
      refundAmount = isFullRefund ? booking.totalPriceLKR : booking.totalPriceLKR * (refundPolicy.partialRefundPercentage / 100);
    } else {
      // Calculate based on policy
      const refundInfo = calculateRefundAmount(booking);
      
      if (!refundInfo.isEligible) {
        // Return valid response but with unchanged booking
        const journey = journeys.find(j => j.id === booking.journeyId);
        const pkg = packages.find(p => p.id === booking.packageId);
        
        return {
          isValid: true,
          booking: {
            ...booking,
            journey,
            package: pkg,
          }
        };
      }
      
      refundAmount = refundInfo.amount;
      isFullRefund = refundInfo.isFullRefund;
    }
    
    // Update payment status
    const updatedPayments = booking.payments.map(payment => ({
      ...payment,
      status: 'refunded' as const
    }));
    
    // Update the booking
    const updatedBooking: Booking = {
      ...booking,
      status: 'refunded',
      refundedAmount: refundAmount,
      refundDate: new Date().toISOString().split('T')[0],
      refundReason: refundData.reason,
      payments: updatedPayments
    };
    
    bookingsList[index] = updatedBooking;
    
    // Get journey and package for response
    const journey = journeys.find(j => j.id === updatedBooking.journeyId);
    const pkg = packages.find(p => p.id === updatedBooking.packageId);
    
    return {
      isValid: true,
      booking: {
        ...updatedBooking,
        journey,
        package: pkg,
      }
    };
  },
  
  // Cancel a booking (for admin use)
  cancelBooking: async (id: string, reason: string): Promise<Booking> => {
    await delay(300);
    
    const index = bookingsList.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    const booking = bookingsList[index];
    
    // Check if the booking can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      throw new Error(`Cannot cancel a booking with status: ${booking.status}`);
    }
    
    // Update the booking status
    const updatedBooking: Booking = {
      ...booking,
      status: 'cancelled',
      refundReason: reason
    };
    
    bookingsList[index] = updatedBooking;
    
    // Get user, journey, and package for response
    const user = updatedBooking.userId ? users.find(u => u.id === updatedBooking.userId) : undefined;
    const journey = journeys.find(j => j.id === updatedBooking.journeyId);
    const pkg = packages.find(p => p.id === updatedBooking.packageId);
    
    return {
      ...updatedBooking,
      user,
      journey,
      package: pkg,
    };
  },
  
  // Cancel a booking by access token (for public access)
  cancelBookingByAccessToken: async (token: string, reason: string): Promise<BookingTokenVerifyResponse> => {
    await delay(300);
    
    const booking = bookingsList.find(booking => booking.accessToken === token);
    
    if (!booking) {
      return { isValid: false };
    }
    
    const index = bookingsList.findIndex(booking => booking.accessToken === token);
    
    // Check if the booking can be cancelled
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      // Return valid response but with unchanged booking
      const journey = journeys.find(j => j.id === booking.journeyId);
      const pkg = packages.find(p => p.id === booking.packageId);
      
      return {
        isValid: true,
        booking: {
          ...booking,
          journey,
          package: pkg,
        }
      };
    }
    
    // Update the booking status
    const updatedBooking: Booking = {
      ...booking,
      status: 'cancelled',
      refundReason: reason
    };
    
    bookingsList[index] = updatedBooking;
    
    // Get journey and package for response
    const journey = journeys.find(j => j.id === updatedBooking.journeyId);
    const pkg = packages.find(p => p.id === updatedBooking.packageId);
    
    return {
      isValid: true,
      booking: {
        ...updatedBooking,
        journey,
        package: pkg,
      }
    };
  },
  
  // Change booking status (for admin use)
  changeStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
    await delay(300);
    
    const index = bookingsList.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    // Update the booking status
    const updatedBooking = {
      ...bookingsList[index],
      status,
    };
    
    bookingsList[index] = updatedBooking;
    
    // Get user, journey, and package for response
    const user = updatedBooking.userId ? users.find(u => u.id === updatedBooking.userId) : undefined;
    const journey = journeys.find(j => j.id === updatedBooking.journeyId);
    const pkg = packages.find(p => p.id === updatedBooking.packageId);
    
    return {
      ...updatedBooking,
      user,
      journey,
      package: pkg,
    };
  },
  
  // Delete a booking (admin only)
  delete: async (id: string): Promise<void> => {
    await delay(300);
    
    const index = bookingsList.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    // Remove the booking from the list
    bookingsList = bookingsList.filter(booking => booking.id !== id);
  },
  
  // Get refund policy
  getRefundPolicy: async (): Promise<typeof refundPolicy> => {
    await delay(100);
    return { ...refundPolicy };
  },
  
  // Update refund policy (admin only)
  updateRefundPolicy: async (updatedPolicy: Partial<typeof refundPolicy>): Promise<typeof refundPolicy> => {
    await delay(200);
    
    // In a real implementation, this would update the policy in the database
    // Here we're just returning the mock object
    return { ...refundPolicy, ...updatedPolicy };
  },
};