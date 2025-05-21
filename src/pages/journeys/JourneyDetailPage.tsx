import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { journeyService } from '../../services/journey.service';
import { packageService } from '../../services/package.service';
import { Journey } from '../../types/journey.types';
import { Package } from '../../types/package.types';

const JourneyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showAllImages, setShowAllImages] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchJourneyData = async () => {
      try {
        setLoading(true);
        const journeyData = await journeyService.getById(id);
        setJourney(journeyData);
        
        // Fetch packages separately to ensure we have the latest data
        const packagesData = await packageService.getByJourneyId(id);
        setPackages(packagesData);
        
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch journey details');
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, [id]);

  const handleDeleteJourney = async () => {
    if (!journey || !window.confirm('Are you sure you want to delete this journey and all its packages?')) return;

    try {
      setLoading(true);
      await journeyService.delete(journey.id);
      navigate('/journeys');
    } catch (error: any) {
      setError(error.message || 'Failed to delete journey');
      setLoading(false);
    }
  };

  const handleToggleHidden = async () => {
    if (!journey) return;
    
    try {
      setLoading(true);
      await journeyService.update(journey.id, { hidden: !journey.hidden });
      
      // Refresh journey data
      const journeyData = await journeyService.getById(id!);
      setJourney(journeyData);
      setLoading(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update journey visibility');
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

  // Get all journey images (base image + other images)
  const allImages = journey
    ? [journey.baseImage, ...journey.otherImages].filter(Boolean)
    : [];

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
          onClick={() => navigate('/journeys')}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Back to Journeys
        </button>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-700">Journey not found</p>
        <button
          onClick={() => navigate('/journeys')}
          className="mt-2 text-sm text-yellow-600 hover:text-yellow-800"
        >
          Back to Journeys
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teakwood-brown flex items-center">
          Journey Details
          {journey.hidden && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Hidden
            </span>
          )}
        </h1>
        <div className="space-x-2 flex flex-wrap">
          <Link
            to={`/journeys/edit/${journey.id}`}
            className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
          >
            Edit Journey
          </Link>
          <Link
            to={`/journeys/${journey.id}/packages/new`}
            className="py-2 px-4 bg-palm-green text-white rounded-md hover:bg-palm-green/90 transition-colors"
          >
            Add Package
          </Link>
          <button
            onClick={handleToggleHidden}
            className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            {journey.hidden ? 'Unhide Journey' : 'Hide Journey'}
          </button>
          <button
            onClick={handleDeleteJourney}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <Link
            to="/journeys"
            className="py-2 px-4 border border-gray-300 rounded-md text-teakwood-brown hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Journey Details Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Image Gallery */}
        <div className="relative">
          {allImages.length > 0 && (
            <img
              src={allImages[activeImageIndex] || '/api/placeholder/800/400'}
              alt={journey.title}
              className="w-full h-80 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/800/400';
              }}
            />
          )}
          
          {/* Thumbnail navigation */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {allImages.slice(0, showAllImages ? allImages.length : 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-12 h-12 rounded-md border-2 ${
                    index === activeImageIndex
                      ? 'border-ceyora-clay'
                      : 'border-white/50'
                  } overflow-hidden`}
                >
                  <img
                    src={image || '/api/placeholder/48/48'}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/api/placeholder/48/48';
                    }}
                  />
                </button>
              ))}
              
              {allImages.length > 5 && !showAllImages && (
                <button
                  onClick={() => setShowAllImages(true)}
                  className="w-12 h-12 rounded-md bg-black/30 text-white flex items-center justify-center text-xs"
                >
                  +{allImages.length - 5}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Journey Information */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-teakwood-brown">{journey.title}</h2>
              <p className="text-lg text-ocean-mist">{journey.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-ocean-mist">Location</h3>
                <p className="mt-1 text-teakwood-brown">{journey.location?.name || 'Unknown'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-ocean-mist">Base Price</h3>
                <p className="mt-1 text-teakwood-brown font-bold">{formatCurrency(journey.priceLKR, 'LKR')}</p>
                <p className="text-xs text-ocean-mist">{formatCurrency(journey.priceUSD || 0, 'USD')}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-ocean-mist">Host</h3>
                <p className="mt-1 text-teakwood-brown">
                  {journey.host
                    ? `${journey.host.firstName} ${journey.host.lastName}`
                    : 'Not assigned'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-ocean-mist">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {journey.tags && journey.tags.length > 0 ? (
                  journey.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-ceyora-clay/10 text-ceyora-clay"
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
              <h3 className="text-sm font-medium text-ocean-mist">Summary</h3>
              <p className="mt-1 text-teakwood-brown">{journey.summary}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-ocean-mist">Description</h3>
              <div className="mt-1 text-teakwood-brown whitespace-pre-line">
                {journey.description}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Packages Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-teakwood-brown">Packages</h2>
          <Link
            to={`/journeys/${journey.id}/packages/new`}
            className="py-2 px-4 bg-palm-green text-white rounded-md hover:bg-palm-green/90 transition-colors"
          >
            Add Package
          </Link>
        </div>
        
        {packages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-ocean-mist">
              No packages created for this journey yet. Add a package to offer different experiences.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${pkg.hidden ? 'opacity-70' : ''}`}>
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-teakwood-brown flex items-center">
                        {pkg.name}
                        {pkg.hidden && (
                          <span className="ml-2 inline-flex items-center px-2 5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Hidden
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-ocean-mist">
                        {pkg.duration?.duration || 'Duration not set'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-teakwood-brown font-bold">
                        {formatCurrency(pkg.priceLKR, 'LKR')}
                      </div>
                      <div className="text-xs text-ocean-mist">
                        {formatCurrency(pkg.priceUSD || 0, 'USD')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-teakwood-brown mb-4 line-clamp-2">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-ocean-mist mb-1">Inclusions</h4>
                    <ul className="text-sm text-teakwood-brown space-y-1">
                      {pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-palm-green mr-2">✓</span>
                          {inclusion}
                        </li>
                      ))}
                      {pkg.inclusions.length > 3 && (
                        <li className="text-xs text-ocean-mist">
                          +{pkg.inclusions.length - 3} more inclusions
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-ocean-mist">Max guests:</span>{' '}
                    <span className="text-teakwood-brown">{pkg.maxGuests}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    <Link
                      to={`/journeys/${journey.id}/packages/${pkg.id}`}
                      className="px-3 py-1.5 text-xs text-ceyora-clay hover:bg-ceyora-clay/10 rounded-md transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      to={`/journeys/${journey.id}/packages/edit/${pkg.id}`}
                      className="px-3 py-1.5 text-xs text-ceyora-clay hover:bg-ceyora-clay/10 rounded-md transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          await packageService.update(pkg.id, { hidden: !pkg.hidden });
                          // Refresh packages list
                          const packagesData = await packageService.getByJourneyId(id!);
                          setPackages(packagesData);
                        } catch (error: any) {
                          setError(error.message || 'Failed to update package visibility');
                        }
                      }}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {pkg.hidden ? 'Unhide' : 'Hide'}
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this package?')) {
                          try {
                            await packageService.delete(pkg.id);
                            // Refresh packages list
                            const packagesData = await packageService.getByJourneyId(id!);
                            setPackages(packagesData);
                          } catch (error: any) {
                            setError(error.message || 'Failed to delete package');
                          }
                        }
                      }}
                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyDetailPage;