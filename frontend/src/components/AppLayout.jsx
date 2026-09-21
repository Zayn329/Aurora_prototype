import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Compass as MissionIcon,
  Package,
  AlertTriangle,
  CheckSquare,
  Settings,
  RotateCcw
} from 'lucide-react';
import { useOperationalState } from '../context/OperationalStateContext';
import { useSync } from '../context/SyncContext';
import ConnectionPill from './ConnectionPill';

export default function AppLayout() {
  const { isOnline, isCheckingHealth, pendingQueueCount, resetSystemState } = useOperationalState();
  const { isSyncing } = useSync();

  const handleReset = async () => {
    if (window.confirm('Reset central SQLite database and clear local replica state?')) {
      await resetSystemState();
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/missions', label: 'Missions', icon: MissionIcon },
    { path: '/logistics', label: 'Logistics & Cargo', icon: Package },
    { path: '/incidents', label: 'Incidents & Impact', icon: AlertTriangle },
    { path: '/decisions', label: 'Commander Decisions', icon: CheckSquare },
    { path: '/system', label: 'System & Sync', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Polar Operational Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-sky-100 rounded-lg border border-sky-200">
            <Compass className="h-6 w-6 text-sky-700 shrink-0" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <span>AURORA</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-normal">
                Polar Command
              </span>
            </h1>
            <p className="text-xs text-slate-500">Antarctic Expedition Command System</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isOnline && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center space-x-1.5 transition shadow-sm"
              title="Reset state to seed dataset"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span>Reset State</span>
            </button>
          )}
          <ConnectionPill
            isOnline={isOnline}
            isCheckingHealth={isCheckingHealth || isSyncing}
            pendingQueueCount={pendingQueueCount}
          />
        </div>
      </header>

      {/* Main Body with Persistent Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Navigation Sidebar */}
        <aside className="w-60 border-r border-slate-200 bg-white flex flex-col shrink-0 py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 font-semibold border border-sky-100'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 border-t border-slate-100 mt-auto">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800">Operational Mode</div>
              <div>Offline-first deterministic core active.</div>
            </div>
          </div>
        </aside>

        {/* Page Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
