import React from 'react';
import { 
  CloudSnow, 
  Map, 
  Package, 
  AlertTriangle, 
  Siren, 
  Ship, 
  Waves, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Fuel,
  Anchor,
  Wind
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IntelligenceSection() {
  return (
    <section id="intelligence" className="relative w-full py-16 sm:py-20 bg-transparent select-none overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-sky-100/70 border border-sky-200/80 text-sky-800 text-[11px] font-mono font-semibold uppercase mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span>• INTELLIGENCE LAYER</span>
          </div>

          <h2 className="font-serif font-medium text-slate-900 text-3xl sm:text-4xl tracking-tight">
            From raw data to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800">
              mission decisions.
            </span>
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
            AI-powered decision support for polar maritime transport, calculating safer passages through sea ice, predicting vessel fuel burn, and mobilizing rapid emergency response.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="space-y-4 sm:space-y-5">
          
          {/* Top Row: 2 Clean Mobile Layouts (Light White & Sky Blue) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Mobile Layout 1: 🗺 Route Intelligence (Ship Maritime Passage) */}
            <div className="bg-[#f0f6fc] border border-sky-200/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-sky-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-sky-800 uppercase">
                    <span>🗺</span>
                    <span>Route Intelligence</span>
                  </div>
                  <span className="text-[10px] font-mono bg-white/90 text-sky-700 px-2 py-0.5 rounded border border-sky-200/60 font-semibold">
                    SHIP PASSAGE
                  </span>
                </div>

                <h3 className="font-sans font-bold text-slate-900 text-base sm:text-lg mb-1">
                  Identify safer and more practical routes.
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed mb-4">
                  Dynamically navigates 4,200 NM Southern Ocean corridors, tracking ice concentration radar (4/10) to optimize icebreaker transit and avoid impassable pack ice.
                </p>
              </div>

              {/* 3D Mobile Visual - Light White & Blue Theme */}
              <div className="relative w-full rounded-xl bg-white/70 border border-sky-100 p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                <img
                  src="/ship_route_light.jpg"
                  alt="Aurora Route Intelligence Mobile View on Polar Research Vessel"
                  className="w-full max-w-[280px] sm:max-w-[300px] h-auto object-contain rounded-lg drop-shadow-[0_8px_16px_rgba(15,23,42,0.06)]"
                  loading="lazy"
                />
                <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-sm border border-sky-200/80 rounded-md px-2 py-1 text-[10px] font-mono text-slate-600 shadow-xs flex items-center space-x-1.5">
                  <Ship className="w-3 h-3 text-sky-600" />
                  <span>MV Arctic Guardian • 14 Knots</span>
                </div>
              </div>
            </div>

            {/* Mobile Layout 2: 🚨 Emergency Intelligence (Icebreaker Vessel SAR) */}
            <div className="bg-[#f2f7fd] border border-sky-200/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-sky-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-rose-800 uppercase">
                    <span>🚨</span>
                    <span>Emergency Intelligence</span>
                  </div>
                  <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>ACTIVE SOS</span>
                  </span>
                </div>

                <h3 className="font-sans font-bold text-slate-900 text-base sm:text-lg mb-1">
                  Support rapid response during critical events.
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed mb-4">
                  Coordinates emergency ship operations when field stations trigger an SOS. Reroutes R/V Polaris through sea ice leads with 96% engine readiness and live SAR telemetry.
                </p>
              </div>

              {/* 3D Mobile Visual - Light White & Blue Theme */}
              <div className="relative w-full rounded-xl bg-white/70 border border-sky-100 p-2 sm:p-3 flex items-center justify-center overflow-hidden">
                <img
                  src="/ship_emergency_light.jpg"
                  alt="Aurora Emergency Intelligence Mobile View - Polar Vessel SAR"
                  className="w-full max-w-[280px] sm:max-w-[300px] h-auto object-contain rounded-lg drop-shadow-[0_8px_16px_rgba(15,23,42,0.06)]"
                  loading="lazy"
                />
                <div className="absolute bottom-3 right-4 bg-white/90 backdrop-blur-sm border border-rose-200/80 rounded-md px-2 py-1 text-[10px] font-mono text-rose-700 shadow-xs flex items-center space-x-1.5">
                  <Siren className="w-3 h-3 text-rose-600" />
                  <span>ETA to Station: 7h 42m</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row: 3 Minimal Specialized Layouts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Card 3: 🌦 Weather Intelligence (Oceanographic Marine Telemetry) */}
            <div className="bg-[#eef4fb] border border-sky-200/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-sky-300 transition-colors">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-sky-800 uppercase mb-1.5">
                  <span>🌦</span>
                  <span>Weather Intelligence</span>
                </div>
                <h4 className="font-sans font-semibold text-slate-900 text-sm mb-1">
                  Detect changing environmental conditions.
                </h4>
                <p className="text-[11.5px] text-slate-500 font-sans leading-relaxed mb-3">
                  Ocean buoys & shipboard sensors monitor swell height, pack ice pressure, and katabatic wind shifts across polar waters.
                </p>
              </div>

              {/* Minimal Marine Weather Widget */}
              <div className="bg-white/80 rounded-xl p-3 border border-sky-100 text-xs font-mono space-y-1.5">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center space-x-1 text-[11px]">
                    <Waves className="w-3 h-3 text-sky-600" />
                    <span>Swell Height</span>
                  </span>
                  <span className="font-bold text-slate-800 text-[11px]">5.2m (Sea State 6)</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center space-x-1 text-[11px]">
                    <Wind className="w-3 h-3 text-sky-600" />
                    <span>Gale Winds</span>
                  </span>
                  <span className="font-bold text-rose-700 text-[11px]">52 Knots</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-[11px]">Pack Ice Level</span>
                  <span className="font-bold text-slate-800 text-[11px]">6/10 Concentration</span>
                </div>
              </div>
            </div>

            {/* Card 4: ⚠️ Risk Detection (Vessel Hull & Iceberg Tracking) */}
            <div className="bg-[#f5f8fc] border border-slate-200/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-sky-300 transition-colors">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-800 uppercase mb-1.5">
                  <span>⚠️</span>
                  <span>Risk Detection</span>
                </div>
                <h4 className="font-sans font-semibold text-slate-900 text-sm mb-1">
                  Identify potential mission disruptions early.
                </h4>
                <p className="text-[11.5px] text-slate-500 font-sans leading-relaxed mb-3">
                  Correlates satellite SAR imagery and hull acoustic sensors to alert navigators of submerged growlers and compression ridges.
                </p>
              </div>

              {/* Minimal Risk Matrix Badge */}
              <div className="bg-white/80 rounded-xl p-3 border border-slate-200/80 text-xs font-mono space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Iceberg Drift B-15Y</span>
                  <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    Diverted 8 NM
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Hull Stress Load</span>
                  <span className="text-emerald-700 font-bold text-[11px]">42% (Normal)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Early Warning</span>
                  <span className="text-sky-700 font-bold text-[11px]">Lead Channel Clear</span>
                </div>
              </div>
            </div>

            {/* Card 5: 📦 Resource Intelligence (Ship Marine Fuel & Cargo) */}
            <div className="bg-[#eff7f2] border border-emerald-200/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div>
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-800 uppercase mb-1.5">
                  <span>📦</span>
                  <span>Resource Intelligence</span>
                </div>
                <h4 className="font-sans font-semibold text-slate-900 text-sm mb-1">
                  Predict shortages and optimize supplies.
                </h4>
                <p className="text-[11.5px] text-slate-500 font-sans leading-relaxed mb-3">
                  Models heavy marine fuel consumption across heavy ice conditions and tracks 1,200 tonnes of expedition container manifest.
                </p>
              </div>

              {/* Minimal Resource Pill Display */}
              <div className="bg-white/80 rounded-xl p-3 border border-emerald-100 text-xs font-mono space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                    <Fuel className="w-3 h-3 text-emerald-600" />
                    <span>Marine Fuel (MGO)</span>
                  </span>
                  <span className="font-bold text-slate-800 text-[11px]">1,200 T (21d buffer)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Science Containers</span>
                  <span className="text-emerald-700 font-bold text-[11px]">42 Units Secured</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Fresh Water Gen</span>
                  <span className="text-sky-700 font-bold text-[11px]">100% Operational</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
