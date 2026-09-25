import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sliders,
  Globe,
  Package,
  Settings,
  Bell
} from 'lucide-react';
import { useOperationalState } from '../context/OperationalStateContext';

export default function AppLayout() {
  const { isOnline } = useOperationalState();

  return (
    <div className="min-h-screen bg-[#f1f3f7] text-slate-800 flex font-sans select-none overflow-x-hidden">
      
      {/* Far Left Vertical Slender Navigation Dock (Exact Reference Match) */}
      <aside className="w-14 sm:w-16 border-r border-slate-200/80 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-between py-5 shrink-0 z-40 fixed top-0 bottom-0 left-0 shadow-sm">
        
        {/* Top: Gradient Circular Donut Brand Logo */}
        <Link to="/" className="group" title="Aurora Platform">
          <div className="w-8 h-8 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-indigo-500 to-rose-500 flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:scale-105 transition">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600" />
            </div>
          </div>
        </Link>

        {/* Center: Slender Navigation Icon Buttons */}
        <nav className="flex flex-col items-center space-y-4 my-auto">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-purple-50 text-purple-700 shadow-sm relative after:absolute after:-left-2 after:w-1 after:h-4 after:bg-purple-600 after:rounded-r-full font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`
            }
            title="General Statistics & Expedition Overview"
          >
            <LayoutDashboard className="w-4 h-4" />
          </NavLink>

          <NavLink
            to="/missions"
            className={({ isActive }) =>
              `w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-purple-50 text-purple-700 shadow-sm relative after:absolute after:-left-2 after:w-1 after:h-4 after:bg-purple-600 after:rounded-r-full font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`
            }
            title="Field Missions & Traverses"
          >
            <Sliders className="w-4 h-4" />
          </NavLink>

          <NavLink
            to="/dashboard"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-700 bg-purple-50 shadow-sm relative after:absolute after:-left-2 after:w-1 after:h-4 after:bg-purple-600 after:rounded-r-full"
            title="3D Topographic Expedition Map"
          >
            <Globe className="w-4 h-4" />
          </NavLink>

          <NavLink
            to="/logistics"
            className={({ isActive }) =>
              `w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-purple-50 text-purple-700 shadow-sm relative after:absolute after:-left-2 after:w-1 after:h-4 after:bg-purple-600 after:rounded-r-full font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`
            }
            title="Logistics & Cargo Manifests"
          >
            <Package className="w-4 h-4" />
          </NavLink>

          <NavLink
            to="/system"
            className={({ isActive }) =>
              `w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-purple-50 text-purple-700 shadow-sm relative after:absolute after:-left-2 after:w-1 after:h-4 after:bg-purple-600 after:rounded-r-full font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`
            }
            title="System & Offline Settings"
          >
            <Settings className="w-4 h-4" />
          </NavLink>
        </nav>

        {/* Bottom: Profile Avatar & Notification Bell */}
        <div className="flex flex-col items-center space-y-3 pt-4 border-t border-slate-100 w-full">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md border-2 border-white">
            SR
          </div>

          <Link
            to="/incidents"
            className="relative p-1 text-slate-400 hover:text-slate-700 transition"
            title="Active Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0.5 right-0.5 ring-2 ring-white" />
          </Link>
        </div>

      </aside>

      {/* Main View Area Offset by Left Navigation Dock */}
      <main className="flex-1 ml-14 sm:ml-16 min-h-screen relative overflow-hidden bg-[#f4f6fa]">
        <Outlet />
      </main>

    </div>
  );
}
