import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, ShieldCheck, Radio } from 'lucide-react';

export default function LandingCta() {
  return (
    <footer className="relative w-full pt-20 pb-12 bg-transparent select-none border-t border-sky-200/60 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-sky-200/40 via-blue-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Box */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-24">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/70 border border-sky-200/80 text-sky-800 text-[11px] font-mono font-bold tracking-wider uppercase mb-5">
            <span>08 — MISSION READY</span>
          </div>

          <h2 className="font-serif font-normal sm:font-medium tracking-normal text-slate-900 text-4xl sm:text-5xl lg:text-[56px] leading-[1.12]">
            Coordinate the next operation.
          </h2>

          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-sans font-normal">
            Deterministic mission planning, cargo dependency solvers, and grounded decision support designed from the ice up for zero-connectivity polar environments.
          </p>

          <div className="mt-8 flex flex-row items-center justify-center gap-3.5">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-lg transition-all duration-200 shadow-lg shadow-sky-950/10 active:scale-[0.98] flex items-center space-x-2"
            >
              <span>Explore the Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/missions"
              className="px-6 py-3.5 text-sm font-semibold text-slate-800 bg-white/90 hover:bg-white border border-sky-200/80 rounded-lg transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              Inspect Missions
            </Link>
          </div>
        </div>

        {/* Minimal Polar Platform Footer */}
        <div className="pt-8 border-t border-sky-200/60 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 font-sans tracking-tight">
              Aurora Polar Command Platform
            </span>
            <span className="text-slate-400 font-mono text-[11px]">v0.1.0 Prototype</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-600">
            <Link to="/dashboard" className="hover:text-slate-950 transition">Command Center</Link>
            <Link to="/missions" className="hover:text-slate-950 transition">Traverse Routes</Link>
            <Link to="/logistics" className="hover:text-slate-950 transition">Cargo Manifest</Link>
            <Link to="/incidents" className="hover:text-slate-950 transition">Impact Solvers</Link>
            <Link to="/decisions" className="hover:text-slate-950 transition">Commander AI</Link>
            <Link to="/system" className="hover:text-slate-950 transition">Offline Sync</Link>
          </div>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>OFFLINE DETERMINISTIC CORE COHERENT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
