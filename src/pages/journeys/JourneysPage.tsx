import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { journeyService } from '../../services/journey.service';
import { Journey } from '../../types/journey.types';

// Icons for view toggle
const GridViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const TableViewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const JourneysPage: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Changed default view mode to 'table' instead of 'grid'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchJourneys();
  }, []);

  useEffect(() => {
    // Filter journeys based on search query and hidden status
    let filtered = journeys;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(journey => 
        journey.title.toLowerCase().includes(query) || 
        journey.subtitle.toLowerCase().includes(query) ||
        (journey.location?.name?.toLowerCase().includes(query) || false) ||
        (journey.host?.firstName?.toLowerCase().includes(query) || false) ||
        (journey.host?.lastName?.toLowerCase().includes(query) || false)
      );
    }

    if (!showHidden) {
      filtered = filtered.filter(journey => !journey.hidden);
    }

    setFilteredJourneys(filtered);
  }, [journeys, searchQuery, showHidden]);

  const fetchJourneys = async () => {
    try {
      setLoading(true);
      const data = await journeyService.getAll();
      setJourneys(data);
      setFilteredJourneys(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch journeys');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHidden = async (journey: Journey) => {
    try {
      await journeyService.update(journey.id, { hidden: !journey.hidden });
      
      // Update local state
      setJourneys(prevJourneys => 
        prevJourneys.map(j => j.id === journey.id ? { ...j, hidden: !j.hidden } : j)
      );
    } catch (error: any) {
      setError(error.message || 'Failed to update journey visibility');
    }
  };

  const handleDeleteJourney = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this journey and all its packages?')) return;

    try {
      setLoading(true);
      await journeyService.delete(id);
      fetchJourneys();
    } catch (error: any) {
      setError(error.message || 'Failed to delete journey');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading && journeys.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ceyora-clay"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-teakwood-brown">Journeys</h1>
        <div className="flex items-center space-x-2">
          {/* View toggle */}
          <div className="bg-white rounded-md shadow-sm p-1 flex">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-ceylon-cream text-ceyora-clay' : 'text-gray-500'}`}
              aria-label="Table view"
            >
              <TableViewIcon />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-ceylon-cream text-ceyora-clay' : 'text-gray-500'}`}
              aria-label="Grid view"
            >
              <GridViewIcon />
            </button>
          </div>
          
          {/* Show hidden toggle */}
          <button
            onClick={() => setShowHidden(!showHidden)}
            className={`p-2 rounded-md border ${showHidden ? 'bg-ceylon-cream border-ceyora-clay text-ceyora-clay' : 'border-gray-300 text-gray-500'}`}
            aria-label={showHidden ? "Hide archived journeys" : "Show archived journeys"}
          >
            {showHidden ? <EyeIcon /> : <EyeOffIcon />}
            <span className="ml-2 text-sm">
              {showHidden ? "Showing Hidden" : "Hidden Items"}
            </span>
          </button>
          
          <Link
            to="/journeys/new"
            className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Journey
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-ceyora-clay focus:border-ceyora-clay sm:text-sm"
            placeholder="Search journeys by title, location, or host..."
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {filteredJourneys.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No journeys found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try a different search term or clear the search.' : 'Get started by creating a new journey.'}
          </p>
          <div className="mt-6">
            <Link
              to="/journeys/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ceyora-clay hover:bg-ceyora-clay/90 focus:outline-none"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Journey
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJourneys.map((journey) => (
            <div key={journey.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${journey.hidden ? 'opacity-60' : ''}`}>
              {/* Journey Image */}
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={journey.baseImage || '/api/placeholder/400/225'}
                  alt={journey.title}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/400/225';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-white text-lg font-bold line-clamp-1">{journey.title}</h2>
                  <p className="text-white/80 text-sm line-clamp-1">{journey.subtitle}</p>
                </div>
                {journey.hidden && (
                  <div className="absolute top-2 right-2 bg-gray-900/70 text-white text-xs px-2 py-1 rounded-full">
                    Hidden
                  </div>
                )}
              </div>

              {/* Journey Content */}
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-ocean-mist">Location</div>
                    <div className="text-teakwood-brown">{journey.location?.name || 'Unknown'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ocean-mist">Starting from</div>
                    <div className="text-teakwood-brown font-bold">
                      {formatCurrency(journey.priceLKR, 'LKR')}
                    </div>
                    <div className="text-xs text-ocean-mist">
                      {formatCurrency(journey.priceUSD || 0, 'USD')}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ocean-mist">Host</div>
                  <div className="text-teakwood-brown">
                    {journey.host ? `${journey.host.firstName} ${journey.host.lastName}` : 'Not assigned'}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ocean-mist">Tags</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {journey.tags && journey.tags.length > 0 ? (
                      journey.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs rounded-full bg-ceyora-clay/10 text-ceyora-clay"
                        >
                          {tag.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-ocean-mist">No tags</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-ocean-mist">Packages</div>
                  <div className="text-teakwood-brown">
                    {journey.packages && journey.packages.length > 0
                      ? `${journey.packages.length} package(s)`
                      : 'No packages'}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Link
                    to={`/journeys/${journey.id}`}
                    className="px-3 py-1.5 text-sm text-ceyora-clay hover:bg-ceyora-clay/10 rounded-md transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    to={`/journeys/edit/${journey.id}`}
                    className="px-3 py-1.5 text-sm text-ceyora-clay hover:bg-ceyora-clay/10 rounded-md transition-colors"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleToggleHidden(journey)}
                    className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {journey.hidden ? 'Unhide' : 'Hide'}
                  </button>
                  <button
                    onClick={() => handleDeleteJourney(journey.id)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table View
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Journey
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Host
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Packages
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJourneys.map((journey) => (
                  <tr key={journey.id} className={journey.hidden ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={journey.baseImage || '/api/placeholder/40/40'} 
                            alt=""
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/api/placeholder/40/40';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-teakwood-brown flex items-center">
                            {journey.title}
                            {journey.hidden && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-ocean-mist">{journey.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                      {journey.location?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                      {journey.host ? `${journey.host.firstName} ${journey.host.lastName}` : 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-teakwood-brown">{formatCurrency(journey.priceLKR, 'LKR')}</div>
                      <div className="text-xs text-ocean-mist">{formatCurrency(journey.priceUSD || 0, 'USD')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-teakwood-brown">
                      {journey.packages?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/journeys/${journey.id}`}
                        className="text-ceyora-clay hover:text-ceyora-clay/90 mr-3"
                      >
                        View
                      </Link>
                      <Link
                        to={`/journeys/edit/${journey.id}`}
                        className="text-ceyora-clay hover:text-ceyora-clay/90 mr-3"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleToggleHidden(journey)}
                        className="text-gray-500 hover:text-gray-700 mr-3"
                      >
                        {journey.hidden ? 'Unhide' : 'Hide'}
                      </button>
                      <button
                        onClick={() => handleDeleteJourney(journey.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneysPage;