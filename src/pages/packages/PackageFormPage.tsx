import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packageService } from '../../services/package.service';
import { durationService } from '../../services/duration.service';
import { Package, CreatePackageDTO, UpdatePackageDTO } from '../../types/package.types';
import { Duration } from '../../types/duration.types';

const PackageFormPage: React.FC = () => {
  const { journeyId, packageId } = useParams<{ journeyId: string; packageId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!packageId;
  
  const [pkg, setPkg] = useState<Partial<Package>>({
    journeyId: journeyId || '',
    name: '',
    priceLKR: 0,
    description: '',
    durationId: '',
    inclusions: [],
    maxGuests: 1,
  });
  
  const [durations, setDurations] = useState<Duration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // For adding new inclusions
  const [newInclusion, setNewInclusion] = useState<string>('');
  
  // Exchange rate for preview
  const LKR_TO_USD_RATE = 0.00333;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch durations
        const durationsData = await durationService.getAll();
        setDurations(durationsData);
        
        // In edit mode, fetch the package
        if (isEditMode && packageId) {
          const packageData = await packageService.getById(packageId);
          setPkg(packageData);
        }
        
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [journeyId, packageId, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'priceLKR' || name === 'maxGuests') {
      setPkg(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setPkg(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddInclusion = () => {
    if (!newInclusion.trim()) return;
    
    setPkg(prev => ({
      ...prev,
      inclusions: [...(prev.inclusions || []), newInclusion.trim()],
    }));
    
    setNewInclusion('');
  };

  const handleRemoveInclusion = (index: number) => {
    setPkg(prev => ({
      ...prev,
      inclusions: (prev.inclusions || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Validate required fields
      const requiredFields = [
        'name', 'priceLKR', 'description', 'durationId', 'maxGuests'
      ];
      
      for (const field of requiredFields) {
        if (!pkg[field as keyof Package]) {
          throw new Error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        }
      }
      
      if (!(pkg.inclusions || []).length) {
        throw new Error('At least one inclusion is required');
      }
      
      // Create or update package
      if (isEditMode && packageId) {
        // Extract only the fields needed for update
        const { id: pkgId, journeyId: jId, duration, priceUSD, ...updateData } = pkg as Package;
        await packageService.update(packageId, updateData as UpdatePackageDTO);
      } else {
        await packageService.create(pkg as CreatePackageDTO);
      }
      
      // Navigate back to journey detail page
      navigate(`/journeys/${journeyId}`);
    } catch (error: any) {
      setError(error.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate USD price for preview
  const usdPrice = pkg.priceLKR ? (pkg.priceLKR * LKR_TO_USD_RATE).toFixed(2) : '0.00';

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
        <h1 className="text-2xl font-bold text-teakwood-brown">
          {isEditMode ? 'Edit Package' : 'Add New Package'}
        </h1>
        <button
          onClick={() => navigate(`/journeys/${journeyId}`)}
          className="py-2 px-4 border border-gray-300 rounded-md text-teakwood-brown hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Package Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ocean-mist mb-1">
                Package Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={pkg.name || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="durationId" className="block text-sm font-medium text-ocean-mist mb-1">
                Duration *
              </label>
              <select
                id="durationId"
                name="durationId"
                value={pkg.durationId || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              >
                <option value="">Select a duration</option>
                {durations.map(duration => (
                  <option key={duration.id} value={duration.id}>
                    {duration.duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Price in LKR */}
            <div>
              <label htmlFor="priceLKR" className="block text-sm font-medium text-ocean-mist mb-1">
                Price (LKR) *
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Rs</span>
                </div>
                <input
                  id="priceLKR"
                  name="priceLKR"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pkg.priceLKR || ''}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-xs text-gray-500">~${usdPrice} USD</span>
                </div>
              </div>
            </div>

            {/* Max Guests */}
            <div>
              <label htmlFor="maxGuests" className="block text-sm font-medium text-ocean-mist mb-1">
                Maximum Guests *
              </label>
              <input
                id="maxGuests"
                name="maxGuests"
                type="number"
                min="1"
                value={pkg.maxGuests || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
          </div>
          
          {/* Hidden Status */}
        <div className="flex items-center">
          <input
            id="hidden"
            name="hidden"
            type="checkbox"
            checked={pkg.hidden || false}
            onChange={(e) => setPkg(prev => ({ ...prev, hidden: e.target.checked }))}
            className="h-4 w-4 text-ceyora-clay focus:ring-ceyora-clay border-gray-300 rounded"
          />
          <label htmlFor="hidden" className="ml-2 block text-sm text-teakwood-brown">
            Hide this package (will not be visible to users)
          </label>
        </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-ocean-mist mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={pkg.description || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              required
            />
          </div>

          {/* Inclusions */}
          <div>
            <label className="block text-sm font-medium text-ocean-mist mb-2">
              Inclusions * <span className="text-xs font-normal">(e.g., "Guided tour", "Lunch", "Transfer")</span>
            </label>
            
            {/* Current Inclusions */}
            {(pkg.inclusions || []).length > 0 && (
              <div className="mb-3">
                <ul className="space-y-2">
                  {(pkg.inclusions || []).map((inclusion, index) => (
                    <li key={index} className="flex items-center bg-gray-50 p-2 rounded-md">
                      <span className="flex-grow text-teakwood-brown">{inclusion}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Add New Inclusion */}
            <div className="flex">
              <input
                type="text"
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                placeholder="Add an inclusion"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              />
              <button
                type="button"
                onClick={handleAddInclusion}
                className="px-4 py-2 bg-ceyora-clay text-white rounded-r-md hover:bg-ceyora-clay/90 transition-colors"
              >
                Add
              </button>
            </div>
            
            {(pkg.inclusions || []).length === 0 && (
              <p className="mt-1 text-xs text-red-500">At least one inclusion is required</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageFormPage;