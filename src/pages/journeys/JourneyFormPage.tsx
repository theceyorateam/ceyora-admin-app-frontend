import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { journeyService } from '../../services/journey.service';
import { locationService } from '../../services/location.service';
import { tagService } from '../../services/tag.service';
import { hostService } from '../../services/host.service';
import { Journey, CreateJourneyDTO, UpdateJourneyDTO } from '../../types/journey.types';
import { Location } from '../../types/location.types';
import { Tag } from '../../types/tag.types';
import { Host } from '../../types/host.types';

const JourneyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [journey, setJourney] = useState<Partial<Journey>>({
    title: '',
    subtitle: '',
    summary: '',
    description: '',
    locationId: '',
    priceLKR: 0,
    tagIds: [],
    baseImage: '',
    otherImages: [],
    hostId: '',
    hidden: false,
  });
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // For adding new images
  const [newImage, setNewImage] = useState<string>('');
  
  // Exchange rate for preview
  const LKR_TO_USD_RATE = 0.00333;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch reference data
        const [locationsData, tagsData, hostsData] = await Promise.all([
          locationService.getAll(),
          tagService.getAll(),
          hostService.getAll(),
        ]);
        
        setLocations(locationsData);
        setTags(tagsData);
        setHosts(hostsData);
        
        // In edit mode, fetch the journey
        if (isEditMode && id) {
          const journeyData = await journeyService.getById(id);
          setJourney({
            ...journeyData,
            // Extract IDs from populated data
            tagIds: journeyData.tagIds || (journeyData.tags?.map(tag => tag.id) || []),
          });
        }
        
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'priceLKR') {
      setJourney(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setJourney(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setJourney(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleTagChange = (tagId: string) => {
    setJourney(prev => {
      const tagIds = prev.tagIds || [];
      
      if (tagIds.includes(tagId)) {
        // Remove tag if already selected
        return {
          ...prev,
          tagIds: tagIds.filter(id => id !== tagId),
        };
      } else {
        // Add tag if not selected
        return {
          ...prev,
          tagIds: [...tagIds, tagId],
        };
      }
    });
  };

  const handleAddImage = () => {
    if (!newImage.trim()) return;
    
    setJourney(prev => ({
      ...prev,
      otherImages: [...(prev.otherImages || []), newImage.trim()],
    }));
    
    setNewImage('');
  };

  const handleRemoveImage = (index: number) => {
    setJourney(prev => ({
      ...prev,
      otherImages: (prev.otherImages || []).filter((_, i) => i !== index),
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
        'title', 'subtitle', 'summary', 'description', 
        'locationId', 'priceLKR', 'baseImage', 'hostId'
      ];
      
      for (const field of requiredFields) {
        if (!journey[field as keyof Journey]) {
          throw new Error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        }
      }
      
      if (!(journey.tagIds || []).length) {
        throw new Error('At least one tag is required');
      }
      
      // Create or update journey
      if (isEditMode && id) {
        // Extract only the fields needed for update
        const { id: journeyId, tags, location, host, packages, ...updateData } = journey as Journey;
        await journeyService.update(id, updateData as UpdateJourneyDTO);
      } else {
        await journeyService.create(journey as CreateJourneyDTO);
      }
      
      // Navigate back to journeys list
      navigate('/journeys');
    } catch (error: any) {
      setError(error.message || 'Failed to save journey');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate USD price for preview
  const usdPrice = journey.priceLKR ? (journey.priceLKR * LKR_TO_USD_RATE).toFixed(2) : '0.00';

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
          {isEditMode ? 'Edit Journey' : 'Create New Journey'}
        </h1>
        <button
          onClick={() => navigate(isEditMode ? `/journeys/${id}` : '/journeys')}
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-ocean-mist mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={journey.title || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-ocean-mist mb-1">
                Subtitle *
              </label>
              <input
                id="subtitle"
                name="subtitle"
                type="text"
                value={journey.subtitle || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="locationId" className="block text-sm font-medium text-ocean-mist mb-1">
                Location *
              </label>
              <select
                id="locationId"
                name="locationId"
                value={journey.locationId || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              >
                <option value="">Select a location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Host */}
            <div>
              <label htmlFor="hostId" className="block text-sm font-medium text-ocean-mist mb-1">
                Host *
              </label>
              <select
                id="hostId"
                name="hostId"
                value={journey.hostId || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              >
                <option value="">Select a host</option>
                {hosts.map(host => (
                  <option key={host.id} value={host.id}>
                    {host.firstName} {host.lastName}
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
                  value={journey.priceLKR || ''}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-xs text-gray-500">~${usdPrice} USD</span>
                </div>
              </div>
            </div>

            {/* Base Image */}
            <div>
              <label htmlFor="baseImage" className="block text-sm font-medium text-ocean-mist mb-1">
                Base Image URL (Google Drive link) *
              </label>
              <input
                id="baseImage"
                name="baseImage"
                type="url"
                value={journey.baseImage || ''}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-ocean-mist mb-1">
              Summary * <span className="text-xs font-normal">(Short description, 1-2 sentences)</span>
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={2}
              value={journey.summary || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              required
            />
          </div>

          {/* Full Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-ocean-mist mb-1">
              Description * <span className="text-xs font-normal">(Detailed information about the journey)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={journey.description || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-ocean-mist mb-2">
              Tags * <span className="text-xs font-normal">(Select at least one)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tags.map(tag => (
                <div key={tag.id} className="flex items-center">
                  <input
                    id={`tag-${tag.id}`}
                    type="checkbox"
                    checked={(journey.tagIds || []).includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="h-4 w-4 text-ceyora-clay focus:ring-ceyora-clay"
                  />
                  <label htmlFor={`tag-${tag.id}`} className="ml-2 text-sm text-teakwood-brown">
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
            {(journey.tagIds || []).length === 0 && (
              <p className="mt-1 text-xs text-red-500">At least one tag is required</p>
            )}
          </div>

          {/* Hidden Status */}
          <div className="flex items-center mt-6">
            <input
              id="hidden"
              name="hidden"
              type="checkbox"
              checked={journey.hidden || false}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-ceyora-clay focus:ring-ceyora-clay border-gray-300 rounded"
            />
            <label htmlFor="hidden" className="ml-2 block text-sm text-teakwood-brown">
              Hide this journey (will not be visible to users)
            </label>
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-ocean-mist mb-2">
              Additional Images <span className="text-xs font-normal">(Optional)</span>
            </label>
            
            {/* Current Images */}
            <div className="mb-2">
              <div className="text-xs text-ocean-mist mb-1">Current additional images:</div>
              {(journey.otherImages || []).length === 0 ? (
                <p className="text-sm text-ocean-mist">No additional images</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(journey.otherImages || []).map((image, index) => (
                    <div
                      key={index}
                      className="relative group border border-gray-200 rounded-md overflow-hidden"
                    >
                      <img
                        src={image || '/api/placeholder/100/100'}
                        alt={`Additional ${index + 1}`}
                        className="w-24 h-24 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/100/100';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Add New Image */}
            <div className="flex">
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add image URL (Google Drive link)"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-ceyora-clay text-white rounded-r-md hover:bg-ceyora-clay/90 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Journey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JourneyFormPage;