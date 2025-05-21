import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/booking.service';
import { Booking, BookingStatus } from '../../types/booking.types';

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('');
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
  const [refundPolicy, setRefundPolicy] = useState<any>(null);
  const [bookingUrl, setBookingUrl] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    
    fetchBooking();
    fetchRefundPolicy();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getById(id!);
      setBooking(data);
      
      // Generate the booking URL for public access
      const baseUrl = window.location.origin;
      setBookingUrl(`${baseUrl}/booking/${data.accessToken}`);
      
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

  const handleChangeStatus = async (newStatus: BookingStatus) => {
    if (!booking) return;

    try {
      setLoading(true);
      await bookingService.changeStatus(booking.id, newStatus);
      fetchBooking();
    } catch (error: any) {
      setError(error.message || 'Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !cancelReason.trim()) return;

    try {
      setLoading(true);
      await bookingService.cancelBooking(booking.id, cancelReason);
      setShowCancelModal(false);
      fetchBooking();
    } catch (error: any) {
      setError(error.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async (fullRefund: boolean | undefined = undefined) => {
    if (!booking || !refundReason.trim()) return;

    try {
      setLoading(true);
      await bookingService.processRefund(booking.id, { 
        reason: refundReason,
        fullRefund
      });
      setShowRefundModal(false);
      fetchBooking();
    } catch (error: any) {
      setError(error.message || 'Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!booking || !window.confirm('Are you sure you want to delete this booking?')) return;

    try {
      setLoading(true);
      await bookingService.delete(booking.id);
      navigate('/bookings');
    } catch (error: any) {
      setError(error.message || 'Failed to delete booking');
      setLoading(false);
    }
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    alert('Booking link copied to clipboard!');
  };

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

// Calculate refund eligibility (updated version for BookingDetailPage)
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
  } else if (daysRemaining >= refundPolicy.noRefundBeforeDays) {
    return { 
      eligible: false, 
      allowCancellation: true,
      message: `Customer can cancel, but no refund will be provided (${daysRemaining} days before journey)` 
    };
  } else {
    return { 
      eligible: false, 
      allowCancellation: false,
      message: `Cancellation is not allowed (less than ${refundPolicy.noRefundBeforeDays} days before journey)` 
    };
  }
};

  const refundEligibility = booking && refundPolicy ? calculateRefundEligibility() : null;

  if (loading && !booking) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <p className="text-sm text-red-700">{error}</p>
        <button
          onClick={() => navigate('/bookings')}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-700">Booking not found</p>
        <button
          onClick={() => navigate('/bookings')}
          className="mt-2 text-sm text-yellow-600 hover:text-yellow-800"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-teakwood-brown">Booking Details</h1>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        <div className="space-x-2 flex flex-wrap">
          {booking.status === 'pending' && (
            <button
              onClick={() => handleChangeStatus('confirmed')}
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Confirm
            </button>
          )}
          {(booking.status === 'confirmed' || booking.status === 'pending') && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          )}
          {(booking.status === 'confirmed' || booking.status === 'pending') && (
            <button
              onClick={() => setShowRefundModal(true)}
              className="py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              disabled={!refundEligibility?.eligible}
              title={!refundEligibility?.eligible ? refundEligibility?.message : 'Process refund'}
            >
              Process Refund
            </button>
          )}
          {booking.status === 'confirmed' && (
            <button
              onClick={() => handleChangeStatus('completed')}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Mark as Completed
            </button>
          )}
          <Link
            to={`/bookings/edit/${booking.id}`}
            className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <Link
            to="/bookings"
            className="py-2 px-4 border border-gray-300 rounded-md text-teakwood-brown hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Booking Access URL */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-ocean-mist">Booking Access URL:</span>
          <div className="flex flex-1 mx-4">
            <input
              type="text"
              value={bookingUrl}
              readOnly
              className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay text-sm"
            />
            <button
              onClick={copyBookingLink}
              className="px-4 py-2 bg-ceyora-clay text-white rounded-r-md hover:bg-ceyora-clay/90 transition-colors"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-ocean-mist">Share this link with the customer for them to access their booking details.</p>
        </div>
      </div>

      {/* Booking Information */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* Left Column - Booking Details */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-teakwood-brown mb-4">Booking Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-ocean-mist">Booking ID</p>
                <p className="mt-1 text-teakwood-brown">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ocean-mist">Booking Date</p>
                <p className="mt-1 text-teakwood-brown">{formatDate(booking.bookingDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ocean-mist">Journey Date</p>
                <p className="mt-1 text-teakwood-brown">{formatDate(booking.journeyDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ocean-mist">Number of Guests</p>
                <p className="mt-1 text-teakwood-brown">{booking.guestCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ocean-mist">Total Price</p>
                <p className="mt-1 text-teakwood-brown font-semibold">{formatCurrency(booking.totalPriceLKR, 'LKR')}</p>
                <p className="text-xs text-ocean-mist">{formatCurrency(booking.totalPriceUSD || 0, 'USD')}</p>
              </div>
              {booking.specialRequests && (
                <div>
                  <p className="text-sm font-medium text-ocean-mist">Special Requests</p>
                  <p className="mt-1 text-teakwood-brown">{booking.specialRequests}</p>
                </div>
              )}
              {booking.status === 'cancelled' && (
                <div>
                  <p className="text-sm font-medium text-ocean-mist">Cancellation Reason</p>
                  <p className="mt-1 text-teakwood-brown">{booking.refundReason || 'No reason provided'}</p>
                </div>
              )}
              {booking.status === 'refunded' && (
                <div>
                  <p className="text-sm font-medium text-ocean-mist">Refund Information</p>
                  <p className="mt-1 text-teakwood-brown">{formatCurrency(booking.refundedAmount || 0, 'LKR')} refunded on {booking.refundDate ? formatDate(booking.refundDate) : 'N/A'}</p>
                  <p className="mt-1 text-sm text-ocean-mist">Reason: {booking.refundReason || 'No reason provided'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Guest & Journey Details */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-teakwood-brown mb-4">Guest & Journey</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-ocean-mist">Guest Information</p>
                <p className="mt-1 text-teakwood-brown font-medium">{booking.contactInfo.name}</p>
                <p className="text-sm text-ocean-mist">{booking.contactInfo.email}</p>
                <p className="text-sm text-ocean-mist">{booking.contactInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ocean-mist">Journey</p>
                <p className="mt-1 text-teakwood-brown font-medium">{booking.journey?.title || 'Unknown Journey'}</p>
                <p className="text-sm text-ocean-mist">{booking.journey?.subtitle || ''}</p>
                <p className="text-sm text-ocean-mist">Location: {booking.journey?.location?.name || 'Unknown Location'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ocean-mist">Package</p>
                <p className="mt-1 text-teakwood-brown font-medium">{booking.package?.name || 'Unknown Package'}</p>
                <p className="text-sm text-ocean-mist">Duration: {booking.package?.duration?.duration || 'N/A'}</p>
                <p className="text-sm text-ocean-mist">Price per guest: {formatCurrency(booking.package?.priceLKR || 0, 'LKR')}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Details */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-teakwood-brown mb-4">Payment Details</h2>
            <div className="space-y-4">
              {booking.payments.map((payment, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-teakwood-brown">{formatCurrency(payment.amount, payment.currency)}</p>
                    <p className={`text-xs px-2 py-0.5 rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      payment.status === 'refunded' ? 'bg-purple-100 text-purple-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>{payment.status}</p>
                  </div>
                  <p className="text-xs text-ocean-mist">Method: {payment.method}</p>
                  {payment.transactionId && (
                    <p className="text-xs text-ocean-mist">Transaction ID: {payment.transactionId}</p>
                  )}
                  <p className="text-xs text-ocean-mist">Date: {new Date(payment.timestamp).toLocaleString()}</p>
                </div>
              ))}
              
              {/* Refund Eligibility Information */}
              {(booking.status === 'confirmed' || booking.status === 'pending') && refundEligibility && (
                <div className={`mt-4 p-3 border rounded-md ${
                  refundEligibility.eligible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <p className={`text-sm font-medium ${
                    refundEligibility.eligible ? 'text-green-800' : 'text-red-800'
                  }`}>Refund Eligibility</p>
                  <p className="text-sm">{refundEligibility.message}</p>
                  {refundEligibility.eligible && !refundEligibility.fullRefund && (
                    <p className="text-sm mt-1">
                      Refund amount: {formatCurrency(booking.totalPriceLKR * (refundEligibility.partialPercentage! / 100), 'LKR')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-40"></div>
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-teakwood-brown mb-4">Cancel Booking</h3>
            <p className="mb-4 text-ocean-mist">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            
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

      {/* Process Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-40"></div>
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-teakwood-brown mb-4">Process Refund</h3>
            <p className="mb-4 text-ocean-mist">Please provide a reason for the refund.</p>
            
            {refundEligibility?.eligible && (
              <div className={`mb-4 p-3 rounded-md ${refundEligibility.fullRefund ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <p className="text-sm font-medium">
                  {refundEligibility.fullRefund 
                    ? `Eligible for full refund: ${formatCurrency(booking.totalPriceLKR, 'LKR')}`
                    : `Eligible for partial refund (${refundEligibility.partialPercentage}%): ${formatCurrency(booking.totalPriceLKR * (refundEligibility.partialPercentage! / 100), 'LKR')}`
                  }
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="refundReason" className="block text-sm font-medium text-ocean-mist mb-1">
                Reason for Refund
              </label>
              <textarea
                id="refundReason"
                rows={3}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-teakwood-brown hover:bg-gray-50"
              >
                Cancel
              </button>
              {!refundEligibility?.fullRefund && refundEligibility?.eligible && (
                <button
                  onClick={() => handleProcessRefund(true)}
                  disabled={!refundReason.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Issue Full Refund
                </button>
              )}
              <button
                onClick={() => handleProcessRefund(undefined)}
                disabled={!refundReason.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refundEligibility?.fullRefund ? 'Process Full Refund' : 'Process Partial Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailPage;