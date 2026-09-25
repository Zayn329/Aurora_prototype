import React, { useState } from 'react';
import { 
  CloudSnow, 
  Map, 
  Package, 
  AlertTriangle, 
  Siren, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  Compass,
  Radio,
  Fuel,
  TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IntelligenceSection() {
  const [activeTab, setActiveTab] = useState('emergency');

  return (
    <section id="intelligence" className="relative w-full py-20 sm:py-28 bg-transparent select-none overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Refined Pill & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-sky-100/80 border border-sky-200/90 text-sky-800 text-[11px] font-mono font-bold tracking-wider uppercase mb-3.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
            <span>• INTELLIGENCE LAYER</span>
          </div>

          <h2 className="font-serif font-medium text-slate-900 text-3xl sm:text-4xl lg:text-[46px] leading-[1.18] tracking-tight">
            From raw data to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800">
              mission decisions.
            </span>
          </h2>

          <p className="mt-3.5 text-xs sm:text-sm md:text-[15px] text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            Aurora's decision-support layer connects environmental telemetry, route physics, and resource models to autonomously detect risks, forecast shortages, and orchestrate rapid emergency response.
          </p>
        </div>

        {/* 4-Panel Bento Grid inspired by modern product showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* Card 1 (Top Left, 5 cols): Weather Intelligence & Aurora AI Branding */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#dbe9fa] via-[#e5f0fc] to-[#edf4fc] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-sky-200/70 shadow-sm group">
            {/* Ambient Watermark Background */}
            <div className="absolute top-2 right-2 text-7xl sm:text-8xl font-black font-sans text-sky-900/[0.04] pointer-events-none select-none tracking-tighter">
              AURORA
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/80 text-sky-800 border border-sky-200/60 shadow-xs">
                  01 // AI DECISION CORE
                </span>
                <span className="text-xl">🌦</span>
              </div>

              <h3 className="font-serif font-bold text-slate-900 text-2xl sm:text-3xl leading-snug mb-2">
                Weather Intelligence
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-6">
                Detect changing environmental conditions in real time. Continuous telemetry ingestion tracks sudden barometric plunges, katabatic wind bursts, and sea-ice fracturing before field teams encounter them.
              </p>

              {/* Floating Real-Time Polar Condition Pill */}
              <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-sky-200/80 shadow-sm mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase flex items-center space-x-1.5">
                    <CloudSnow className="w-3.5 h-3.5 text-sky-600" />
                    <span>Sector 04 Telemetry</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                    STORM ALERT
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-sky-50/70 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-500">WIND SPEED</div>
                    <div className="text-slate-900 font-bold text-sm">62 km/h</div>
                  </div>
                  <div className="bg-sky-50/70 p-2 rounded-lg">
                    <div className="text-[10px] text-slate-500">BAROMETER</div>
                    <div className="text-rose-700 font-bold text-sm">962 hPa (&minus;14)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold font-sans transition-all shadow-sm hover:shadow group-hover:translate-x-0.5"
              >
                <span>Launch Mission Shell</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-300" />
              </Link>
            </div>
          </div>

          {/* Card 2 (Top Right, 7 cols): 🚨 Emergency Intelligence with 3D Mobile App View */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#f1f6fd] via-[#f7faff] to-[#edf4fd] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-sky-200/70 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 shadow-xs">
                    02 // CRITICAL RESPONSE
                  </span>
                  <span className="text-lg">🚨</span>
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-2xl sm:text-3xl leading-snug">
                  Emergency Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-md mt-1">
                  Support rapid response during critical events. Synthesizes medical biometrics, storm tracking, and vehicle readiness into instant commander-approved evacuation plans.
                </p>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-[11px] font-mono font-semibold text-slate-700 shadow-xs shrink-0">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>MOBILE FIELD SYNC</span>
              </div>
            </div>

            {/* 3D Mobile App Display Container */}
            <div className="relative mt-2 sm:mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Floating Emergency Stat Callout Card */}
              <div className="w-full md:w-5/12 space-y-3 z-10">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-rose-200/80 shadow-md">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <Siren className="w-4 h-4 text-rose-600 animate-bounce" />
                    <span className="font-mono text-xs font-bold text-rose-800 uppercase">
                      Active Blizzard SAR
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-600 leading-snug font-sans">
                    Autonomous evacuation route calculated avoiding Roaring Forties sea swells and ice crevasse field.
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">READINESS</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      88% READY
                    </span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-sky-100 text-xs font-sans text-slate-600 flex items-center space-x-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Offline-first mesh sync operational with zero satellite lag.</span>
                </div>
              </div>

              {/* 3D Mobile Device Image Visual */}
              <div className="w-full md:w-7/12 flex justify-center items-center relative">
                {/* Ambient Soft Glow Behind 3D Phone */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-300/30 via-rose-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />

                <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
                  <img
                    src="/emergency_intelligence_3d.jpg"
                    alt="Aurora Polar Command Emergency Intelligence 3D Mobile View"
                    className="w-full max-w-[280px] sm:max-w-[310px] md:max-w-[330px] h-auto object-contain rounded-2xl drop-shadow-[0_16px_32px_rgba(15,23,42,0.12)] border border-sky-200/60"
                  />
                  
                  {/* Floating Tag Pinpoint */}
                  <div className="absolute -top-3 right-2 bg-slate-900/90 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-sky-400 flex items-center space-x-1.5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    <span>3D FIELD TERMINAL</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Card 3 (Bottom Left, 6 cols): 🗺 Route Intelligence & ⚠️ Risk Detection */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#ebf2fc] via-[#f2f7fd] to-[#e6effb] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-sky-200/70 shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 shadow-xs">
                  03 // NAVIGATION & RISK
                </span>
                <span className="text-lg">🗺</span>
                <span className="text-lg">⚠️</span>
              </div>

              <h3 className="font-serif font-bold text-slate-900 text-2xl leading-snug mb-1">
                Route Intelligence & Risk Detection
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-5">
                Identify safer and more practical routes while detecting potential mission disruptions early. Continuously recalculates fuel corridors around high-risk crevasse fields.
              </p>

              {/* Floating Dynamic Route Solver Widget */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-sky-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                      <Compass className="w-4 h-4 text-sky-700" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 font-sans">Traverse Waypoint Corridor #7</div>
                      <div className="text-[10px] font-mono text-slate-500">Maitri &rarr; Amundsen Depot</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    AVOIDED: ICE RIDGE
                  </span>
                </div>

                {/* Comparative Path Metric */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="text-[10px] text-slate-500 block">STANDARD ROUTE</span>
                    <span className="text-rose-700 font-bold">Risk: 74% (Crevasse)</span>
                  </div>
                  <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200/70">
                    <span className="text-[10px] text-emerald-800 block">AI OPTIMIZED</span>
                    <span className="text-emerald-800 font-bold">&minus;4.2 hrs | 0% Risk</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-sky-200/60 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>ALGORITHM: MULTI-PASS HEURISTIC</span>
              <span className="text-sky-800 font-bold">STATUS: CONVERGED</span>
            </div>
          </div>

          {/* Card 4 (Bottom Right, 6 cols): 📦 Resource Intelligence */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#eaf4ed] via-[#f2faf4] to-[#e4f1e8] rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-emerald-200/70 shadow-sm relative overflow-hidden">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                  04 // RESOURCE OPTIMIZATION
                </span>
                <span className="text-lg">📦</span>
              </div>

              <h3 className="font-serif font-bold text-slate-900 text-2xl leading-snug mb-1">
                Resource Intelligence
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-5">
                Predict shortages and optimize supplies. Models burn rates for Arctic-grade fuel, cryogenic tanks, and scientific rations under extreme weather delays.
              </p>

              {/* Nodal Resource Card (Inspired by Dark Visa Card style with connecting telemetry) */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                {/* Polar Grid Overlay */}
                <div 
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
                    backgroundSize: '16px 16px'
                  }}
                />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center space-x-2">
                    <Fuel className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                      Depot Reserve #02
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    BURN RATE: NOMINAL
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 relative z-10 text-center">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 font-mono">DIESEL</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">4,200 L</div>
                    <div className="text-[9px] text-emerald-400 font-mono">14 Days</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 font-mono">RATIONS</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">850 kg</div>
                    <div className="text-[9px] text-emerald-400 font-mono">28 Days</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400 font-mono">MEDICAL</div>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">100%</div>
                    <div className="text-[9px] text-sky-400 font-mono">Stable</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-emerald-200/60 flex items-center justify-between text-xs font-mono text-slate-600">
              <span>RESUPPLY FORECAST</span>
              <span className="text-emerald-800 font-bold">NO SHORTAGE DETECTED</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
