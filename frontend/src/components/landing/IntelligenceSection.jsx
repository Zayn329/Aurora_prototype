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
  Wind,
  Navigation2,
  Clock,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

export default function IntelligenceSection() {
  // Waypoint table dataset for the Southern Ocean maritime route
  const waypoints = [
    {
      code: "WP-01",
      name: "Cape Town Port",
      coord: "33°55'S 18°25'E",
      ice: "0/10 (Clear)",
      eta: "Departed",
      status: "COMPLETED",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      code: "WP-02",
      name: "Roaring Forties",
      coord: "45°10'S 14°20'E",
      ice: "2/10 (Open)",
      eta: "Passed",
      status: "OPTIMAL",
      statusColor: "bg-sky-50 text-sky-700 border-sky-200"
    },
    {
      code: "WP-03",
      name: "Polar Front Swell",
      coord: "54°30'S 08°15'E",
      ice: "4/10 (Lead)",
      eta: "+14h 20m",
      status: "IN TRANSIT",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200 font-bold"
    },
    {
      code: "WP-04",
      name: "Maud Rise Channel",
      coord: "64°15'S 03°40'E",
      ice: "6/10 (Pack)",
      eta: "+38h 10m",
      status: "ESCORT REQ",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200 font-bold"
    },
    {
      code: "WP-05",
      name: "India Bay Shelf",
      coord: "69°58'S 11°55'E",
      ice: "8/10 (Fast)",
      eta: "+72h 30m",
      status: "TARGET DOCK",
      statusColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
    }
  ];

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
          
          {/* ROW 1: Mobile Layout 1 (Route Intelligence) + Table View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            
            {/* Box 1: 🗺 Route Intelligence (Mobile Layout — Clean & Seamless 3D Floating Phone) */}
            <div className="lg:col-span-6 bg-[#f0f6fc] border border-sky-200/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-sky-300 transition-colors relative overflow-hidden">
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
                <p className="text-xs text-slate-500 font-sans leading-relaxed mb-2">
                  Dynamically navigates 4,200 NM Southern Ocean corridors, tracking ice concentration radar (4/10) to optimize icebreaker transit and avoid impassable pack ice.
                </p>
              </div>

              {/* Seamless 3D Phone Layout — Directly Blended into Content Box Background */}
              <div className="relative w-full py-2 flex items-center justify-center">
                <img
                  src="/ship_route_transparent.png"
                  alt="Aurora Route Intelligence 3D Mobile View"
                  className="w-full max-w-[270px] sm:max-w-[290px] h-auto object-contain drop-shadow-[0_16px_28px_rgba(15,23,42,0.12)] hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm border border-sky-200/80 rounded-md px-2 py-1 text-[10px] font-mono text-slate-700 shadow-sm flex items-center space-x-1.5">
                  <Ship className="w-3 h-3 text-sky-600" />
                  <span>MV Arctic Guardian • 14 Knots</span>
                </div>
              </div>
            </div>

            {/* Box 2: Table View According to Maritime Route Content */}
            <div className="lg:col-span-6 bg-[#f7faff] border border-sky-200/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-sky-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-700 uppercase">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
                    <span>Passage Navigation Table</span>
                  </div>
                  <span className="text-[10px] font-mono bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200/60 font-semibold">
                    4,200 NM PASSAGE
                  </span>
                </div>

                <h3 className="font-sans font-bold text-slate-900 text-base sm:text-lg mb-1">
                  Southern Ocean Waypoint Corridor
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed mb-3">
                  Real-time waypoint coordinates, sea ice concentration levels, and bridge navigation ETA calculations.
                </p>

                {/* Minimal Tactical Polar Table */}
                <div className="overflow-x-auto rounded-xl border border-sky-200/80 bg-white/90 shadow-2xs">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-sky-50/70 text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-sky-200/60">
                      <tr>
                        <th className="py-2 px-2.5 font-bold">Waypoint</th>
                        <th className="py-2 px-2 font-bold hidden sm:table-cell">Coordinates</th>
                        <th className="py-2 px-2 font-bold">Sea Ice</th>
                        <th className="py-2 px-2 font-bold">ETA</th>
                        <th className="py-2 px-2.5 font-bold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {waypoints.map((wp) => (
                        <tr key={wp.code} className="hover:bg-sky-50/40 transition-colors">
                          <td className="py-2 px-2.5 font-bold text-slate-900 font-sans">
                            <span className="text-[10px] font-mono text-slate-400 mr-1">{wp.code}</span>
                            {wp.name}
                          </td>
                          <td className="py-2 px-2 text-slate-500 hidden sm:table-cell">{wp.coord}</td>
                          <td className="py-2 px-2 text-slate-700">{wp.ice}</td>
                          <td className="py-2 px-2 text-slate-600">{wp.eta}</td>
                          <td className="py-2 px-2.5 text-right">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] border ${wp.statusColor}`}>
                              {wp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table Summary Strip */}
              <div className="mt-3 pt-2.5 border-t border-sky-200/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>TOTAL PASSAGE: 4,200 NM</span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>ICE CLEARANCE: 94.2%</span>
                </span>
              </div>
            </div>

          </div>

          {/* ROW 2: Mobile Layout 2 (Emergency Intelligence) + Resource Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
            
            {/* Box 3: 🚨 Emergency Intelligence (Mobile Layout — Clean & Seamless 3D Floating Phone) */}
            <div className="lg:col-span-6 bg-[#f2f7fd] border border-sky-200/70 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-sky-300 transition-colors relative overflow-hidden">
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
                <p className="text-xs text-slate-500 font-sans leading-relaxed mb-2">
                  Coordinates emergency ship operations when field stations trigger an SOS. Reroutes R/V Polaris through sea ice leads with 96% engine readiness and live SAR telemetry.
                </p>
              </div>

              {/* Seamless 3D Phone Layout — Directly Blended into Content Box Background */}
              <div className="relative w-full py-2 flex items-center justify-center">
                <img
                  src="/ship_emergency_transparent.png"
                  alt="Aurora Emergency Intelligence 3D Mobile View"
                  className="w-full max-w-[270px] sm:max-w-[290px] h-auto object-contain drop-shadow-[0_16px_28px_rgba(15,23,42,0.12)] hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-3 bg-white/90 backdrop-blur-sm border border-rose-200/80 rounded-md px-2 py-1 text-[10px] font-mono text-rose-700 shadow-sm flex items-center space-x-1.5">
                  <Siren className="w-3 h-3 text-rose-600" />
                  <span>ETA to Station: 7h 42m</span>
                </div>
              </div>
            </div>

            {/* Box 4: 📦 Resource Intelligence (Ship Marine Fuel & Cargo Diagram) */}
            <div className="lg:col-span-6 bg-[#eff7f2] border border-emerald-200/60 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-800 uppercase">
                    <span>📦</span>
                    <span>Resource Intelligence</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    VESSEL CONSUMABLES
                  </span>
                </div>

                <h3 className="font-sans font-bold text-slate-900 text-base sm:text-lg mb-1">
                  Predict shortages and optimize supplies.
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed mb-4">
                  Models heavy marine fuel consumption across heavy pack ice, tracks 1,200 tonnes of expedition container manifest, and prevents cold-climate resource exhaustion.
                </p>

                {/* Resource Gauges & Telemetry Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white/85 rounded-xl p-3 border border-emerald-100 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <Fuel className="w-3 h-3 text-emerald-600" />
                        <span>Marine Gas Oil</span>
                      </span>
                      <span className="font-bold text-slate-800">1,200 T</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-1">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '84%' }} />
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 flex justify-between">
                      <span>21d cruising buffer</span>
                      <span>84% left</span>
                    </div>
                  </div>

                  <div className="bg-white/85 rounded-xl p-3 border border-emerald-100 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="text-slate-500 flex items-center space-x-1">
                        <Package className="w-3 h-3 text-sky-600" />
                        <span>Science Cargo</span>
                      </span>
                      <span className="font-bold text-slate-800">42 Units</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-1">
                      <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: '100%' }} />
                    </div>
                    <div className="text-[10px] font-mono text-sky-700 flex justify-between">
                      <span>Cryo tanks secured</span>
                      <span>100% nominal</span>
                    </div>
                  </div>

                  <div className="bg-white/85 rounded-xl p-3 border border-emerald-100 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="text-slate-500">Fresh Water Gen</span>
                      <span className="font-bold text-slate-800">4,800 L/d</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">Desalination operational</div>
                  </div>

                  <div className="bg-white/85 rounded-xl p-3 border border-emerald-100 shadow-2xs">
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="text-slate-500">Cape Town Sea Lift</span>
                      <span className="font-bold text-emerald-700">Resupply Ready</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">Next depot dock: 4d</div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>BURN MODEL: ARCTIC POLAR SOLVER</span>
                <span className="text-emerald-800 font-bold">STATUS: BALANCED</span>
              </div>
            </div>

          </div>

          {/* ROW 3: 2 Complementary Cards (Weather Intelligence + Risk Detection) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Box 5: 🌦 Weather Intelligence (Oceanographic Marine Telemetry) */}
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
                  Ocean buoys & shipboard telemetry monitor swell height, pack ice pressure, and katabatic wind shifts across polar waters.
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

            {/* Box 6: ⚠️ Risk Detection (Vessel Hull & Iceberg Tracking) */}
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

          </div>

        </div>

      </div>
    </section>
  );
}
