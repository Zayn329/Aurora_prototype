import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Plus,
  Minus,
  Crosshair,
  RotateCw,
  Compass,
  AlertTriangle,
  Radio,
  ExternalLink,
  X
} from 'lucide-react';
import Real3DGlobe, { EXPEDITION_WAYPOINTS } from '../components/Real3DGlobe';
import bharatiData from '../data/bharati_mission_dataset.json';

export default function DashboardPage() {
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [selectedStation, setSelectedStation] = useState(
    EXPEDITION_WAYPOINTS.find(w => w.id === 'bharati') || EXPEDITION_WAYPOINTS[0]
  );

  const { overview } = bharatiData;

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
    <div className="relative w-full h-[calc(100vh-1rem)] min-h-[720px] overflow-hidden select-none bg-[#f1f4f9] text-slate-800 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. FULL 3D INTERACTIVE ROTATING EARTH GLOBE                               */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <Real3DGlobe 
          isAutoRotating={isAutoRotating}
          rotationSpeed={rotationSpeed}
          zoomScale={zoomScale}
          selectedStationId={selectedStation?.id}
          onSelectStation={(station) => setSelectedStation(station)}
        />
      </div>

      {/* Decorative Thin Orbit Circles Behind/Around Globe Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-40">
        <div className="w-[820px] h-[820px] rounded-full border border-slate-300 relative">
          <div className="absolute inset-20 rounded-full border border-slate-300/60" />
          <div className="absolute inset-40 rounded-full border border-slate-300/40" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP MINIMAL EXPEDITION HUD BAR                                         */}
      {/* ========================================================================= */}
      <div className="absolute top-5 left-6 right-6 z-20 pointer-events-none flex items-center justify-between">
        
        {/* Left: Station Identity & Live Status */}
        <div className="pointer-events-auto flex items-center space-x-3 px-4 py-2.5 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-sm">
          <div className="relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <span>Bharati Research Station</span>
              <span className="text-[10px] font-mono text-purple-600 font-semibold px-1.5 py-0.5 bg-purple-50 rounded">
                ANT-026
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 font-mono">
              69°24'S 76°11'E · Eastern Antarctica · Real-Time Orbit
            </p>
          </div>
        </div>

        {/* Right: Quick Telemetry Pills */}
        <div className="pointer-events-auto hidden md:flex items-center space-x-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-sm text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-600 font-mono">
            <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>Missions: <strong className="text-slate-900">{overview?.active_missions || 4}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-50 text-slate-600 font-mono">
            <Compass className="w-3.5 h-3.5 text-cyan-500" />
            <span>Personnel: <strong className="text-slate-900">{overview?.personnel_deployed || 46}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-mono border border-rose-200/60">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Alert: <strong>Route R-03 Wind Hold</strong></span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. RIGHT FLOATING GLOBE NAVIGATION & ROTATION CONTROLS                    */}
      {/* ========================================================================= */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 interactive-control-overlay flex flex-col items-center space-y-2 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-1.5 shadow-lg shadow-slate-200/50 flex flex-col items-center space-y-1">
          
          {/* Toggle Continuous Auto-Rotation */}
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

          {/* Speed Toggle (1x / 2x) */}
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

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-5 border-t border-slate-200 my-1" />

          {/* Recenter Globe View to Polar Center */}
          <button
            onClick={handleRecenter}
            className="w-9 h-9 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition"
            title="Recenter Globe View"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SELECTED STATION / WAYPOINT DETAIL POPUP (Minimal Glass Card)         */}
      {/* ========================================================================= */}
      {selectedStation && (
        <div className="absolute bottom-6 left-6 z-20 pointer-events-auto max-w-sm w-full transition-all animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 shadow-xl shadow-slate-300/30">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-purple-700 font-bold flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `#${selectedStation.color.toString(16)}` }} />
                  <span>{selectedStation.region}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedStation.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedStation(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Coordinates:</span>
              <span className="font-semibold text-slate-800">
                {Math.abs(selectedStation.lat).toFixed(2)}°{selectedStation.lat < 0 ? 'S' : 'N'}, {Math.abs(selectedStation.lon).toFixed(2)}°{selectedStation.lon < 0 ? 'W' : 'E'}
              </span>
            </div>

            <div className="mt-1 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Operation:</span>
              <span className="font-semibold text-slate-800">{selectedStation.status}</span>
            </div>

            <div className="mt-3 pt-2 flex items-center space-x-2">
              <Link
                to="/missions"
                className="flex-1 py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl text-xs text-center transition flex items-center justify-center space-x-1"
              >
                <span>View Mission Log</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link
                to="/incidents"
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
              >
                Incidents
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BOTTOM HINT: INTERACTIVE INSTRUCTION                                   */}
      {/* ========================================================================= */}
      <div className="absolute bottom-5 right-6 z-10 pointer-events-none hidden sm:flex items-center space-x-2 text-[11px] font-mono text-slate-600 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
        <RotateCw className="w-3.5 h-3.5 animate-spin text-purple-600" style={{ animationDuration: '6s' }} />
        <span>Drag to rotate 3D Globe · Scroll/Buttons to Zoom · Click Node for details</span>
      </div>

    </div>
  );
}
