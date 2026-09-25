import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gradient-to-r from-sky-50/90 via-blue-50/85 to-cyan-50/90 backdrop-blur-md border-b border-sky-200/60 sticky top-0 z-50 shadow-[0_1px_4px_rgba(14,165,233,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-sm group-hover:bg-black transition-colors">
            <Compass className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-45" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight text-neutral-950 font-sans">
              Aurora
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100/70 text-sky-800 border border-sky-200/80">
              Polar Command
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <div className="relative group">
            <button className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-slate-950 transition py-1">
              <span>Operations</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-950 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 w-52 hidden group-hover:block transition-all">
              <div className="bg-white/95 backdrop-blur border border-sky-100 rounded-xl shadow-lg shadow-sky-950/5 p-2 text-xs space-y-1">
                <Link to="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-800 font-medium">
                  Command Center Overview
                </Link>
                <Link to="/missions" className="block px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-800 font-medium">
                  Polar Traverse Missions
                </Link>
                <Link to="/logistics" className="block px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-800 font-medium">
                  Cargo & Supply Depot
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-slate-950 transition py-1">
              <span>Field Intelligence</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-950 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 w-52 hidden group-hover:block transition-all">
              <div className="bg-white/95 backdrop-blur border border-sky-100 rounded-xl shadow-lg shadow-sky-950/5 p-2 text-xs space-y-1">
                <Link to="/incidents" className="block px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-800 font-medium">
                  Disruption & Route Status
                </Link>
                <Link to="/decisions" className="block px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-800 font-medium">
                  AI Decision Support & SOPs
                </Link>
                <Link to="/system" className="block px-3 py-2 rounded-lg hover:bg-sky-50 text-slate-800 font-medium">
                  Offline-First Sync Engine
                </Link>
              </div>
            </div>
          </div>

          <Link to="/missions" className="text-sm font-medium text-slate-700 hover:text-slate-950 transition">
            Field Teams
          </Link>

          <Link to="/system" className="text-sm font-medium text-slate-700 hover:text-slate-950 transition">
            Offline Architecture
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-sky-100/60 rounded-lg transition"
          >
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-lg transition shadow-sm hover:shadow active:scale-[0.98] flex items-center space-x-1.5"
          >
            <span>Start an operation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sky-200/80 bg-gradient-to-b from-sky-50 via-blue-50/95 to-cyan-50 px-4 pt-2 pb-6 space-y-3 shadow-lg shadow-sky-950/5">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-800">
            <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-sky-100/70">
              Command Overview
            </Link>
            <Link to="/missions" className="px-3 py-2 rounded-md hover:bg-sky-100/70">
              Traverse Missions
            </Link>
            <Link to="/logistics" className="px-3 py-2 rounded-md hover:bg-sky-100/70">
              Cargo & Fuel
            </Link>
            <Link to="/system" className="px-3 py-2 rounded-md hover:bg-sky-100/70">
              Offline Architecture
            </Link>
          </div>
          <div className="pt-3 border-t border-sky-200/60 flex flex-col space-y-2">
            <Link
              to="/dashboard"
              className="w-full text-center py-2 text-sm font-medium text-slate-700 hover:bg-sky-100/70 rounded-lg border border-sky-200/80 bg-white/70"
            >
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="w-full text-center py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-lg shadow-sm"
            >
              Start an operation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
