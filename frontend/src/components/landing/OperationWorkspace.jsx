import React, { useState } from 'react';
import { 
  Compass, 
  Package, 
  Navigation2, 
  Cpu, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Truck, 
  Wind, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function OperationWorkspace() {
  const [activePillar, setActivePillar] = useState('Operations');

  // The 5 Product Definition Pillars as specified by the user
  const pillars = [
    {
      id: 'Operations',
      title: 'Operations',
      desc: 'Create and manage transportation, research and field operations.',
      icon: Compass,
      badge: 'MISSION CORE'
    },
    {
      id: 'Logistics',
      title: 'Logistics',
      desc: 'Coordinate cargo, equipment, inventory and supplies.',
      icon: Package,
      badge: 'PAYLOAD & FUEL'
    },
    {
      id: 'Mobility',
      title: 'Mobility',
      desc: 'Track vessels, aircraft, vehicles and personnel movement.',
      icon: Navigation2,
      badge: 'FLEET & CREW'
    },
    {
      id: 'Intelligence',
      title: 'Intelligence',
      desc: 'Monitor weather, environmental conditions and route risks.',
      icon: Cpu,
      badge: 'RADAR & SENSORS'
    },
    {
      id: 'Response',
      title: 'Response',
      desc: 'Detect incidents, activate SOS and coordinate emergency teams.',
      icon: AlertTriangle,
      badge: 'SAFETY & SOS'
    }
  ];

  return (
    <section className="relative w-full py-20 sm:py-28 bg-transparent select-none overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-sky-200/30 via-blue-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/70 border border-sky-200/80 text-sky-800 text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
            <span>04 — PRODUCT ARCHITECTURE</span>
          </div>

          <h2 className="font-serif font-normal sm:font-medium tracking-normal text-slate-900 text-3xl sm:text-4xl lg:text-[46px] leading-[1.18]">
            Built around the operation, not the department.
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            The video shows the journey; this section defines the product. Every capability converges into one cohesive operational workspace.
          </p>
        </div>

        {/* 5 Product Pillars Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isSelected = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white border-sky-400 shadow-lg shadow-sky-950/5 ring-2 ring-sky-500/20 -translate-y-1'
                    : 'bg-white/70 border-sky-200/70 hover:bg-white hover:border-sky-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-slate-900 text-white' : 'bg-sky-50 text-sky-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-slate-900 text-sm tracking-wide mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-semibold">
                  <span className={isSelected ? 'text-sky-700' : 'text-slate-400'}>
                    {isSelected ? 'ACTIVE VIEW' : 'INSPECT'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-0.5 text-sky-700' : 'text-slate-300'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Operation Workspace Console: OPERATION 047 */}
        <div className="w-full bg-white/95 backdrop-blur-xl border border-sky-200/90 rounded-2xl sm:rounded-3xl shadow-2xl shadow-sky-950/10 overflow-hidden text-left">
          
          {/* OPERATION 047 Header */}
          <div className="px-6 sm:px-8 py-6 border-b border-sky-100 bg-gradient-to-r from-sky-50/70 via-blue-50/40 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className="font-mono text-xs font-black text-sky-800 tracking-widest uppercase">
                  OPERATION 047
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>STATUS: ACTIVE</span>
                </span>
              </div>
              <h3 className="font-serif font-medium text-slate-900 text-2xl sm:text-3xl">
                Antarctic Field Deployment
              </h3>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 bg-white/80 px-3 py-1.5 rounded-lg border border-sky-100">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>LIVE TRAVERSE CONVOY • DAY 04 OF 12</span>
            </div>
          </div>

          {/* Divider Line as specified by user */}
          <div className="w-full border-t border-dashed border-sky-200/80 px-6 sm:px-8" />

          {/* The Exact Authoritative Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-sky-100/90 bg-sky-50/20 text-left border-b border-sky-100">
            {/* ROUTE */}
            <div className="p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-sky-600" />
                <span>ROUTE</span>
              </div>
              <div className="font-sans font-black text-slate-900 text-xs sm:text-sm">
                Maitri &rarr; Field Station 07
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">142 km Traverse</div>
            </div>

            {/* PERSONNEL */}
            <div className="p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1 flex items-center space-x-1">
                <Users className="w-3 h-3 text-sky-600" />
                <span>PERSONNEL</span>
              </div>
              <div className="font-sans font-black text-slate-900 text-xs sm:text-sm">
                08 deployed
              </div>
              <div className="text-[10px] font-mono text-emerald-600 mt-0.5">Vitals Nominal</div>
            </div>

            {/* CARGO */}
            <div className="p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1 flex items-center space-x-1">
                <Package className="w-3 h-3 text-sky-600" />
                <span>CARGO</span>
              </div>
              <div className="font-sans font-black text-slate-900 text-xs sm:text-sm">
                1.8 tonnes
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">Fuel & Science Payloads</div>
            </div>

            {/* ASSETS */}
            <div className="p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1 flex items-center space-x-1">
                <Truck className="w-3 h-3 text-sky-600" />
                <span>ASSETS</span>
              </div>
              <div className="font-sans font-black text-slate-900 text-xs sm:text-sm">
                2 vehicles
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">PistenBully Tracked</div>
            </div>

            {/* ENVIRONMENT */}
            <div className="p-4 sm:p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1 flex items-center space-x-1">
                <Wind className="w-3 h-3 text-sky-600" />
                <span>ENVIRONMENT</span>
              </div>
              <div className="font-sans font-black text-slate-900 text-xs sm:text-sm">
                &minus;31&deg;C | Wind 42 km/h
              </div>
              <div className="text-[10px] font-mono text-amber-600 mt-0.5">Blizzard Watch</div>
            </div>

            {/* STATUS */}
            <div className="p-4 sm:p-5 col-span-2 sm:col-span-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>STATUS</span>
              </div>
              <div className="font-sans font-black text-emerald-700 text-xs sm:text-sm uppercase tracking-wide">
                ACTIVE
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">SQLite Deterministic</div>
            </div>
          </div>

          {/* Dynamic Active Pillar Workspace View */}
          <div className="p-6 sm:p-8 bg-slate-50/50 min-h-[260px]">
            {activePillar === 'Operations' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    OPERATION 047 OBJECTIVES
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Traverse convoy departure from Maitri Base Camp</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Cross Shelf Gate WP-01 before blizzard front</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-sky-500 shrink-0" />
                      <span className="font-semibold text-slate-900">Install deep-ice sensor mast at Field Station 07</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    CONVOY PROGRESS
                  </div>
                  <div className="text-xs text-slate-600">
                    Traveling at 18.2 km/h across firm ice crust.
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-sky-600 h-full w-[58%]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                    <span>Maitri Base (0 km)</span>
                    <span className="text-sky-700 font-bold">58% Complete</span>
                    <span>Station 07 (142 km)</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    OFFLINE CORE INTEGRITY
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Local SQLite state replica is authoritative. Zero reliance on internet connectivity or external APIs.
                  </p>
                  <div className="mt-3 text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                    &bull; Peer-to-peer BLE replica synchronized
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'Logistics' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    POLAR FUEL RESIDUALS
                  </div>
                  <div className="text-2xl font-bold text-slate-900">800 Liters</div>
                  <div className="text-xs text-slate-500 mt-1">Arctic Grade Diesel A-1</div>
                  <div className="mt-3 text-[11px] font-mono text-emerald-600 bg-emerald-50 p-2 rounded">
                    +28% Safety margin for blizzard idle heating
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    DEEP-ICE DRILLING RIG
                  </div>
                  <div className="text-2xl font-bold text-slate-900">620 kg</div>
                  <div className="text-xs text-slate-500 mt-1">Mounted on Sledge S-02</div>
                  <div className="mt-3 text-[11px] font-mono text-sky-700 bg-sky-50 p-2 rounded">
                    Towing stability index: 1.0 (Optimal)
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    SURVIVAL RATIONS & CRYO
                  </div>
                  <div className="text-2xl font-bold text-slate-900">400 kg</div>
                  <div className="text-xs text-slate-500 mt-1">21-Day Crew Contingency Decks</div>
                  <div className="mt-3 text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded">
                    Specimen cold-chain maintained at -20&deg;C
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'Mobility' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    LEAD VEHICLE (PISTENBULLY 300)
                  </div>
                  <div className="font-bold text-slate-800 text-sm">Unit PB-01 // Polar Track</div>
                  <div className="text-xs text-slate-500 mt-1">Engine temp: 84&deg;C • Oil viscosity nominal</div>
                  <div className="mt-3 text-[11px] font-mono text-sky-700 bg-sky-50 p-2 rounded">
                    Driver: Capt. Mark Jansen
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    SUPPORT VEHICLE (HAGGLUNDS BV206)
                  </div>
                  <div className="font-bold text-slate-800 text-sm">Unit BV-02 // All-Terrain Amphibious</div>
                  <div className="text-xs text-slate-500 mt-1">Auxiliary battery: 96% • Winch ready</div>
                  <div className="mt-3 text-[11px] font-mono text-sky-700 bg-sky-50 p-2 rounded">
                    Mechanic: Sgt. Tariq Al-Mansoor
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    CREW ROSTER ON ICE
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>&bull; Dr. Elena Vance (Mission Lead)</div>
                    <div>&bull; Dr. K. Nambiar (Glaciologist)</div>
                    <div>&bull; Jonas Richter (Field Medic)</div>
                    <div>&bull; +5 Technical Specialists</div>
                  </div>
                </div>
              </div>
            )}

            {activePillar === 'Intelligence' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    ENVIRONMENTAL TELEMETRY
                  </div>
                  <div className="text-xl font-bold text-slate-900">&minus;31.4&deg;C</div>
                  <div className="text-xs text-slate-500 mt-0.5">Windchill: &minus;48&deg;C • Barometer: 982 hPa</div>
                  <div className="mt-3 text-[11px] font-mono text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                    Katabatic wind gusts reaching 58 km/h
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    CREVASSE RADAR SURVEY
                  </div>
                  <div className="font-bold text-slate-800 text-sm">Sector Beta Safe Corridor</div>
                  <div className="text-xs text-slate-500 mt-1">Ground radar detected 0 hidden snow bridges</div>
                  <div className="mt-3 text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                    Safe traverse window: 6 hours remaining
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    GROUNDED AI RISK MATRIX
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Traces environmental variance directly against mission fuel consumption and vehicle braking distance.
                  </p>
                </div>
              </div>
            )}

            {activePillar === 'Response' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-5 rounded-xl border border-amber-200 shadow-sm bg-amber-50/15">
                  <div className="flex items-center space-x-2 text-[11px] font-mono font-bold text-amber-800 uppercase mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>INCIDENT SOLVER: SNO-DRIFT WARNING</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Deterministic impact engine recommends adjusting departure timing or taking Saddle Ridge Track B to avoid drifting sastrugi snowbanks.
                  </p>
                  <div className="mt-3 flex items-center space-x-3 text-[11px] font-mono">
                    <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-semibold">
                      Recommendation Ready for Commander
                    </span>
                    <span className="text-slate-500">Zero automated override</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
                  <div className="text-[11px] font-mono font-bold text-sky-700 uppercase mb-2">
                    EMERGENCY SOS STATUS
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>All Beacons Armed (Standby)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Base Camp Maitri SAR helicopter on 30-minute scramble notice.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
