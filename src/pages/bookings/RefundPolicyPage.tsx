import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/booking.service';
import { RefundPolicy } from '../../types/booking.types';

const RefundPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const [refundPolicy, setRefundPolicy] = useState<RefundPolicy>({
    fullRefundBeforeDays: 7,
    partialRefundBeforeDays: 3,
    noRefundBeforeDays: 1,
    partialRefundPercentage: 50
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRefundPolicy();
  }, []);

  const fetchRefundPolicy = async () => {
    try {
      setLoading(true);
      const policy = await bookingService.getRefundPolicy();
      setRefundPolicy(policy);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch refund policy');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRefundPolicy(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // Validate values
      if (refundPolicy.fullRefundBeforeDays <= refundPolicy.partialRefundBeforeDays) {
        throw new Error('Full refund days must be greater than partial refund days');
      }
      
      if (refundPolicy.partialRefundBeforeDays <= refundPolicy.noRefundBeforeDays) {
        throw new Error('Partial refund days must be greater than no refund days');
      }
      
      if (refundPolicy.noRefundBeforeDays < 0) {
        throw new Error('No refund days must be 0 or greater');
      }
      
      if (refundPolicy.partialRefundPercentage <= 0 || refundPolicy.partialRefundPercentage >= 100) {
        throw new Error('Partial refund percentage must be between 1 and 99');
      }
      
      const updatedPolicy = await bookingService.updateRefundPolicy(refundPolicy);
      setRefundPolicy(updatedPolicy);
      setSuccess('Refund policy updated successfully');
    } catch (error: any) {
      setError(error.message || 'Failed to update refund policy');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teakwood-brown">Refund Policy Settings</h1>
        <button
          onClick={() => navigate('/bookings')}
          className="py-2 px-4 border border-gray-300 rounded-md text-teakwood-brown hover:bg-gray-50 transition-colors"
        >
          Back to Bookings
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Refund Days */}
            <div>
              <label htmlFor="fullRefundBeforeDays" className="block text-sm font-medium text-ocean-mist mb-1">
                Full Refund if Cancelled Before
              </label>
              <div className="flex">
                <input
                  id="fullRefundBeforeDays"
                  name="fullRefundBeforeDays"
                  type="number"
                  min="1"
                  max="90"
                  value={refundPolicy.fullRefundBeforeDays}
                  onChange={handleChange}
                  className="block w-24 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                />
                <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                  days
                </span>
              </div>
              <p className="mt-1 text-xs text-ocean-mist">
                Customers will receive a full refund if they cancel {refundPolicy.fullRefundBeforeDays} days or more before the journey date.
              </p>
            </div>

            {/* Partial Refund Days */}
            <div>
              <label htmlFor="partialRefundBeforeDays" className="block text-sm font-medium text-ocean-mist mb-1">
                Partial Refund if Cancelled Before
              </label>
              <div className="flex">
                <input
                  id="partialRefundBeforeDays"
                  name="partialRefundBeforeDays"
                  type="number"
                  min="1"
                  max="30"
                  value={refundPolicy.partialRefundBeforeDays}
                  onChange={handleChange}
                  className="block w-24 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                />
                <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                  days
                </span>
              </div>
              <p className="mt-1 text-xs text-ocean-mist">
                Customers will receive a partial refund if they cancel between {refundPolicy.partialRefundBeforeDays} and {refundPolicy.fullRefundBeforeDays-1} days before the journey date.
              </p>
            </div>

            {/* No Refund Days - NEW FIELD */}
            <div>
              <label htmlFor="noRefundBeforeDays" className="block text-sm font-medium text-ocean-mist mb-1">
                No Refund if Cancelled Before
              </label>
              <div className="flex">
                <input
                  id="noRefundBeforeDays"
                  name="noRefundBeforeDays"
                  type="number"
                  min="0"
                  max="30"
                  value={refundPolicy.noRefundBeforeDays}
                  onChange={handleChange}
                  className="block w-24 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                />
                <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                  days
                </span>
              </div>
              <p className="mt-1 text-xs text-ocean-mist">
                Customers can cancel without refund if they cancel between {refundPolicy.noRefundBeforeDays} and {refundPolicy.partialRefundBeforeDays-1} days before the journey date.
              </p>
            </div>

            {/* Partial Refund Percentage */}
            <div>
              <label htmlFor="partialRefundPercentage" className="block text-sm font-medium text-ocean-mist mb-1">
                Partial Refund Percentage
              </label>
              <div className="flex">
                <input
                  id="partialRefundPercentage"
                  name="partialRefundPercentage"
                  type="number"
                  min="1"
                  max="99"
                  value={refundPolicy.partialRefundPercentage}
                  onChange={handleChange}
                  className="block w-24 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                />
                <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                  %
                </span>
              </div>
              <p className="mt-1 text-xs text-ocean-mist">
                The percentage of the total booking amount that will be refunded for partial refunds.
              </p>
            </div>
          </div>

          {/* No Refund / No Cancellation Policy */}
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-sm font-medium text-teakwood-brown mb-2">No Cancellation Policy</h3>
            <p className="text-sm text-ocean-mist">
              Bookings cannot be cancelled less than {refundPolicy.noRefundBeforeDays} days before the journey date.
            </p>
          </div>

          {/* Public Booking Instructions */}
          <div className="p-4 border border-gray-200 rounded-md bg-blue-50">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Public Booking Access</h3>
            <p className="text-sm text-blue-700 mb-2">
              Your system is configured to use token-based access links for public bookings. This allows users to access their booking details without an account.
            </p>
            <p className="text-sm text-blue-700">
              Each booking automatically generates a unique access URL. You can copy this link from the booking details page and send it to customers for them to view and manage their booking.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
            >
              {submitting ? 'Saving...' : 'Update Refund Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundPolicyPage;