import React from 'react';
import { Link } from 'react-router-dom';
import { Host } from '../../types/host.types';

interface TopHostsProps {
  hosts: Host[];
}

const TopHosts: React.FC<TopHostsProps> = ({ hosts }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-teakwood-brown">Top Hosts</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {hosts.length === 0 ? (
          <p className="py-4 px-6 text-center text-ocean-mist">No hosts available</p>
        ) : (
          hosts.map((host) => (
            <div key={host.id} className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={host.profilePhoto || '/api/placeholder/40/40'}
                    alt={`${host.firstName} ${host.lastName}`}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-teakwood-brown">
                        {host.firstName} {host.lastName}
                      </h3>
                      <p className="text-xs text-ocean-mist">
                        {host.location?.name || 'Unknown location'} • {host.languages.join(', ')}
                      </p>
                    </div>
                    <Link
                      to={`/hosts/${host.id}`}
                      className="text-xs font-medium text-ceyora-clay hover:text-ceyora-clay/90"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Link to="/hosts" className="text-sm font-medium text-ceyora-clay hover:text-ceyora-clay/90">
          View all hosts
        </Link>
      </div>
    </div>
  );
};

export default TopHosts;