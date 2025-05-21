import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { packageService } from '../../services/package.service';
import { Package } from '../../types/package.types';

const PackageDetailPage: React.FC = () => {
  const { journeyId, packageId } = useParams<{ journeyId: string; packageId: string }>();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!packageId) return;
    
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const data = await packageService.getById(packageId);
        setPkg(data);
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  const handleDeletePackage = async () => {
    if (!pkg || !window.confirm('Are you sure you want to delete this package?')) return;

    try {
      setLoading(true);
      await packageService.delete(pkg.id);
      navigate(`/journeys/${journeyId}`);
    } catch (error: any) {
      setError(error.message || 'Failed to delete package');
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
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
          onClick={() => navigate(`/journeys/${journeyId}`)}
          className="mt-2 text-sm text-red-600 hover:text-red-800"
        >
          Back to Journey
        </button>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-yellow-700">Package not found</p>
        <button
          onClick={() => navigate(`/journeys/${journeyId}`)}
          className="mt-2 text-sm text-yellow-600 hover:text-yellow-800"
        >
          Back to Journey
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-teakwood-brown">Package Details</h1>
        <div className="space-x-2">
          <Link
            to={`/journeys/${journeyId}/packages/edit/${pkg.id}`}
            className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDeletePackage}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <Link
            to={`/journeys/${journeyId}`}
            className="py-2 px-4 border border-gray-300 rounded-md text-teakwood-brown hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-teakwood-brown">{pkg.name}</h2>
            <p className="text-sm text-ocean-mist mt-1">{pkg.duration?.duration || 'Duration not specified'}</p>
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="md:w-2/3">
              <h3 className="text-sm font-medium text-ocean-mist mb-2">Description</h3>
              <p className="text-teakwood-brown whitespace-pre-line">{pkg.description}</p>
            </div>

            <div className="md:w-1/3 bg-ceyora-clay/5 p-4 rounded-lg">
              <div className="text-center mb-4">
                <div className="text-teakwood-brown text-2xl font-bold">
                  {formatCurrency(pkg.priceLKR, 'LKR')}
                </div>
                <div className="text-sm text-ocean-mist">
                  {formatCurrency(pkg.priceUSD || 0, 'USD')}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-xs font-medium text-ocean-mist">Maximum guests</h4>
                  <p className="text-teakwood-brown">{pkg.maxGuests}</p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-ocean-mist">Duration</h4>
                  <p className="text-teakwood-brown">{pkg.duration?.duration || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-ocean-mist mb-2">What's included</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {pkg.inclusions.map((inclusion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-palm-green mr-2">✓</span>
                  <span className="text-teakwood-brown">{inclusion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;