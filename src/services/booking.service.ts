// src/services/booking.service.ts (updated)
import { Booking, CreateBookingDTO, UpdateBookingDTO, ProcessRefundDTO, BookingStatus, RefundPolicy, BookingTokenVerifyResponse } from '../types/booking.types';
import { mockBookingService } from '../mocks';
// Uncomment for real API implementation
// import apiClient from '../api/apiClient';

/**
 * Booking Service
 * This service handles operations related to bookings.
 */
export const bookingService = {
  /**
   * Get all bookings (admin use)
   */
  getAll: async (): Promise<Booking[]> => {
    try {
      // Currently using mock data for development
      return await mockBookingService.getAll();
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.getAll();
      } else {
        const response = await apiClient.get<Booking[]>('/bookings');
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch bookings');
    }
  },
  
  /**
   * Get booking by ID (admin use)
   */
  getById: async (id: string): Promise<Booking> => {
    try {
      return await mockBookingService.getById(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.getById(id);
      } else {
        const response = await apiClient.get<Booking>(`/bookings/${id}`);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to fetch booking with ID ${id}`);
    }
  },
  
  /**
   * Get booking by access token (public use)
   */
  getByAccessToken: async (token: string): Promise<BookingTokenVerifyResponse> => {
    try {
      return await mockBookingService.getByAccessToken(token);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.getByAccessToken(token);
      } else {
        const response = await apiClient.get<BookingTokenVerifyResponse>(`/bookings/verify/${token}`);
        return response.data;
      }
      */
    } catch (error: any) {
      return { isValid: false };
    }
  },
  
  /**
   * Create a new booking
   */
  create: async (bookingData: CreateBookingDTO): Promise<Booking> => {
    try {
      return await mockBookingService.create(bookingData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.create(bookingData);
      } else {
        const response = await apiClient.post<Booking>('/bookings', bookingData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create booking');
    }
  },
  
  /**
   * Update an existing booking (admin use)
   */
  update: async (id: string, bookingData: UpdateBookingDTO): Promise<Booking> => {
    try {
      return await mockBookingService.update(id, bookingData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.update(id, bookingData);
      } else {
        const response = await apiClient.put<Booking>(`/bookings/${id}`, bookingData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to update booking with ID ${id}`);
    }
  },
  
  /**
   * Update booking by access token (public use)
   */
  updateByAccessToken: async (token: string, bookingData: UpdateBookingDTO): Promise<BookingTokenVerifyResponse> => {
    try {
      return await mockBookingService.updateByAccessToken(token, bookingData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.updateByAccessToken(token, bookingData);
      } else {
        const response = await apiClient.put<BookingTokenVerifyResponse>(`/bookings/access/${token}`, bookingData);
        return response.data;
      }
      */
    } catch (error: any) {
      return { isValid: false };
    }
  },
  
  /**
   * Process refund for a booking (admin use)
   */
  processRefund: async (id: string, refundData: ProcessRefundDTO): Promise<Booking> => {
    try {
      return await mockBookingService.processRefund(id, refundData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.processRefund(id, refundData);
      } else {
        const response = await apiClient.post<Booking>(`/bookings/${id}/refund`, refundData);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to process refund for booking with ID ${id}`);
    }
  },
  
  /**
   * Process refund by access token (public use)
   */
  processRefundByAccessToken: async (token: string, refundData: ProcessRefundDTO): Promise<BookingTokenVerifyResponse> => {
    try {
      return await mockBookingService.processRefundByAccessToken(token, refundData);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.processRefundByAccessToken(token, refundData);
      } else {
        const response = await apiClient.post<BookingTokenVerifyResponse>(`/bookings/access/${token}/refund`, refundData);
        return response.data;
      }
      */
    } catch (error: any) {
      return { isValid: false };
    }
  },
  
  /**
   * Cancel a booking (admin use)
   */
  cancelBooking: async (id: string, reason: string): Promise<Booking> => {
    try {
      return await mockBookingService.cancelBooking(id, reason);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.cancelBooking(id, reason);
      } else {
        const response = await apiClient.post<Booking>(`/bookings/${id}/cancel`, { reason });
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to cancel booking with ID ${id}`);
    }
  },
  
  /**
   * Cancel booking by access token (public use)
   */
  cancelBookingByAccessToken: async (token: string, reason: string): Promise<BookingTokenVerifyResponse> => {
    try {
      return await mockBookingService.cancelBookingByAccessToken(token, reason);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.cancelBookingByAccessToken(token, reason);
      } else {
        const response = await apiClient.post<BookingTokenVerifyResponse>(`/bookings/access/${token}/cancel`, { reason });
        return response.data;
      }
      */
    } catch (error: any) {
      return { isValid: false };
    }
  },
  
  /**
   * Change booking status (admin use)
   */
  changeStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
    try {
      return await mockBookingService.changeStatus(id, status);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.changeStatus(id, status);
      } else {
        const response = await apiClient.patch<Booking>(`/bookings/${id}/status`, { status });
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to change status for booking with ID ${id}`);
    }
  },
  
  /**
   * Delete a booking (admin only)
   */
  delete: async (id: string): Promise<void> => {
    try {
      await mockBookingService.delete(id);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        await mockBookingService.delete(id);
      } else {
        await apiClient.delete(`/bookings/${id}`);
      }
      */
    } catch (error: any) {
      throw new Error(error.message || `Failed to delete booking with ID ${id}`);
    }
  },
  
  /**
   * Get refund policy
   */
  getRefundPolicy: async (): Promise<RefundPolicy> => {
    try {
      return await mockBookingService.getRefundPolicy();
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.getRefundPolicy();
      } else {
        const response = await apiClient.get<RefundPolicy>('/settings/refund-policy');
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch refund policy');
    }
  },
  
  /**
   * Update refund policy (admin only)
   */
  updateRefundPolicy: async (updatedPolicy: Partial<RefundPolicy>): Promise<RefundPolicy> => {
    try {
      return await mockBookingService.updateRefundPolicy(updatedPolicy);
      
      // REAL API IMPLEMENTATION
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        return await mockBookingService.updateRefundPolicy(updatedPolicy);
      } else {
        const response = await apiClient.put<RefundPolicy>('/settings/refund-policy', updatedPolicy);
        return response.data;
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update refund policy');
    }
  },
};