import React from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe,
  CloudSun,
  Truck,
  Users,
  Box,
  AlertTriangle,
  Compass,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { useOperationalState } from '../context/OperationalStateContext';

export default function AppLayout() {
  const { isOnline } = useOperationalState();
  const location = useLocation();

  const mainNavItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard?tab=overview" },
    { label: "Map", icon: Globe, path: "/dashboard?tab=map" },
    { label: "Environment", icon: CloudSun, path: "/system" },
    { label: "Logistics", icon: Truck, path: "/logistics" },
    { label: "Teams", icon: Users, path: "/missions" },
    { label: "Assets", icon: Box, path: "/logistics" },
    { label: "Alerts", icon: AlertTriangle, path: "/incidents", badge: "2" },
  ];

  const manageNavItems = [
    { label: "Missions", icon: Compass, path: "/missions", count: "4" },
    { label: "Incidents", icon: ShieldAlert, path: "/incidents", alert: true },
  ];

  const systemNavItems = [
    { label: "Settings", icon: Settings, path: "/system" },
  ];

  const renderNavItem = (item, isManageAlert = false) => {
    const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';
    const isOverviewActive = item.label === "Overview" && location.pathname === "/dashboard" && currentTab === "overview";
    const isMapActive = item.label === "Map" && location.pathname === "/dashboard" && currentTab === "map";
    const isActive = isOverviewActive || isMapActive || (location.pathname === item.path && item.label !== "Overview" && item.label !== "Map");
    const Icon = item.icon;

    return (
      <NavLink
        key={item.label}
        to={item.path}
        className={() => {
          return `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
            isActive
              ? 'bg-purple-50 text-purple-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`;
        }}
      >
        <div className="flex items-center space-x-2.5">
          <Icon className={`w-4 h-4 transition-colors shrink-0 ${
            isActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-700'
          }`} />
          <span className="tracking-tight">{item.label}</span>
        </div>

        {item.badge && (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
            {item.badge}
          </span>
        )}

        {item.count && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
            {item.count}
          </span>
        )}

        {item.alert && (
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f3f7] text-slate-800 flex font-sans select-none overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* ARORA DASHBOARD SIDEBAR                                                   */}
      {/* ========================================================================= */}
      <aside className="w-60 sm:w-64 border-r border-slate-200/90 bg-white/95 backdrop-blur-xl flex flex-col justify-between shrink-0 z-40 fixed top-0 bottom-0 left-0 shadow-sm">
        
        {/* Top: Brand Header */}
        <div className="p-5 pb-3 border-b border-slate-100">
          <Link to="/" className="flex items-center space-x-3 group" title="ARORA Expedition Command">
            <img 
              src="/logo.png" 
              alt="ARORA Logo" 
              className="h-8 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition" 
            />
            <div>
              <span className="text-lg font-black tracking-wider text-slate-900 uppercase font-sans block leading-none">
                ARORA
              </span>
              <span className="text-[10px] font-mono text-purple-600 font-semibold tracking-wide">
                Expedition Command
              </span>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Categories */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          
          {/* MAIN Category */}
          <div>
            <div className="px-3 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              MAIN
            </div>
            <div className="space-y-0.5">
              {mainNavItems.map(item => renderNavItem(item))}
            </div>
          </div>

          {/* MANAGE Category */}
          <div>
            <div className="px-3 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              MANAGE
            </div>
            <div className="space-y-0.5">
              {manageNavItems.map(item => renderNavItem(item))}
            </div>
          </div>

          {/* SYSTEM Category */}
          <div>
            <div className="px-3 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              SYSTEM
            </div>
            <div className="space-y-0.5">
              {systemNavItems.map(item => renderNavItem(item))}
            </div>
          </div>

        </nav>

        {/* Bottom: Profile & Station Connectivity Status */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm border border-white">
                SR
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs font-bold text-slate-900 block truncate max-w-[110px]">
                  Dr. Sunita Rao
                </span>
                <span className="text-[10px] font-mono text-slate-500 block">
                  Commander
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-white border border-slate-200/80 shadow-xs" title={isOnline ? "Online Gateway" : "Local Offline Core"}>
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              <span className="text-[10px] font-mono font-semibold text-slate-600">
                {isOnline ? "Live" : "Offline"}
              </span>
            </div>
          </div>
        </div>

      </aside>

      {/* Main View Area Offset by Left Navigation Sidebar */}
      <main className="flex-1 ml-60 sm:ml-64 min-h-screen relative overflow-y-auto bg-[#f4f6fa]">
        <Outlet />
      </main>

    </div>
  );
}
