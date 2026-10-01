import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { OperationalStateProvider } from './context/OperationalStateContext';
import { SyncProvider } from './context/SyncContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import GoogleAuthModal from './components/auth/GoogleAuthModal';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import MissionsPage from './pages/MissionsPage';
import LogisticsPage from './pages/LogisticsPage';
import TeamsPage from './pages/TeamsPage';
import AssetsPage from './pages/AssetsPage';
import AlertsPage from './pages/AlertsPage';
import IncidentsPage from './pages/IncidentsPage';
import DecisionsPage from './pages/DecisionsPage';
import SystemPage from './pages/SystemPage';
import Landing from './pages/Landing';

function ProtectedLayout() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal(location.pathname + location.search);
    }
  }, [isAuthenticated, location, openAuthModal]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout />;
}

export default function App() {
  return (
    <OperationalStateProvider>
      <SyncProvider>
        <AuthProvider>
          <BrowserRouter>
            <GoogleAuthModal />
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<Landing />} />
              <Route path="/landing" element={<Landing />} />

              {/* Operational Command Application (Protected) */}
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/missions" element={<MissionsPage />} />
                <Route path="/logistics" element={<LogisticsPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/assets" element={<AssetsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/decisions" element={<DecisionsPage />} />
                <Route path="/system" element={<SystemPage />} />
              </Route>

              {/* Fallback route back to Landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SyncProvider>
    </OperationalStateProvider>
  );
}
