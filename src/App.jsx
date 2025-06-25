import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import MainLayout from '@/components/MainLayout';

import HomePage from '@/pages/HomePage';
import ListingsExplorerPage from '@/pages/ListingsExplorerPage';
import ListingDetailsPage from '@/pages/ListingDetailsPage';
import PostListingPage from '@/pages/PostListingPage';
import CompareToolPage from '@/pages/CompareToolPage';
import AffordabilityToolPage from '@/pages/AffordabilityToolPage';
import VerifiedLandlordsPage from '@/pages/VerifiedLandlordsPage';
import AboutPage from '@/pages/AboutPage';
import ServicesPage from '@/pages/ServicesPage';
import ContactPage from '@/pages/ContactPage';
import HelpPage from '@/pages/HelpPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import ExplorePage from '@/pages/ExplorePage';
import OwnerDashboardPage from '@/pages/OwnerDashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';

function App() {
  return (
    <ThemeProvider>
      <Toaster />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsExplorerPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/listing/:id" element={<ListingDetailsPage />} />
          <Route path="/post-listing" element={<PostListingPage />} />
          <Route path="/compare" element={<CompareToolPage />} />
          <Route path="/affordability-tool" element={<AffordabilityToolPage />} />
          <Route path="/verified-landlords" element={<VerifiedLandlordsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;