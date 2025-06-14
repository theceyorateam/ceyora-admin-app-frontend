// src/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './layout/AdminLayout';
import AuthLayout from './layout/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import LocationsPage from './pages/locations/LocationsPage';
import TagsPage from './pages/tags/TagsPage';
import HostsPage from './pages/hosts/HostsPage';
import HostDetailPage from './pages/hosts/HostDetailPage';
import HostFormPage from './pages/hosts/HostFormPage';
import DurationsPage from './pages/durations/DurationsPage';
import JourneysPage from './pages/journeys/JourneysPage';
import JourneyDetailPage from './pages/journeys/JourneyDetailPage';
import JourneyFormPage from './pages/journeys/JourneyFormPage';
import PackageDetailPage from './pages/packages/PackageDetailPage';
import PackageFormPage from './pages/packages/PackageFormPage';
import BookingsPage from './pages/bookings/BookingsPage';
import BookingDetailPage from './pages/bookings/BookingDetailPage';
import BookingFormPage from './pages/bookings/BookingFormPage';
import PublicBookingPage from './pages/bookings/PublicBookingPage';
import RefundPolicyPage from './pages/bookings/RefundPolicyPage';

const NotFoundPage = () => <div>Page Not Found</div>;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* Public Booking Routes */}
      <Route path="/book" element={<BookingFormPage />} />
      <Route path="/booking/:token" element={<PublicBookingPage />} />

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

        {/* Journeys Routes */}
        <Route path="journeys" element={<JourneysPage />} />
        <Route path="journeys/new" element={<JourneyFormPage />} />
        <Route path="journeys/:id" element={<JourneyDetailPage />} />
        <Route path="journeys/edit/:id" element={<JourneyFormPage />} />
        
        {/* Packages Routes (nested under journeys) */}
        <Route path="journeys/:journeyId/packages/new" element={<PackageFormPage />} />
        <Route path="journeys/:journeyId/packages/:packageId" element={<PackageDetailPage />} />
        <Route path="journeys/:journeyId/packages/edit/:packageId" element={<PackageFormPage />} />

        {/* Hosts Routes */}
        <Route path="hosts" element={<HostsPage />} />
        <Route path="hosts/new" element={<HostFormPage />} />
        <Route path="hosts/:id" element={<HostDetailPage />} />
        <Route path="hosts/edit/:id" element={<HostFormPage />} />
        
        {/* Locations Routes */}
        <Route path="locations" element={<LocationsPage />} />
        
        {/* Tags Routes */}
        <Route path="tags" element={<TagsPage />} />
        
        {/* Durations Routes */}
        <Route path="durations" element={<DurationsPage />} />
        
        {/* Bookings Routes - FIXED ORDER */}
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/new" element={<BookingFormPage />} />
        <Route path="bookings/refund-policy" element={<RefundPolicyPage />} />
        <Route path="bookings/edit/:id" element={<BookingFormPage />} />
        <Route path="bookings/:id" element={<BookingDetailPage />} />
      </Route>
      
      {/* Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;