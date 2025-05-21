import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import StatCard from '../../components/dashboard/StatCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import RecentJourneys from '../../components/dashboard/RecentJourneys';
import TopHosts from '../../components/dashboard/TopHosts';
import { journeyService } from '../../services/journey.service';
import { hostService } from '../../services/host.service';
import { locationService } from '../../services/location.service';
import { tagService } from '../../services/tag.service';
import { durationService } from '../../services/duration.service';
import { Journey } from '../../types/journey.types';
import { Host } from '../../types/host.types';
import { Location } from '../../types/location.types';
import { Tag } from '../../types/tag.types';
import { Duration } from '../../types/duration.types';
import { Package } from '../../types/package.types';

// Import icons
import MapIcon from '@mui/icons-material/Map';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import ExploreIcon from '@mui/icons-material/Explore';
import InventoryIcon from '@mui/icons-material/Inventory';

// Define activity type
type ActivityType = "booking" | "journey" | "package";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  status?: string;
}

const DashboardPage: React.FC = () => {
  // State for all entities
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [durations, setDurations] = useState<Duration[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock recent activities with proper typing
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'booking',
      title: 'New booking: Wellness Retreat in Kandy',
      timestamp: '2 hours ago',
      status: 'confirmed',
    },
    {
      id: '2',
      type: 'journey',
      title: 'New journey added: Culinary Tour of Colombo',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      type: 'package',
      title: 'New package added: Beach Adventure Deluxe',
      timestamp: '1 day ago',
    },
    {
      id: '4',
      type: 'booking',
      title: 'Booking status changed: Beach Escape in Mirissa',
      timestamp: '2 days ago',
      status: 'cancelled',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all entity data
        const [
          journeysData,
          hostsData,
          locationsData,
          tagsData,
          durationsData,
        ] = await Promise.all([
          journeyService.getAll(),
          hostService.getAll(),
          locationService.getAll(),
          tagService.getAll(),
          durationService.getAll(),
        ]);
        
        setJourneys(journeysData);
        setHosts(hostsData);
        setLocations(locationsData);
        setTags(tagsData);
        setDurations(durationsData);
        
        // Extract packages from journeys
        const allPackages = journeysData.reduce((acc: Package[], journey) => {
          if (journey.packages && journey.packages.length > 0) {
            return [...acc, ...journey.packages];
          }
          return acc;
        }, []);
        
        setPackages(allPackages);
        setError(null);
      } catch (error: any) {
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-teakwood-brown">Dashboard</h1>
        <p className="text-ocean-mist">Welcome to your journey management dashboard</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Journeys"
          value={journeys.length}
          icon={<ExploreIcon />}
          linkTo="/journeys"
          color="primary"
        />
        <StatCard
          title="Packages"
          value={packages.length}
          icon={<InventoryIcon />}
          linkTo="/journeys"
          color="secondary"
        />
        <StatCard
          title="Hosts"
          value={hosts.length}
          icon={<PersonIcon />}
          linkTo="/hosts"
          color="success"
        />
        <StatCard
          title="Locations"
          value={locations.length}
          icon={<MapIcon />}
          linkTo="/locations"
          color="warning"
        />
        <StatCard
          title="Tags"
          value={tags.length}
          icon={<LocalOfferIcon />}
          linkTo="/tags"
          color="default"
        />
        <StatCard
          title="Durations"
          value={durations.length}
          icon={<AccessTimeIcon />}
          linkTo="/durations"
          color="primary"
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Journeys */}
        <div className="lg:col-span-2">
          <RecentJourneys journeys={journeys.slice(0, 5)} />
        </div>
        
        {/* Top Hosts */}
        <div>
          <TopHosts hosts={hosts.slice(0, 5)} />
        </div>
      </div>
      
      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-teakwood-brown mb-4">Quick Actions</h2>
          <div className="space-y-3">
          <Link 
              to="/journeys/new" 
              className="block w-full py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors text-center"
            >
              Add New Journey
            </Link>
            <Link 
              to="/hosts/new" 
              className="block w-full py-2 px-4 bg-palm-green text-white rounded-md hover:bg-palm-green/90 transition-colors text-center"
            >
              Add New Host
            </Link>
            <Link 
              to="/locations" 
              className="block w-full py-2 px-4 bg-white border border-ceyora-clay text-ceyora-clay rounded-md hover:bg-ceyora-clay/10 transition-colors text-center"
            >
              Manage Locations
            </Link>
            <Link 
              to="/tags" 
              className="block w-full py-2 px-4 bg-white border border-ceyora-clay text-ceyora-clay rounded-md hover:bg-ceyora-clay/10 transition-colors text-center"
            >
              Manage Tags
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;