import React, { useState, useEffect } from 'react';
import { hostService } from '../../services/host.service';
//import { locationService } from '../../services/location.service';
import { Host } from '../../types/host.types';
//import { Location } from '../../types/location.types';
import { Link } from 'react-router-dom';

const HostsPage: React.FC = () => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hosts on component mount
  useEffect(() => {
    fetchHosts();
  }, []);

  // Fetch all hosts
  const fetchHosts = async () => {
    try {
      setLoading(true);
      const data = await hostService.getAll();
      setHosts(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch hosts');
    } finally {
      setLoading(false);
    }
  };

  // Delete host
  const handleDeleteHost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this host?')) return;

    try {
      setLoading(true);
      await hostService.delete(id);
      fetchHosts();
    } catch (error: any) {
      setError(error.message || 'Failed to delete host');
    } finally {
      setLoading(false);
    }
  };

  if (loading && hosts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teakwood-brown">Hosts</h1>
        <Link
          to="/hosts/new"
          className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
        >
          Add Host
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Hosts List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Register Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-ocean-mist">
                    No hosts found
                  </td>
                </tr>
              ) : (
                hosts.map((host) => (
                  <tr key={host.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                      {host.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={host.profilePhoto || '/api/placeholder/40/40'} 
                            alt="" 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{host.firstName} {host.lastName}</div>
                          <div className="text-xs text-ocean-mist">{host.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                      {host.location?.name || host.locationId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                      {host.contactNumber1}
                      {host.contactNumber2 && (
                        <div className="text-xs text-ocean-mist">{host.contactNumber2}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                      {host.registerDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/hosts/${host.id}`}
                        className="text-ceyora-clay hover:text-ceyora-clay/90 mr-3"
                      >
                        View
                      </Link>
                      <Link
                        to={`/hosts/edit/${host.id}`}
                        className="text-ceyora-clay hover:text-ceyora-clay/90 mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteHost(host.id)}
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
    </div>
  );
};

export default HostsPage;