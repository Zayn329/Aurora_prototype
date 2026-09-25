import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, LayoutDashboard, AlertTriangle, ShieldCheck, ArrowRight, Radio, Cpu, Network } from 'lucide-react';

export default function CommandShowcase() {
  return (
    <section className="relative w-full py-20 sm:py-28 bg-transparent select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/70 border border-sky-200/80 text-sky-800 text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
            <span>07 — COMMAND CONSOLE</span>
          </div>

          <h2 className="font-serif font-normal sm:font-medium tracking-normal text-slate-900 text-3xl sm:text-4xl lg:text-[46px] leading-[1.18]">
            One operational picture. From field to command.
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            A cohesive expedition platform unifying live traverse routes, inventory dependencies, field telemetry, and human-in-the-loop AI solvers.
          </p>
        </div>

        {/* Large Platform Showcase Frame */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-sky-200/90 bg-white/95 backdrop-blur-xl shadow-2xl shadow-sky-950/10 overflow-hidden">
          {/* Simulated Browser / Command Bar */}
          <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-slate-400 font-semibold pl-2">
                aurora.polar // unified-operational-state
              </span>
            </div>

            <div className="hidden sm:flex items-center space-x-3">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>OFFLINE CORE ACTIVE</span>
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">SQLITE DETERMINISTIC REPLICA</span>
            </div>
          </div>

          {/* Platform Interior Mockup Grid */}
          <div className="p-6 sm:p-8 bg-slate-50/60">
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Active Polar Traverses</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">04 Missions</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">All convoys tracking</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Critical Fuel Reserves</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">94.2% Nominal</div>
                <div className="text-[11px] text-sky-600 font-medium mt-0.5">+28 days safety buffer</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Field Specialists on Ice</div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">26 Deployed</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">3 Base stations + 1 convoy</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">System Health</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">100% Coherent</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">0 Out-of-sync conflicts</div>
              </div>
            </div>

            {/* Split Command View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Traverse Map & Route Progress */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                      Active Overland Mission: Operation 047 (Maitri &rarr; Station 07)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded font-semibold">
                    WAYPOINT 02 APPROACH
                  </span>
                </div>

                {/* Visual Route Pipeline Bar */}
                <div className="relative py-4 px-2">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 via-blue-600 to-sky-400 w-3/5" />
                  </div>
                  <div className="flex justify-between text-xs mt-3 text-slate-600 font-medium">
                    <div className="text-left">
                      <div className="font-bold text-slate-900">Maitri Base Camp</div>
                      <div className="text-[10px] text-slate-400 font-mono">0.0 km • Departed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sky-700">Crevasse Zone Beta</div>
                      <div className="text-[10px] text-sky-600 font-mono">82.4 km • En-Route</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">Field Station 07</div>
                      <div className="text-[10px] text-slate-400 font-mono">142.4 km • ETA 18:30</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3.5 bg-sky-50/60 rounded-lg border border-sky-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Radio className="w-4 h-4 text-sky-600" />
                    <span>BLE Peer Replica synchronized with Convoy Unit 01. Telemetry latency: 12ms.</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-semibold">
                    LOCAL PEER OK
                  </span>
                </div>
              </div>

              {/* Right Col: AI Decision & Impact Recommendation */}
              <div className="bg-white rounded-xl border border-sky-100 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-3 pb-3 border-b border-slate-100">
                    <Cpu className="w-4 h-4 text-sky-600" />
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                      Grounded AI Decision Support
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-2.5">
                    <div className="font-semibold text-slate-800">
                      Recommendation REC-094
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      SOP Rule 14.2: High surface wind gusts detected (42 km/h). AI suggests adjusting towing speed from 22 km/h to 16 km/h to maintain safety margins.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-[11px] text-amber-800 font-mono">
                      &bull; Delay: +24 mins (Accepted)
                      <br />
                      &bull; Crevasse Risk Factor: Reduced 40%
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-mono text-slate-400 mb-2">
                    HUMAN APPROVAL REQUIRED (ZERO SILENT ACTIONS)
                  </div>
                  <Link
                    to="/dashboard"
                    className="w-full py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition"
                  >
                    <span>Launch Live Interactive Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
