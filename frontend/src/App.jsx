import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OperationalStateProvider } from './context/OperationalStateContext';
import { SyncProvider } from './context/SyncContext';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/DashboardPage';
import MissionsPage from './pages/MissionsPage';
import LogisticsPage from './pages/LogisticsPage';
import IncidentsPage from './pages/IncidentsPage';
import DecisionsPage from './pages/DecisionsPage';
import SystemPage from './pages/SystemPage';
import Landing from './pages/Landing';

export default function App() {
  return (
    <OperationalStateProvider>
      <SyncProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />

            {/* Operational Command Application */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/missions" element={<MissionsPage />} />
              <Route path="/logistics" element={<LogisticsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/decisions" element={<DecisionsPage />} />
              <Route path="/system" element={<SystemPage />} />
            </Route>

            {/* Fallback route back to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SyncProvider>
    </OperationalStateProvider>
  );
}
