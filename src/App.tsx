/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToHash from './components/ScrollToHash';
import { Toaster } from 'react-hot-toast';
import { AdminProvider } from './store/AdminContext';

const PublicSite = React.lazy(() => import('./pages/PublicSite'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const ClinicDetails = React.lazy(() => import('./pages/ClinicDetails'));
const Blog = React.lazy(() => import('./pages/Blog'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-12 h-12 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
  </div>
);

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <ScrollToHash />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<PublicSite />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/clinic" element={<ClinicDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-center" />
      </BrowserRouter>
    </AdminProvider>
  );
}
