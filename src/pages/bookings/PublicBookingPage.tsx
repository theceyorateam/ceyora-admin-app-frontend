// src/pages/bookings/PublicBookingPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../../services/booking.service';
import { Booking, BookingStatus } from '../../types/booking.types';

const PublicBookingPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [refundPolicy, setRefundPolicy] = useState<any>(null);
  const [invalidToken, setInvalidToken] = useState<boolean>(false);

  useEffect(() => {
    if (!token) {
      setInvalidToken(true);
      setLoading(false);
      return;
    }
    
    fetchBooking();
    fetchRefundPolicy();
  }, [token]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getByAccessToken(token!);
      
      if (!response.isValid || !response.booking) {
        setInvalidToken(true);
        setLoading(false);
        return;
      }
      
      setBooking(response.booking);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundPolicy = async () => {
    try {
      const policy = await bookingService.getRefundPolicy();
      setRefundPolicy(policy);
    } catch (error: any) {
      console.error('Failed to fetch refund policy:', error);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !token || !cancelReason.trim()) return;

    try {
      setLoading(true);
      const response = await bookingService.cancelBookingByAccessToken(token, cancelReason);
      
      if (!response.isValid || !response.booking) {
        setError('Failed to cancel booking. Please try again later.');
        setLoading(false);
        return;
      }
      
      setBooking(response.booking);
      setShowCancelModal(false);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  // Calculate refund eligibility
  const calculateRefundEligibility = () => {
    if (!booking || !refundPolicy) return null;

    if (booking.status !== 'confirmed' && booking.status !== 'pending') {
      return { eligible: false, message: 'Only confirmed or pending bookings are eligible for refund.' };
    }

    const journeyDate = new Date(booking.journeyDate);
    const currentDate = new Date();
    const daysRemaining = Math.floor((journeyDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining >= refundPolicy.fullRefundBeforeDays) {
      return { 
        eligible: true, 
        fullRefund: true, 
        message: `Eligible for full refund (${daysRemaining} days before journey)` 
      };
    } else if (daysRemaining >= refundPolicy.partialRefundBeforeDays) {
      return { 
        eligible: true, 
        fullRefund: false, 
        partialPercentage: refundPolicy.partialRefundPercentage,
        message: `Eligible for partial refund (${refundPolicy.partialRefundPercentage}%)` 
      };
    } else {
      return { 
        eligible: false, 
        message: `No refund available (${daysRemaining} days before journey)` 
      };
    }
  };

  const refundEligibility = booking && refundPolicy ? calculateRefundEligibility() : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeClass = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ceylon-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  if (invalidToken) {
    return (
      <div className="min-h-screen bg-ceylon-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-2 text-xl font-semibold text-teakwood-brown">Invalid Booking Link</h2>
            <p className="mt-2 text-ocean-mist">This booking link is invalid or has expired. Please contact support for assistance.</p>
            <div className="mt-6">
              <Link
                to="/"
                className="px-4 py-2 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ceylon-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-2 text-xl font-semibold text-teakwood-brown">Error</h2>
            <p className="mt-2 text-ocean-mist">{error}</p>
            <div className="mt-6">
              <button 
                onClick={fetchBooking} 
                className="px-4 py-2 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-ceylon-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-2 text-xl font-semibold text-teakwood-brown">Booking Not Found</h2>
            <p className="mt-2 text-ocean-mist">We couldn{"'"}t find the booking you{"'"}re looking for.</p>
            <div className="mt-6">
              <Link
                to="/"
                className="px-4 py-2 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ceylon-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Booking Header */}
        <div className="bg-white p-6 rounded-t-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-xl font-bold text-teakwood-brown">Your Booking</h1>
              <p className="text-ocean-mist">Booking ID: {booking.id}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Journey Information */}
        <div className="bg-white p-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0">
              <img 
                src={booking.journey?.baseImage || '/api/placeholder/400/300'} 
                alt={booking.journey?.title}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="md:w-2/3 md:pl-6">
              <h2 className="text-lg font-semibold text-teakwood-brown">{booking.journey?.title}</h2>
              <p className="text-ocean-mist">{booking.journey?.subtitle}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-ocean-mist">Journey Date</p>
                  <p className="text-teakwood-brown">{formatDate(booking.journeyDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ocean-mist">Package</p>
                  <p className="text-teakwood-brown">{booking.package?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ocean-mist">Duration</p>
                  <p className="text-teakwood-brown">{booking.package?.duration?.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ocean-mist">Number of Guests</p>
                  <p className="text-teakwood-brown">{booking.guestCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Payment Information */}
        <div className="bg-white p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-teakwood-brown mb-4">Payment Information</h2>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:w-1/2">
              <p className="text-sm font-medium text-ocean-mist">Total Price</p>
              <p className="text-lg text-teakwood-brown font-bold">
                {formatCurrency(booking.totalPriceLKR, 'LKR')}
                <span className="text-sm font-normal text-ocean-mist ml-2">
                  ({formatCurrency(booking.totalPriceUSD || 0, 'USD')})
                </span>
              </p>
              
              {booking.status === 'refunded' && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-ocean-mist">Refund Amount</p>
                  <p className="text-teakwood-brown">
                    {formatCurrency(booking.refundedAmount || 0, 'LKR')}
                    <span className="text-sm text-ocean-mist ml-2">
                      Refunded on {booking.refundDate ? formatDate(booking.refundDate) : 'N/A'}
                    </span>
                  </p>
                </div>
              )}
              
              {(booking.status === 'confirmed' || booking.status === 'pending') && refundEligibility && (
                <div className={`mt-2 p-2 rounded text-sm ${
                  refundEligibility.eligible ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {refundEligibility.message}
                </div>
              )}
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
              <p className="text-sm font-medium text-ocean-mist">Payment Status</p>
              <div className="space-y-2">
                {booking.payments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-teakwood-brown">
                        {formatCurrency(payment.amount, payment.currency)} via {payment.method}
                      </p>
                      <p className="text-xs text-ocean-mist">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="bg-white p-6 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-teakwood-brown mb-4">Guest Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-ocean-mist">Name</p>
              <p className="text-teakwood-brown">{booking.contactInfo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-ocean-mist">Email</p>
              <p className="text-teakwood-brown">{booking.contactInfo.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-ocean-mist">Phone</p>
              <p className="text-teakwood-brown">{booking.contactInfo.phone}</p>
            </div>
          </div>
          
          {booking.specialRequests && (
            <div className="mt-4">
              <p className="text-sm font-medium text-ocean-mist">Special Requests</p>
              <p className="text-teakwood-brown">{booking.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 border-t border-gray-200 rounded-b-lg">
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            {(booking.status === 'confirmed' || booking.status === 'pending') && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="py-2 px-4 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                Cancel Booking
              </button>
            )}
            <Link
              to="/"
              className="text-center py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>

        {/* Cancel Booking Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-40"></div>
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-teakwood-brown mb-4">Cancel Booking</h3>
              <p className="mb-4 text-ocean-mist">Are you sure you want to cancel this booking?</p>
              
              {refundEligibility && (
                <div className={`mb-4 p-3 rounded-md ${
                  refundEligibility.eligible 
                    ? (refundEligibility.fullRefund ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800')
                    : 'bg-red-50 text-red-800'
                }`}>
                  <p className="text-sm">
                    {refundEligibility.message}
                  </p>
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="cancelReason" className="block text-sm font-medium text-ocean-mist mb-1">
                  Reason for Cancellation
                </label>
                <textarea
                  id="cancelReason"
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-teakwood-brown hover:bg-gray-50"
                >
                  No, Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={!cancelReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBookingPage;