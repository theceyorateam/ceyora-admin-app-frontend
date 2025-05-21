import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { hostService } from '../../services/host.service';
import { Host } from '../../types/host.types';

const HostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchHost = async () => {
      try {
        setLoading(true);
        const data = await hostService.getById(id);
        setHost(data);
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch host details');
      } finally {
        setLoading(false);
      }
    };

    fetchHost();
  }, [id]);

  const handleDelete = async () => {
    if (!host || !window.confirm('Are you sure you want to delete this host?')) return;

    try {
      setLoading(true);
      await hostService.delete(host.id);
      navigate('/hosts');
    } catch (error: any) {
      setError(error.message || 'Failed to delete host');
      setLoading(false);
    }
  };

  if (loading) {
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
          onClick={() => navigate('/hosts')}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Back to Hosts
        </button>
      </div>
    );
  }

  if (!host) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-700">Host not found</p>
        <button
          onClick={() => navigate('/hosts')}
          className="mt-2 text-sm text-yellow-600 hover:text-yellow-800"
        >
          Back to Hosts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teakwood-brown">Host Details</h1>
        <div className="space-x-2">
          <Link
            to={`/hosts/edit/${host.id}`}
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
            to="/hosts"
            className="py-2 px-4 border border-gray-300 rounded-md text-teakwood-brown hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Profile Photo */}
          <div className="md:w-1/3 p-6 flex justify-center">
            <img
              src={host.profilePhoto || '/api/placeholder/300/300'}
              alt={`${host.firstName} ${host.lastName}`}
              className="w-64 h-64 object-cover rounded-lg"
            />
          </div>

          {/* Host Details */}
          <div className="md:w-2/3 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-teakwood-brown">{host.firstName} {host.lastName}</h2>
              <p className="text-ocean-mist">Registered on {host.registerDate}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-ocean-mist">Location</h3>
                <p className="mt-1 text-teakwood-brown">{host.location?.name || host.locationId}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-ocean-mist">Email</h3>
                <p className="mt-1 text-teakwood-brown">{host.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-ocean-mist">Primary Contact</h3>
                <p className="mt-1 text-teakwood-brown">{host.contactNumber1}</p>
              </div>

              {host.contactNumber2 && (
                <div>
                  <h3 className="text-sm font-medium text-ocean-mist">Secondary Contact</h3>
                  <p className="mt-1 text-teakwood-brown">{host.contactNumber2}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-ocean-mist">Address</h3>
                <p className="mt-1 text-teakwood-brown">{host.address}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-ocean-mist">Languages</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {host.languages.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ceyora-clay/10 text-ceyora-clay"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-ocean-mist">Description</h3>
              <p className="mt-1 text-teakwood-brown whitespace-pre-line">{host.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDetailPage;