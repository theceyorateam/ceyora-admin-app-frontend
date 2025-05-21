import React from 'react';
import { Link } from 'react-router-dom';
import { Journey } from '../../types/journey.types';

interface RecentJourneysProps {
  journeys: Journey[];
}

const RecentJourneys: React.FC<RecentJourneysProps> = ({ journeys }) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-teakwood-brown">Recent Journeys</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {journeys.length === 0 ? (
          <p className="py-4 px-6 text-center text-ocean-mist">No recent journeys</p>
        ) : (
          journeys.map((journey) => (
            <div key={journey.id} className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
                  <img
                    className="h-12 w-12 rounded-md object-cover"
                    src={journey.baseImage || '/api/placeholder/48/48'}
                    alt={journey.title}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-teakwood-brown">{journey.title}</h3>
                      <p className="text-xs text-ocean-mist">
                        {journey.location?.name || 'Unknown location'} • {journey.packages?.length || 0} packages
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-teakwood-brown">
                        {formatCurrency(journey.priceLKR, 'LKR')}
                      </p>
                      <p className="text-xs text-ocean-mist">
                        {formatCurrency(journey.priceUSD || 0, 'USD')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Link to="/journeys" className="text-sm font-medium text-ceyora-clay hover:text-ceyora-clay/90">
          View all journeys
        </Link>
      </div>
    </div>
  );
};

export default RecentJourneys;