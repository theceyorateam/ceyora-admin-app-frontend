import React, { useState, useEffect } from 'react';
import { tagService } from '../../services/tag.service';
import { Tag } from '../../types/tag.types';

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState<string>('');

  // Fetch tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  // Fetch all tags
  const fetchTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.getAll();
      setTags(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  // Add new tag
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setLoading(true);
      await tagService.create({ name: newTagName });
      setNewTagName('');
      setShowAddForm(false);
      fetchTags();
    } catch (error: any) {
      setError(error.message || 'Failed to add tag');
    } finally {
      setLoading(false);
    }
  };

  // Update tag
  const handleUpdateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag || !editingTag.name.trim()) return;

    try {
      setLoading(true);
      await tagService.update(editingTag.id, { name: editingTag.name });
      setEditingTag(null);
      fetchTags();
    } catch (error: any) {
      setError(error.message || 'Failed to update tag');
    } finally {
      setLoading(false);
    }
  };

  // Delete tag
  const handleDeleteTag = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;

    try {
      setLoading(true);
      await tagService.delete(id);
      fetchTags();
    } catch (error: any) {
      setError(error.message || 'Failed to delete tag');
    } finally {
      setLoading(false);
    }
  };

  if (loading && tags.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teakwood-brown">Tags</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Tag'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Add Tag Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-teakwood-brown mb-4">Add New Tag</h2>
          <form onSubmit={handleAddTag} className="space-y-4">
            <div>
              <label htmlFor="tagName" className="block text-sm font-medium text-ocean-mist mb-1">
                Tag Name
              </label>
              <input
                id="tagName"
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
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
                {loading ? 'Adding...' : 'Add Tag'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Tag Form */}
      {editingTag && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-teakwood-brown mb-4">Edit Tag</h2>
          <form onSubmit={handleUpdateTag} className="space-y-4">
            <div>
              <label htmlFor="editTagName" className="block text-sm font-medium text-ocean-mist mb-1">
                Tag Name
              </label>
              <input
                id="editTagName"
                type="text"
                value={editingTag.name}
                onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setEditingTag(null)}
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

      {/* Tags List */}
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
            {tags.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-ocean-mist">
                  No tags found
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
                <tr key={tag.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                    {tag.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                    {tag.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingTag(tag)}
                      className="text-ceyora-clay hover:text-ceyora-clay/90 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
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

export default TagsPage;