import React, { useState, useEffect } from 'react';
import { durationService } from '../../services/duration.service';
import { Duration } from '../../types/duration.types';

const DurationsPage: React.FC = () => {
  const [durations, setDurations] = useState<Duration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingDuration, setEditingDuration] = useState<Duration | null>(null);
  const [newDuration, setNewDuration] = useState<string>('');

  useEffect(() => {
    fetchDurations();
  }, []);

  const fetchDurations = async () => {
    try {
      setLoading(true);
      const data = await durationService.getAll();
      setDurations(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch durations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDuration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDuration.trim()) return;

    try {
      setLoading(true);
      await durationService.create({ duration: newDuration });
      setNewDuration('');
      setShowAddForm(false);
      fetchDurations();
    } catch (error: any) {
      setError(error.message || 'Failed to add duration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDuration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDuration || !editingDuration.duration.trim()) return;

    try {
      setLoading(true);
      await durationService.update(editingDuration.id, { duration: editingDuration.duration });
      setEditingDuration(null);
      fetchDurations();
    } catch (error: any) {
      setError(error.message || 'Failed to update duration');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDuration = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this duration?')) return;

    try {
      setLoading(true);
      await durationService.delete(id);
      fetchDurations();
    } catch (error: any) {
      setError(error.message || 'Failed to delete duration');
    } finally {
      setLoading(false);
    }
  };

  if (loading && durations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teakwood-brown">Durations</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Duration'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Add Duration Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-teakwood-brown mb-4">Add New Duration</h2>
          <form onSubmit={handleAddDuration} className="space-y-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-ocean-mist mb-1">
                Duration (e.g., "2 hours", "Full day", "3 days / 2 nights")
              </label>
              <input
                id="duration"
                type="text"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
              >
                {loading ? 'Adding...' : 'Add Duration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Duration Form */}
      {editingDuration && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-teakwood-brown mb-4">Edit Duration</h2>
          <form onSubmit={handleUpdateDuration} className="space-y-4">
            <div>
              <label htmlFor="editDuration" className="block text-sm font-medium text-ocean-mist mb-1">
                Duration
              </label>
              <input
                id="editDuration"
                type="text"
                value={editingDuration.duration}
                onChange={(e) => setEditingDuration({ ...editingDuration, duration: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingDuration(null)}
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

      {/* Durations List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {durations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-ocean-mist">
                  No durations found
                </td>
              </tr>
            ) : (
              durations.map((duration) => (
                <tr key={duration.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                    {duration.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                    {duration.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingDuration(duration)}
                      className="text-ceyora-clay hover:text-ceyora-clay/90 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDuration(duration.id)}
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

export default DurationsPage;