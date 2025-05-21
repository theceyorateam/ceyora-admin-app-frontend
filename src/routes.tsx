import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import AuthLayout from './layout/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Placeholder pages for other sections
const JourneysPage = () => <div>Journeys Page (Coming Soon)</div>;
const PackagesPage = () => <div>Packages Page (Coming Soon)</div>;
const HostsPage = () => <div>Hosts Page (Coming Soon)</div>;
const TagsPage = () => <div>Tags Page (Coming Soon)</div>;
const BookingsPage = () => <div>Bookings Page (Coming Soon)</div>;
const NotFoundPage = () => <div>Page Not Found</div>;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="journeys" element={<JourneysPage />} />
        <Route path="packages" element={<PackagesPage />} />
        <Route path="hosts" element={<HostsPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="bookings" element={<BookingsPage />} />
      </Route>
      
      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;