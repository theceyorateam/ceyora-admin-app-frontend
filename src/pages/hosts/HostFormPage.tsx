import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hostService } from '../../services/host.service';
import { locationService } from '../../services/location.service';
import { Host, CreateHostDTO, UpdateHostDTO } from '../../types/host.types';
import { Location } from '../../types/location.types';

const HostFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [host, setHost] = useState<Partial<Host>>({
    firstName: '',
    lastName: '',
    locationId: '',
    address: '',
    description: '',
    registerDate: new Date().toISOString().split('T')[0],
    contactNumber1: '',
    contactNumber2: '',
    email: '',
    languages: [],
    profilePhoto: '',
  });
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getAll();
        setLocations(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch locations');
      }
    };

    const fetchHost = async () => {
      if (!isEditMode) return;
      
      try {
        const data = await hostService.getById(id);
        setHost(data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch host details');
      }
    };

    const initPage = async () => {
      setLoading(true);
      await fetchLocations();
      
      if (isEditMode) {
        await fetchHost();
      }
      
      setLoading(false);
    };

    initPage();
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setHost(prev => ({ ...prev, [name]: value }));
  };

  const handleAddLanguage = () => {
    if (!language.trim()) return;
    
    setHost(prev => ({
      ...prev,
      languages: [...(prev.languages || []), language.trim()]
    }));
    
    setLanguage('');
  };

  const handleRemoveLanguage = (index: number) => {
    setHost(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== index)
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
        'firstName', 'lastName', 'locationId', 'address', 
        'description', 'contactNumber1', 'email', 'profilePhoto'
      ];
      
      for (const field of requiredFields) {
        if (!host[field as keyof Host]) {
          throw new Error(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        }
      }
      
      if (!(host.languages || []).length) {
        throw new Error('At least one language is required');
      }
      
      if (isEditMode) {
        const { id: hostId, location, ...hostData } = host as Host;
        await hostService.update(id, hostData as UpdateHostDTO);
      } else {
        await hostService.create(host as CreateHostDTO);
      }
      
      // Navigate back to hosts list
      navigate('/hosts');
    } catch (error: any) {
      setError(error.message || 'Failed to save host');
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
        <h1 className="text-2xl font-bold text-teakwood-brown">
          {isEditMode ? 'Edit Host' : 'Add New Host'}
        </h1>
        <button
          onClick={() => navigate('/hosts')}
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
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-ocean-mist mb-1">
                First Name *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={host.firstName || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-ocean-mist mb-1">
                Last Name *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={host.lastName || ''}
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
                value={host.locationId || ''}
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

            {/* Register Date */}
            <div>
              <label htmlFor="registerDate" className="block text-sm font-medium text-ocean-mist mb-1">
                Register Date *
              </label>
              <input
                id="registerDate"
                name="registerDate"
                type="date"
                value={host.registerDate || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ocean-mist mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={host.email || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>

            {/* Contact Number 1 */}
            <div>
              <label htmlFor="contactNumber1" className="block text-sm font-medium text-ocean-mist mb-1">
                Primary Contact Number *
              </label>
              <input
                id="contactNumber1"
                name="contactNumber1"
                type="tel"
                value={host.contactNumber1 || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>

            {/* Contact Number 2 */}
            <div>
              <label htmlFor="contactNumber2" className="block text-sm font-medium text-ocean-mist mb-1">
                Secondary Contact Number (Optional)
              </label>
              <input
                id="contactNumber2"
                name="contactNumber2"
                type="tel"
                value={host.contactNumber2 || ''}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              />
            </div>

            {/* Profile Photo */}
            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-ocean-mist mb-1">
                Profile Photo URL (Google Drive link) *
              </label>
              <input
                id="profilePhoto"
                name="profilePhoto"
                type="url"
                value={host.profilePhoto || ''}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-ocean-mist mb-1">
              Address *
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={host.address || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              required
            />
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-ocean-mist mb-2">
              Languages *
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {(host.languages || []).map((lang, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ceyora-clay/10 text-ceyora-clay"
                >
                  {lang}
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(index)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-ceyora-clay hover:bg-ceyora-clay/20"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Add a language"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              />
              <button
                type="button"
                onClick={handleAddLanguage}
                className="px-4 py-2 bg-ceyora-clay text-white rounded-r-md hover:bg-ceyora-clay/90 transition-colors"
              >
                Add
              </button>
            </div>
            {(host.languages || []).length === 0 && (
              <p className="mt-1 text-xs text-red-500">At least one language is required</p>
            )}
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
              value={host.description || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Host'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostFormPage;