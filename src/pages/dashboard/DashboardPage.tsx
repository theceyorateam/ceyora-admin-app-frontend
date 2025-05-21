import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import RecentActivity from '../../components/dashboard/RecentActivity';

// Define the type to match what RecentActivity expects
type ActivityType = "booking" | "journey" | "package";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  status?: string;
}

const DashboardPage: React.FC = () => {
  // Mock data for statistics
  const stats = [
    { title: 'Total Journeys', value: 8, change: '+20%', isIncreasing: true },
    { title: 'Active Bookings', value: 12, change: '+5%', isIncreasing: true },
    { title: 'Total Packages', value: 14, change: '+15%', isIncreasing: true },
    { title: 'Hosts', value: 6, change: '0%', isIncreasing: false },
  ];

  // Mock data for recent activities with proper typing
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'booking', // Now explicitly one of the allowed types
      title: 'New booking: Wellness Retreat in Kandy',
      timestamp: '2 hours ago',
      status: 'confirmed',
    },
    {
      id: '2',
      type: 'journey', // Now explicitly one of the allowed types
      title: 'Journey updated: Culinary Tour of Colombo',
      timestamp: '5 hours ago',
    },
    {
      id: '3',
      type: 'booking', // Now explicitly one of the allowed types
      title: 'Booking status changed: Beach Escape in Mirissa',
      timestamp: '1 day ago',
      status: 'cancelled',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-teakwood-brown">Dashboard</h1>
        <p className="text-ocean-mist">Welcome to your journey management dashboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isIncreasing={stat.isIncreasing}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-teakwood-brown mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors">
              Add New Journey
            </button>
            <button className="w-full py-2 px-4 bg-palm-green text-white rounded-md hover:bg-palm-green/90 transition-colors">
              Manage Packages
            </button>
            <button className="w-full py-2 px-4 bg-white border border-ceyora-clay text-ceyora-clay rounded-md hover:bg-ceyora-clay/10 transition-colors">
              View Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
