import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-ceylon-cream flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-ceyora-clay">Ceyora Admin</h1>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-teakwood-brown mr-4">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={onLogout}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ceyora-clay hover:bg-ceyora-clay/90"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0 bg-white shadow rounded-lg mt-6 h-fit">
              <nav className="py-4">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-teakwood-brown hover:bg-ceylon-cream hover:text-ceyora-clay"
                >
                  Dashboard
                </Link>
                <Link
                  to="/journeys"
                  className="block px-4 py-2 text-teakwood-brown hover:bg-ceylon-cream hover:text-ceyora-clay"
                >
                  Journeys
                </Link>
                <Link
                  to="/packages"
                  className="block px-4 py-2 text-teakwood-brown hover:bg-ceylon-cream hover:text-ceyora-clay"
                >
                  Packages
                </Link>
                <Link
                  to="/hosts"
                  className="block px-4 py-2 text-teakwood-brown hover:bg-ceylon-cream hover:text-ceyora-clay"
                >
                  Hosts
                </Link>
                <Link
                  to="/tags"
                  className="block px-4 py-2 text-teakwood-brown hover:bg-ceylon-cream hover:text-ceyora-clay"
                >
                  Tags
                </Link>
                <Link
                  to="/bookings"
                  className="block px-4 py-2 text-teakwood-brown hover:bg-ceylon-cream hover:text-ceyora-clay"
                >
                  Bookings
                </Link>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-grow md:ml-6 mt-6">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;