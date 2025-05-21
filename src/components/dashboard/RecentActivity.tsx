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
                <div className="flex-1">
                  <p className="text-sm font-medium text-teakwood-brown">{activity.title}</p>
                  <p className="text-xs text-ocean-mist">{activity.timestamp}</p>
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