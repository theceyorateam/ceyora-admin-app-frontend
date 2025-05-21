import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Icons for the navigation items
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const JourneysIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const HostsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LocationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DurationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TagsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const BookingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// Menu toggle icons
const MenuOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const MenuCloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Navigation data
const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { name: 'Journeys', to: '/journeys', icon: <JourneysIcon /> },
  { name: 'Hosts', to: '/hosts', icon: <HostsIcon /> },
  { name: 'Locations', to: '/locations', icon: <LocationsIcon /> },
  { name: 'Durations', to: '/durations', icon: <DurationsIcon /> },
  { name: 'Tags', to: '/tags', icon: <TagsIcon /> },
  { name: 'Bookings', to: '/bookings', icon: <BookingsIcon /> },
];

const AdminLayout: React.FC = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for controlling the sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // State for tracking the window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Reference to track if sidebar state was manually changed
  const manualToggleRef = useRef(false);
  
  // Update window width when it changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // Only auto-adjust sidebar on initial load or if not manually toggled
      if (!manualToggleRef.current) {
        // Auto-hide sidebar on small screens
        if (window.innerWidth < 768) {
          setSidebarOpen(false);
        } else {
          setSidebarOpen(true);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  // Toggle sidebar with manual flag
  const toggleSidebar = () => {
    manualToggleRef.current = true; // Mark as manually toggled
    setSidebarOpen(!sidebarOpen);
  };

  // Check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-20 relative">
        <div className="px-4 sm:px-6 flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* Always show the menu toggle button */}
            <button
              type="button"
              className="mr-2 inline-flex items-center justify-center p-2 rounded-md text-teakwood-brown hover:text-ceyora-clay"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? <MenuCloseIcon /> : <MenuOpenIcon />}
            </button>
            <h1 className="text-xl font-bold text-ceyora-clay">Ceyora Admin</h1>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-teakwood-brown mr-4 hidden sm:block">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={onLogout}
              className="py-2 px-4 bg-ceyora-clay text-white rounded-md hover:bg-ceyora-clay/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {windowWidth < 768 && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={toggleSidebar}
          ></div>
        )}
        
        {/* Sidebar - fixed width that doesn't collapse to zero */}
        <aside 
          className={`bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out z-10
            ${windowWidth < 768 
              ? `fixed inset-y-0 left-0 pt-16 ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}`
              : `${sidebarOpen ? 'w-64' : 'w-0'}`
            }`}
        >
          <div className="h-full flex flex-col justify-between overflow-y-auto">
            {/* Navigation */}
            <nav className="py-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    isActive(item.to)
                      ? 'text-teakwood-brown bg-ceylon-cream border-l-4 border-ceyora-clay'
                      : 'text-teakwood-brown hover:bg-gray-50'
                  }`}
                  onClick={() => windowWidth < 768 && toggleSidebar()}
                >
                  <span className={`inline-block w-5 h-5 ${isActive(item.to) ? 'text-ceyora-clay' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content with proper spacing */}
        <main 
          className={`flex-1 overflow-y-auto bg-ceylon-cream transition-all duration-300 ease-in-out
            ${sidebarOpen && windowWidth >= 768 ? 'ml-0' : 'ml-0'}`}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;