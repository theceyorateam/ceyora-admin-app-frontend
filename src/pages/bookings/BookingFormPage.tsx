import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/booking.service';
import { journeyService } from '../../services/journey.service';
import { packageService } from '../../services/package.service';
import { Journey } from '../../types/journey.types';
import { Package } from '../../types/package.types';
import { Booking, CreateBookingDTO, UpdateBookingDTO } from '../../types/booking.types';

const BookingFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const isAdminView = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/bookings/');
  
  const [booking, setBooking] = useState<Partial<Booking>>({
    journeyId: '',
    packageId: '',
    journeyDate: '',
    guestCount: 1,
    specialRequests: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newBookingAccessUrl, setNewBookingAccessUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    // Filter packages based on selected journey
    if (booking.journeyId) {
      const journeyPackages = packages.filter(pkg => pkg.journeyId === booking.journeyId);
      setFilteredPackages(journeyPackages);
      
      // If current package is not part of the selected journey, reset it
      if (booking.packageId && !journeyPackages.some(pkg => pkg.id === booking.packageId)) {
        setBooking(prev => ({ ...prev, packageId: '' }));
      }
    } else {
      setFilteredPackages([]);
    }
  }, [booking.journeyId, packages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch journeys and packages
      const [journeysData, packagesData] = await Promise.all([
        journeyService.getAll(),
        packageService.getAll()
      ]);
      
      setJourneys(journeysData);
      setPackages(packagesData);
      
      // In edit mode, fetch the booking
      if (isEditMode && id) {
        const bookingData = await bookingService.getById(id);
        setBooking({
          ...bookingData,
          userId: bookingData.userId || undefined,
        });
      }
      
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('contactInfo.')) {
      const contactInfoField = name.split('.')[1];
      setBooking(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo!,
          [contactInfoField]: value
        }
      }));
    } else if (name === 'guestCount') {
      setBooking(prev => ({
        ...prev,
        [name]: parseInt(value) || 1
      }));
    } else {
      setBooking(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const calculatePrice = (): { totalPriceLKR: number; totalPriceUSD: number } => {
    if (!booking.packageId || !booking.guestCount) {
      return { totalPriceLKR: 0, totalPriceUSD: 0 };
    }
    
    const selectedPackage = packages.find(pkg => pkg.id === booking.packageId);
    if (!selectedPackage) {
      return { totalPriceLKR: 0, totalPriceUSD: 0 };
    }
    
    const totalPriceLKR = selectedPackage.priceLKR * booking.guestCount;
    const totalPriceUSD = (selectedPackage.priceUSD || 0) * booking.guestCount;
    
    return { totalPriceLKR, totalPriceUSD };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage(null);
      setNewBookingAccessUrl(null);
      
      // Validate required fields
      const requiredFields = [
        'journeyId', 'packageId', 'journeyDate', 'guestCount', 
        'contactInfo.name', 'contactInfo.email', 'contactInfo.phone'
      ];
      
      for (const field of requiredFields) {
        let value;
        
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          value = booking[parent as keyof typeof booking]?.[child as keyof typeof booking.contactInfo];
        } else {
          value = booking[field as keyof typeof booking];
        }
        
        if (!value) {
          throw new Error(`${field.replace(/([A-Z])/g, ' $1').replace(/\./g, ' ').replace(/^./, str => str.toUpperCase())} is required`);
        }
      }
      
      // Create or update booking
      if (isEditMode && id) {
        const { id: bookingId, journey, package: pkg, payments, user, accessToken, ...updateData } = booking as Booking;
        await bookingService.update(id, updateData as UpdateBookingDTO);
        
        // Show success message
        setSuccessMessage('Booking updated successfully');
        
        // If in admin view, navigate back to bookings list after a delay
        if (isAdminView) {
          setTimeout(() => {
            navigate('/bookings');
          }, 2000);
        }
      } else {
        // Create new booking (for public or admin)
        const newBooking = await bookingService.create(booking as CreateBookingDTO);
        
        // Generate booking access URL
        const baseUrl = window.location.origin;
        const accessUrl = `${baseUrl}/booking/${newBooking.accessToken}`;
        
        setNewBookingAccessUrl(accessUrl);
        setSuccessMessage('Booking created successfully!');
        
        // Clear form if not in admin view (public booking)
        if (!isAdminView) {
          setBooking({
            journeyId: '',
            packageId: '',
            journeyDate: '',
            guestCount: 1,
            specialRequests: '',
            contactInfo: {
              name: '',
              email: '',
              phone: ''
            }
          });
        } else {
          // If in admin view, navigate back to bookings list after a delay
          setTimeout(() => {
            navigate('/bookings');
          }, 3000);
        }
      }
    } catch (error: any) {
      setError(error.message || 'Failed to save booking');
    } finally {
      setSubmitting(false);
    }
  };

  const { totalPriceLKR, totalPriceUSD } = calculatePrice();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  return (
    <div className={isAdminView ? "space-y-6" : "min-h-screen bg-ceylon-cream py-12 px-4 sm:px-6 lg:px-8 space-y-6"}>
      <div className={isAdminView ? "flex justify-between items-center" : "max-w-4xl mx-auto flex justify-between items-center"}>
        <h1 className="text-2xl font-bold text-teakwood-brown">
          {isEditMode ? 'Edit Booking' : 'Book Your Journey'}
        </h1>
        {isAdminView && (
          <button
            onClick={() => navigate(isEditMode ? `/bookings/${id}` : '/bookings')}
            className="py-2 px-4 border border-gray-300 rounded-md text-teakwood-brown hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className={isAdminView ? "bg-red-50 border-l-4 border-red-400 p-4 rounded" : "max-w-4xl mx-auto bg-red-50 border-l-4 border-red-400 p-4 rounded"}>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className={isAdminView ? "bg-green-50 border-l-4 border-green-400 p-4 rounded" : "max-w-4xl mx-auto bg-green-50 border-l-4 border-green-400 p-4 rounded"}>
          <p className="text-sm text-green-700">{successMessage}</p>
          
          {newBookingAccessUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-green-700 mb-2">Booking URL (Share this with the customer):</p>
              <div className="flex items-center">
                <input
                  type="text"
                  value={newBookingAccessUrl}
                  readOnly
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(newBookingAccessUrl);
                    alert('Booking URL copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-ceyora-clay text-white rounded-r-md hover:bg-ceyora-clay/90 transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="mt-2 text-xs text-green-700">
                This URL allows the customer to view and manage their booking. Make sure to save it or send it to them.
              </p>
            </div>
          )}
        </div>
      )}

      <div className={isAdminView ? "bg-white rounded-lg shadow-sm p-6" : "max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Journey and Package Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Journey Selection */}
            <div>
              <label htmlFor="journeyId" className="block text-sm font-medium text-ocean-mist mb-1">
                Journey *
              </label>
              <select
                id="journeyId"
                name="journeyId"
                value={booking.journeyId || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
                disabled={successMessage !== null}
              >
                <option value="">Select a journey</option>
                {journeys.map(journey => (
                  <option key={journey.id} value={journey.id}>
                    {journey.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Package Selection */}
            <div>
              <label htmlFor="packageId" className="block text-sm font-medium text-ocean-mist mb-1">
                Package *
              </label>
              <select
                id="packageId"
                name="packageId"
                value={booking.packageId || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
                disabled={!booking.journeyId || successMessage !== null}
              >
                <option value="">Select a package</option>
                {filteredPackages.map(pkg => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.duration?.duration}) - LKR {pkg.priceLKR.toLocaleString()}
                  </option>
                ))}
              </select>
              {!booking.journeyId && (
                <p className="mt-1 text-xs text-ocean-mist">Please select a journey first</p>
              )}
            </div>

            {/* Journey Date */}
            <div>
              <label htmlFor="journeyDate" className="block text-sm font-medium text-ocean-mist mb-1">
                Journey Date *
              </label>
              <input
                id="journeyDate"
                name="journeyDate"
                type="date"
                value={booking.journeyDate || ''}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
                disabled={successMessage !== null}
              />
            </div>

            {/* Guest Count */}
            <div>
              <label htmlFor="guestCount" className="block text-sm font-medium text-ocean-mist mb-1">
                Number of Guests *
              </label>
              <input
                id="guestCount"
                name="guestCount"
                type="number"
                min="1"
                max="20"
                value={booking.guestCount || 1}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
                disabled={successMessage !== null}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-medium text-ocean-mist mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Guest Name */}
              <div>
                <label htmlFor="contactInfo.name" className="block text-sm font-medium text-ocean-mist mb-1">
                  Guest Name *
                </label>
                <input
                  id="contactInfo.name"
                  name="contactInfo.name"
                  type="text"
                  value={booking.contactInfo?.name || ''}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                  disabled={successMessage !== null}
                />
              </div>

              {/* Guest Email */}
              <div>
                <label htmlFor="contactInfo.email" className="block text-sm font-medium text-ocean-mist mb-1">
                  Email *
                </label>
                <input
                  id="contactInfo.email"
                  name="contactInfo.email"
                  type="email"
                  value={booking.contactInfo?.email || ''}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                  disabled={successMessage !== null}
                />
              </div>

              {/* Guest Phone */}
              <div>
                <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-ocean-mist mb-1">
                  Phone Number *
                </label>
                <input
                  id="contactInfo.phone"
                  name="contactInfo.phone"
                  type="tel"
                  value={booking.contactInfo?.phone || ''}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                  disabled={successMessage !== null}
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label htmlFor="specialRequests" className="block text-sm font-medium text-ocean-mist mb-1">
              Special Requests <span className="text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              rows={3}
              value={booking.specialRequests || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              disabled={successMessage !== null}
            />
          </div>

          {/* Price Summary */}
          {booking.packageId && (
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <h3 className="text-sm font-medium text-ocean-mist mb-2">Booking Summary</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-teakwood-brown">
                    {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'} × {
                      packages.find(pkg => pkg.id === booking.packageId)?.name || 'Selected package'
                    }
                  </p>
                  <p className="text-sm text-ocean-mist">
                    Journey date: {booking.journeyDate ? new Date(booking.journeyDate).toLocaleDateString() : 'Not selected'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-teakwood-brown">
                    LKR {totalPriceLKR.toLocaleString()}
                  </p>
                  <p className="text-xs text-ocean-mist">
                    USD {totalPriceUSD.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!successMessage && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
              >
                {submitting ? 'Saving...' : isEditMode ? 'Update Booking' : 'Complete Booking'}
              </button>
            </div>
          )}
        </form>

        {/* Success actions */}
        {successMessage && !isAdminView && !isEditMode && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                setSuccessMessage(null);
                setNewBookingAccessUrl(null);
              }}
              className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
            >
              Book Another Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFormPage;