import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Play,
  Pause,
  Plus,
  Minus,
  Crosshair,
  Compass,
  AlertTriangle,
  Radio,
  ExternalLink,
  X,
  ChevronUp,
  ChevronRight,
  Users,
  BatteryCharging,
  Thermometer,
  Wind,
  ShieldCheck,
  Building,
  LayoutDashboard,
  Globe,
  Truck,
  Box,
  CheckCircle2,
  ArrowRight,
  Activity,
  Layers,
  FileText,
  Clock,
  Zap,
  Server
} from 'lucide-react';
import Real3DGlobe, { EXPEDITION_WAYPOINTS } from '../components/Real3DGlobe';
import bharatiData from '../data/bharati_mission_dataset.json';

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // 3D Globe States
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(
    EXPEDITION_WAYPOINTS.find(w => w.id === 'bharati') || EXPEDITION_WAYPOINTS[0]
  );

  const { overview, missions, routes, incidents, causality_chain } = bharatiData;

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.25, 2.2));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 0.25, 0.75));
  };

  const handleRecenter = () => {
    setZoomScale(1);
    setSelectedStation(EXPEDITION_WAYPOINTS.find(w => w.id === 'bharati') || null);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f4f6fa] text-slate-800 font-sans pb-16">
      
      {/* ========================================================================= */}
      {/* TOP VIEWPORT BAR: SWITCHER (SYSTEM OVERVIEW vs 3D POLAR MAP)              */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-3 flex items-center justify-between">
        
        {/* Left: View Title & Station Callsign */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              Bharati Station
            </span>
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200/60">
              ANT-026
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            69°24'S 76°11'E · Eastern Antarctica
          </span>
        </div>

        {/* Center/Right: Tab Switcher (Overview vs Map) */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setSearchParams({ tab: 'overview' })}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>System Overview</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'map' })}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'map'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Polar Globe</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* VIEW A: 3D POLAR GLOBE VIEW                                               */}
      {/* ========================================================================= */}
      {activeTab === 'map' && (
        <div className="relative w-full h-[calc(100vh-4.5rem)] min-h-[640px] overflow-hidden select-none">
          
          {/* Full 3D Interactive Rotating Earth Globe Canvas */}
          <div className="absolute inset-0 z-0">
            <Real3DGlobe 
              isAutoRotating={isAutoRotating}
              rotationSpeed={rotationSpeed}
              zoomScale={zoomScale}
              selectedStationId={selectedStation?.id}
              onSelectStation={(station) => {
                setSelectedStation(station);
                setIsOverviewOpen(true);
              }}
            />
          </div>

          {/* Decorative Orbit Circles Behind/Around Globe Canvas */}
          <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-40">
            <div className="w-[660px] h-[660px] rounded-full border border-slate-300 relative">
              <div className="absolute inset-16 rounded-full border border-slate-300/60" />
              <div className="absolute inset-32 rounded-full border border-slate-300/40" />
            </div>
          </div>

          {/* Right Floating Globe Controls */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 interactive-control-overlay flex flex-col items-center space-y-2 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-lg shadow-slate-200/50 flex flex-col items-center space-y-1">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isAutoRotating 
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title={isAutoRotating ? "Pause Globe Rotation" : "Start Continuous Rotation"}
              >
                {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => setRotationSpeed(prev => (prev === 1 ? 2.5 : 1))}
                className={`w-9 h-9 rounded-xl text-xs font-mono font-bold flex items-center justify-center transition ${
                  rotationSpeed > 1 
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Toggle Rotation Speed"
              >
                {rotationSpeed > 1 ? '2.5x' : '1.0x'}
              </button>

              <div className="w-5 border-t border-slate-200 my-1" />

              <button
                onClick={handleZoomIn}
                className="w-9 h-9 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>

              <button
                onClick={handleZoomOut}
                className="w-9 h-9 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-5 border-t border-slate-200 my-1" />

              <button
                onClick={handleRecenter}
                className="w-9 h-9 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition"
                title="Recenter Globe View"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom-Left Bharati Research Station Expandable Overview */}
          <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
            {!isOverviewOpen ? (
              <button
                onClick={() => setIsOverviewOpen(true)}
                className="flex items-center space-x-3 px-4 py-2.5 bg-white/95 hover:bg-white backdrop-blur-xl border border-slate-200/90 hover:border-purple-300 rounded-2xl shadow-lg shadow-slate-200/60 transition-all group"
                title="Click to view detailed overview of Bharati Research Station"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition">
                    Bharati Research Station
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono">
                    Click for detailed overview
                  </span>
                </div>
                <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100 transition">
                  <ChevronUp className="w-3.5 h-3.5" />
                </div>
              </button>
            ) : (
              <div className="max-w-md w-full sm:w-[410px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-5 shadow-2xl shadow-slate-300/40 transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-purple-700 font-bold flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                      <span>Larsemann Hills · East Antarctica</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {selectedStation?.name || "Bharati Research Station"}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsOverviewOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-mono">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Users className="w-3 h-3 text-indigo-500" />
                      <span>Personnel</span>
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">46 Deployed</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-mono">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <BatteryCharging className="w-3 h-3 text-emerald-500" />
                      <span>Power Autonomy</span>
                    </span>
                    <span className="font-bold text-emerald-700 text-sm mt-0.5 block">82% (142 Days)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-mono">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Thermometer className="w-3 h-3 text-sky-500" />
                      <span>Surface Temp</span>
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">-24°C High</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-xs font-mono">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Wind className="w-3 h-3 text-amber-500" />
                      <span>Wind Speed</span>
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">18 km/h Normal</span>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-100 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="font-semibold text-slate-800">69°24'28"S, 76°11'14"E</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Expedition Lead:</span>
                    <span className="font-semibold text-slate-800">Dr. Sunita Rao</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">SATCOM Uplink:</span>
                    <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Encrypted Primary Online</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <Link
                    to="/missions"
                    className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl text-xs text-center transition flex items-center justify-center space-x-1"
                  >
                    <span>Missions Log</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link
                    to="/incidents"
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                  >
                    Incidents
                  </Link>
                  <button
                    onClick={() => setIsOverviewOpen(false)}
                    className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs transition font-mono"
                  >
                    Collapse
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: FULL SYSTEM OVERVIEW ("HOW EVERYTHING IS WORKING")                */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="max-w-7xl mx-auto px-6 pt-6 space-y-6 animate-in fade-in duration-300">
          
          {/* 1. Core Subsystem Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Missions Active</span>
                <Compass className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-900">
                {overview?.active_missions || 4}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono flex items-center justify-between">
                <span>3 Planned · 8 Completed</span>
                <span className="text-purple-600 font-semibold">64% Overall</span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Personnel Deployed</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-900">
                {overview?.personnel_deployed || 46}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono">
                3 Research Stations & Field Camps
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Fleet & Assets</span>
                <Truck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3 text-3xl font-extrabold text-slate-900">
                {overview?.operational_assets || 17}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono">
                Snowcats, Otters, Generators, Habitats
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400">Open Incidents</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="mt-3 text-3xl font-extrabold text-rose-600">
                {overview?.open_incidents || 2}
              </div>
              <div className="mt-1 text-xs text-rose-600 font-mono">
                1 High Severity · Route R-03
              </div>
            </div>

          </div>

          {/* 4. Active Disruption & Causality Flow */}
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase text-rose-700">
                    Active Incident Analysis: INC-004
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Route R-03 Whiteout & Dependent Supply Line Impact
                </h3>
              </div>
              <Link
                to="/incidents"
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 rounded-xl text-xs transition flex items-center space-x-1 w-fit"
              >
                <span>Open Incident Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Step-by-step Causality Chain */}
            <div className="space-y-3">
              {(Array.isArray(causality_chain?.nodes) ? causality_chain.nodes : []).map((node, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border transition ${
                    node.status === 'ROUTE_RESTRICTED' || node.status === 'MISSION_IMPACTED' || node.status === 'ALERT_TRIGGERED'
                      ? 'bg-rose-50/60 border-rose-200/80 text-rose-950'
                      : node.status === 'HOLD_POSITION' || node.status === 'TRANSFER_PAUSED' || node.status === 'PENDING_COMMANDER'
                      ? 'bg-amber-50/60 border-amber-200/80 text-amber-950'
                      : 'bg-slate-50 border-slate-200/70 text-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-white font-mono text-xs font-bold flex items-center justify-center shadow-xs text-slate-700">
                        {node.step}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700">
                            {node.layer}
                          </span>
                          <span className="text-xs font-bold">{node.label}</span>
                        </div>
                        <span className="text-xs text-slate-600 font-sans block mt-0.5">
                          {node.value}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {node.badge && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/90 border border-slate-200/80 text-slate-600 shadow-2xs">
                          {node.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-white border border-slate-200 shadow-2xs w-fit">
                        {node.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Station Network Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Bharati Research Station */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold">
                  Primary Command Base
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Bharati Research Station</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Larsemann Hills · 69°24'S 76°11'E</p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Personnel:</span>
                  <span className="font-semibold text-slate-800">46 Scientists & Crew</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fuel Reserves:</span>
                  <span className="font-semibold text-emerald-600">82% (142 Days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SATCOM Uplink:</span>
                  <span className="font-semibold text-emerald-600">Primary 100% Online</span>
                </div>
              </div>
            </div>

            {/* Maitri Research Station */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold">
                  Inland Research Base
                </span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Maitri Research Station</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Schirmacher Oasis · 70°46'S 11°44'E</p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Operation:</span>
                  <span className="font-semibold text-slate-800">Active Geophysics</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Surface Temp:</span>
                  <span className="font-semibold text-slate-800">-28°C High Winds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Traverse Link:</span>
                  <span className="font-semibold text-slate-800">Route R-04 Nominal</span>
                </div>
              </div>
            </div>

            {/* Cape Town Logistics Gateway */}
            <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                  Maritime Logistics Port
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Cape Town Gateway</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">South Africa Staging Hub · 33°55'S 18°25'E</p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Charter Vessel:</span>
                  <span className="font-semibold text-slate-800">MV Vasiliy Golovnin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Manifest:</span>
                  <span className="font-semibold text-slate-800">38 Cargo Lots Dispatched</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sea Route:</span>
                  <span className="font-semibold text-indigo-600">Transit to Prydz Bay</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
