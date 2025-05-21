import React from 'react';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  type: 'booking' | 'journey' | 'package';
  title: string;
  timestamp: string;
  status?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return (
          <span className="bg-ceyora-clay/10 text-ceyora-clay p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
        );
      case 'journey':
        return (
          <span className="bg-palm-green/10 text-palm-green p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        );
      case 'package':
        return (
          <span className="bg-ocean-mist/10 text-ocean-mist p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-teakwood-brown">Recent Activity</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <p className="py-4 px-6 text-center text-ocean-mist">No recent activity</p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getActivityTypeIcon(activity.type)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-teakwood-brown">{activity.title}</p>
                    <p className="text-xs text-ocean-mist">{activity.timestamp}</p>
                  </div>
                </div>
                {activity.status && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Link to="/bookings" className="text-sm font-medium text-ceyora-clay hover:text-ceyora-clay/90">
          View all activity
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity;