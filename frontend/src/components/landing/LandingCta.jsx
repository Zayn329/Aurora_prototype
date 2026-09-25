import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Ship,
  Package,
  Users,
  Radio,
  Cpu,
  Fuel,
  CheckCircle2,
  Anchor,
  Layers
} from 'lucide-react';

export default function LandingCta() {
  return (
    <footer className="relative w-full pt-16 sm:pt-24 pb-0 bg-transparent select-none overflow-hidden">
      {/* Background Soft Polar Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-t from-sky-200/35 via-blue-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main CTA Section Box Container */}
        <div className="relative max-w-5xl mx-auto rounded-3xl bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.07)] px-6 py-12 sm:px-12 sm:py-16 md:py-20 mb-16 overflow-hidden">
          {/* Subtle interior ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-sky-100/50 via-blue-50/25 to-transparent blur-3xl pointer-events-none -z-10" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="font-serif font-normal sm:font-medium tracking-normal text-slate-900 text-3xl sm:text-4xl lg:text-[46px] leading-[1.18]">
              Connect with all polar logistics & operations
            </h2>
          </div>

          {/* Central Connected Hub Container (Matching the Reference Screenshot) */}
          <div className="relative max-w-4xl mx-auto pt-4 pb-10 sm:pb-12">

            {/* Curved Connector Arch SVG */}
            <div className="absolute top-8 inset-x-0 w-full flex justify-center pointer-events-none z-0">
              <svg
                className="w-full max-w-[620px] h-28 overflow-visible"
                viewBox="0 0 620 110"
                fill="none"
              >
                {/* Soft connecting arch line linking the 5 nodes */}
                <path
                  d="M 60 90 Q 180 15 310 15 Q 440 15 560 90"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 60 90 Q 180 15 310 15 Q 440 15 560 90"
                  stroke="url(#archGlow)"
                  strokeWidth="2"
                  strokeOpacity="0.7"
                />
                <defs>
                  <linearGradient id="archGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* 5 Floating Connected Polar Tool & Logistics Nodes in an Arch */}
            <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-8 md:gap-14 mb-[-28px] sm:mb-[-34px]">

              {/* Node 1: Cargo & Supply Depot (Left Lower) */}
              <div className="flex flex-col items-center group cursor-pointer mb-6 sm:mb-8">
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white shadow-lg shadow-sky-950/5 border border-sky-100 flex items-center justify-center text-sky-700 transition-all duration-300 group-hover:scale-110 group-hover:border-sky-300 group-hover:shadow-sky-200/50">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-1.5 opacity-80 group-hover:opacity-100">
                  CARGO
                </span>
              </div>

              {/* Node 2: Field Personnel & Bridge Comms (Left Higher) */}
              <div className="flex flex-col items-center group cursor-pointer mb-2 sm:mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-lg shadow-sky-950/5 border border-amber-100 flex items-center justify-center text-amber-700 transition-all duration-300 group-hover:scale-110 group-hover:border-amber-300 group-hover:shadow-amber-200/50">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-1.5 opacity-80 group-hover:opacity-100">
                  CREW
                </span>
              </div>

              {/* Node 3: Center Apex — Aurora Central Command Hub (Peak) */}
              <div className="flex flex-col items-center group cursor-pointer -translate-y-2 sm:-translate-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-sky-50 via-white to-blue-50 shadow-xl shadow-sky-900/10 border-2 border-sky-300/80 flex items-center justify-center p-2.5 transition-all duration-300 group-hover:scale-105 group-hover:border-sky-400 group-hover:shadow-sky-300/50">
                  <img
                    src="/logo.png"
                    alt="ARORA Command Core"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <span className="text-[11px] font-mono font-black text-sky-950 mt-1 tracking-wider uppercase">
                  ARORA CORE
                </span>
              </div>

              {/* Node 4: Maritime & Icebreaker Fleet (Right Higher) */}
              <div className="flex flex-col items-center group cursor-pointer mb-2 sm:mb-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-lg shadow-sky-950/5 border border-emerald-100 flex items-center justify-center text-emerald-700 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-300 group-hover:shadow-emerald-200/50">
                  <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-1.5 opacity-80 group-hover:opacity-100">
                  FLEET
                </span>
              </div>

              {/* Node 5: Satellite Radar & Sensor Mesh (Right Lower) */}
              <div className="flex flex-col items-center group cursor-pointer mb-6 sm:mb-8">
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white shadow-lg shadow-sky-950/5 border border-indigo-100 flex items-center justify-center text-indigo-700 transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-300 group-hover:shadow-indigo-200/50">
                  <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 mt-1.5 opacity-80 group-hover:opacity-100">
                  SENSORS
                </span>
              </div>

            </div>

            {/* Inner Content Section */}
            <div className="pt-8 sm:pt-10 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold text-slate-900 tracking-tight leading-snug">
                +100% Unified Operational Awareness
              </h3>

              <p className="mt-2.5 text-xs sm:text-sm md:text-[15px] text-slate-500 font-sans max-w-lg mx-auto leading-relaxed">
                Real-time synchronization across icebreakers, deep-freeze cargo manifests, and field personnel
              </p>

              {/* Primary CTA Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-slate-950 hover:bg-slate-900 rounded-full transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] flex items-center space-x-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-300" />
                </Link>

                <Link
                  to="/missions"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium text-slate-700 bg-white/80 hover:bg-white border border-sky-200/80 rounded-full transition-all duration-200 shadow-2xs"
                >
                 See How it Works
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Full-Width Editorial Footer Matching Reference */}
      <div className="w-full border-t border-slate-300/60 bg-transparent pt-10 sm:pt-14 pb-0 overflow-hidden select-none mt-12 sm:mt-16">
        <div className="w-full px-6 sm:px-10 lg:px-14 flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 sm:pb-12">
          {/* Left: All Rights Reserved */}
          <div className="text-[11px] sm:text-xs font-sans text-neutral-600 leading-tight">
            <div>All Rights</div>
            <div>Reserved</div>
            <div className="text-neutral-900 font-semibold mt-1">© 2026</div>
          </div>

          {/* Right: Platform Navigation Links */}
          <div className="flex flex-wrap items-start gap-8 sm:gap-14 md:gap-20">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-medium mb-1.5">
                ABOUT
              </div>
              <div className="flex flex-col space-y-1">
                <a href="#about" className="text-xs sm:text-sm font-sans font-medium text-neutral-900 hover:text-sky-600 transition">
                  About Platform
                </a>
                <a href="#overview" className="text-xs sm:text-sm font-sans font-medium text-neutral-900 hover:text-sky-600 transition">
                  Overview
                </a>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-medium mb-1.5">
                DASHBOARD
              </div>
              <div className="flex flex-col space-y-1">
                <Link to="/dashboard" className="text-xs sm:text-sm font-sans font-medium text-neutral-900 hover:text-sky-600 transition">
                  Command Center
                </Link>
                <Link to="/missions" className="text-xs sm:text-sm font-sans font-medium text-neutral-900 hover:text-sky-600 transition">
                  Missions
                </Link>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-medium mb-1.5">
                OPERATIONS
              </div>
              <div className="flex flex-col space-y-1">
                <Link to="/logistics" className="text-xs sm:text-sm font-sans font-medium text-neutral-900 hover:text-sky-600 transition">
                  Logistics & Cargo
                </Link>
                <a href="#how-it-works" className="text-xs sm:text-sm font-sans font-medium text-neutral-900 hover:text-sky-600 transition">
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Brand Logo Display */}
        <div className="w-full overflow-hidden flex justify-center items-end leading-none px-2 sm:px-4 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-8">
          <img
            src="/logo.png"
            alt="AURORA"
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
          />
        </div>
      </div>
    </footer>
  );
}
