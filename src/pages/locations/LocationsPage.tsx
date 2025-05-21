import React, { useState, useEffect } from 'react';
import { locationService } from '../../services/location.service';
import { Location } from '../../types/location.types';

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [newLocationName, setNewLocationName] = useState<string>('');

  // Fetch locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Fetch all locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await locationService.getAll();
      setLocations(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  // Add new location
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;

    try {
      setLoading(true);
      await locationService.create({ name: newLocationName });
      setNewLocationName('');
      setShowAddForm(false);
      fetchLocations();
    } catch (error: any) {
      setError(error.message || 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  // Update location
  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation || !editingLocation.name.trim()) return;

    try {
      setLoading(true);
      await locationService.update(editingLocation.id, { name: editingLocation.name });
      setEditingLocation(null);
      fetchLocations();
    } catch (error: any) {
      setError(error.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  // Delete location
  const handleDeleteLocation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this location?')) return;

    try {
      setLoading(true);
      await locationService.delete(id);
      fetchLocations();
    } catch (error: any) {
      setError(error.message || 'Failed to delete location');
    } finally {
      setLoading(false);
    }
  };

  if (loading && locations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teakwood-brown">Locations</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`py-2 px-4 ${
            showAddForm 
            ? "bg-ceyora-clay hover:bg-ceyora-clay/90" 
            : "bg-palm-green/90 hover:bg-palm-green/80"
            } text-white rounded-md transition-colors`}
        >
          {showAddForm ? 'Cancel' : 'Add Location'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Add Location Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-teakwood-brown mb-4">Add New Location</h2>
          <form onSubmit={handleAddLocation} className="space-y-4">
            <div>
              <label htmlFor="locationName" className="block text-sm font-medium text-ocean-mist mb-1">
                Location Name
              </label>
              <input
                id="locationName"
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 bg-palm-green text-white rounded-md hover:bg-palm-green/90 transition-colors"
              >
                {loading ? 'Adding...' : 'Add Location'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Location Form */}
      {editingLocation && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-teakwood-brown mb-4">Edit Location</h2>
          <form onSubmit={handleUpdateLocation} className="space-y-4">
            <div>
              <label htmlFor="editLocationName" className="block text-sm font-medium text-ocean-mist mb-1">
                Location Name
              </label>
              <input
                id="editLocationName"
                type="text"
                value={editingLocation.name}
                onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingLocation(null)}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-teakwood-brown hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Locations List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-ocean-mist">
                  No locations found
                </td>
              </tr>
            ) : (
              locations.map((location) => (
                <tr key={location.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                    {location.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                    {location.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingLocation(location)}
                      className="text-ceyora-clay hover:text-ceyora-clay/90 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLocation(location.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationsPage;