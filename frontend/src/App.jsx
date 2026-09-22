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

export default function App() {
  return (
    <OperationalStateProvider>
      <SyncProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="missions" element={<MissionsPage />} />
              <Route path="logistics" element={<LogisticsPage />} />
              <Route path="incidents" element={<IncidentsPage />} />
              <Route path="decisions" element={<DecisionsPage />} />
              <Route path="system" element={<SystemPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SyncProvider>
    </OperationalStateProvider>
  );
}
