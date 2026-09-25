import React, { useState } from 'react';
import { 
  CloudSnow, 
  Navigation2, 
  Package, 
  ShieldAlert, 
  Radio, 
  Ship, 
  Waves, 
  Compass, 
  CheckCircle2, 
  Fuel, 
  Wind, 
  FileSpreadsheet,
  ArrowRight,
  Activity,
  Layers,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IntelligenceSection() {
  const [activeBottomRightView, setActiveBottomRightView] = useState('diagram'); // 'diagram' or 'mobile'

  // Waypoint table dataset for the Southern Ocean maritime route
  const waypoints = [
    {
      code: "WP-01",
      name: "Cape Town Port",
      coord: "33°55'S 18°25'E",
      ice: "0/10 Clear",
      status: "COMPLETED",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      code: "WP-02",
      name: "Roaring Forties",
      coord: "45°10'S 14°20'E",
      ice: "2/10 Open",
      status: "OPTIMAL",
      statusColor: "bg-sky-50 text-sky-700 border-sky-200"
    },
    {
      code: "WP-03",
      name: "Polar Front Swell",
      coord: "54°30'S 08°15'E",
      ice: "4/10 Lead",
      status: "IN TRANSIT",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200 font-bold"
    },
    {
      code: "WP-04",
      name: "Maud Rise Channel",
      coord: "64°15'S 03°40'E",
      ice: "6/10 Pack",
      status: "ESCORT REQ",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200 font-bold"
    },
    {
      code: "WP-05",
      name: "India Bay Shelf",
      coord: "69°58'S 11°55'E",
      ice: "8/10 Shelf",
      status: "TARGET DOCK",
      statusColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
    }
  ];

  return (
    <section id="intelligence" className="relative w-full py-16 sm:py-24 bg-transparent select-none overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          

          <h2 className="font-serif font-medium text-slate-900 text-3xl sm:text-4xl lg:text-[44px] tracking-tight leading-[1.2]">
            From raw data to mission decisions.

          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
            AI-powered decision support for polar maritime transport, calculating safer passages through sea ice, predicting vessel fuel burn, and mobilizing rapid emergency response.
          </p>
        </div>

        {/* 4-Panel Bento Grid (Exact structure and aesthetic matching the reference image) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          
          {/* ========================================================= */}
          {/* PANEL 1 (Top Left): Weather Intelligence / Brand CTA      */}
          {/* (Matches the blue "MOFIN / Get the app" card in reference) */}
          {/* ========================================================= */}
          <div className="bg-[#dce8f5] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-sky-200/60 shadow-xs min-h-[380px] sm:min-h-[420px]">
            {/* Big Watermark Typography matching "MOFIN" */}
            <div className="absolute top-4 left-6 sm:left-8 text-6xl sm:text-8xl md:text-9xl font-sans font-black text-sky-900/[0.07] tracking-tight select-none pointer-events-none">
              AURORA
            </div>

            {/* Top content */}
            <div className="relative z-10">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-sky-800 uppercase mb-2">
                <CloudSnow className="w-4 h-4 text-sky-700" />
                <span>Weather Intelligence</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                Detect changing environmental conditions. Real-time telemetry tracks sudden barometric drops, Roaring Forties swells, and coastal pack ice drift.
              </p>
            </div>

            {/* Bottom Content & CTA Button */}
            <div className="relative z-10 pt-8">
              <h3 className="font-sans font-bold text-slate-900 text-2xl sm:text-3xl leading-snug mb-4">
                Polar Command<br />Decision Support
              </h3>
              
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold font-sans transition-all shadow-sm hover:shadow"
              >
                <span>Explore Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-300" />
              </Link>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PANEL 2 (Top Right): Route Intelligence / 3D Mobile View  */}
          {/* (Matches "Automated Savings / Phone Mockup" card in ref)   */}
          {/* ========================================================= */}
          <div className="bg-[#f3f6fa] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-slate-200/70 shadow-xs min-h-[380px] sm:min-h-[420px]">
            {/* Header text */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-sky-800 uppercase">
                  <Navigation2 className="w-4 h-4 text-sky-600" />
                  <span>Route Intelligence</span>
                </div>
                <span className="text-[10px] font-mono bg-white text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-200/70 font-semibold shadow-2xs">
                  SHIP PASSAGE
                </span>
              </div>

              <h3 className="font-sans font-bold text-slate-900 text-xl sm:text-2xl leading-snug">
                Identify safer and more practical routes.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-md mt-1">
                Dynamically navigates 4,200 NM Southern Ocean shipping corridors, tracking ice concentration radar to optimize icebreaker transit.
              </p>
            </div>

            {/* Visual: Clean 3D Mobile Phone (Enlarged, No Floating Overlay Box) */}
            <div className="relative w-full flex items-center justify-center pt-2 sm:pt-4">
              <img
                src="/ship_route_transparent.png"
                alt="Aurora Route Intelligence 3D Mobile View"
                className="w-full max-w-[310px] sm:max-w-[350px] md:max-w-[380px] h-auto object-contain drop-shadow-[0_20px_36px_rgba(15,23,42,0.14)] transition-transform duration-300 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* PANEL 3 (Bottom Left): Passage Navigation Table Card      */}
          {/* (Matches "Smart Expense Tracking / Floating card" in ref)  */}
          {/* ========================================================= */}
          <div className="bg-[#edf2f7] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-slate-200/70 shadow-xs min-h-[380px] sm:min-h-[420px]">
            {/* Header text */}
            <div className="mb-4">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                <span>Passage Navigation Table</span>
              </div>
              <h3 className="font-sans font-bold text-slate-900 text-xl sm:text-2xl leading-snug">
                Southern Ocean Waypoint Corridor
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-md mt-1">
                Real-time waypoint coordinates, sea ice concentration levels, and bridge navigation ETA calculations.
              </p>
            </div>

            {/* Floating White Table Card (matching the floating card in the reference image) */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-sky-100 shadow-md shadow-slate-900/5">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-[10px] font-mono">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 font-sans block leading-none">
                      Active Maritime Transit
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Cape Town &rarr; India Bay Ice Shelf
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60">
                  4,200 NM
                </span>
              </div>

              {/* Minimal Tactical Polar Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="pb-1.5 font-bold">Waypoint</th>
                      <th className="pb-1.5 font-bold hidden sm:table-cell">Coordinates</th>
                      <th className="pb-1.5 font-bold">Ice Level</th>
                      <th className="pb-1.5 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[10.5px]">
                    {waypoints.map((wp) => (
                      <tr key={wp.code} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-1.5 font-bold text-slate-900 font-sans">
                          <span className="text-[9.5px] font-mono text-slate-400 mr-1">{wp.code}</span>
                          {wp.name}
                        </td>
                        <td className="py-1.5 text-slate-500 hidden sm:table-cell">{wp.coord}</td>
                        <td className="py-1.5 text-slate-700">{wp.ice}</td>
                        <td className="py-1.5 text-right">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] border ${wp.statusColor}`}>
                            {wp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Bottom Indicator */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>CLEARANCE: 94.2%</span>
                <span className="text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>ROUTE CONVERGED</span>
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PANEL 4 (Bottom Right): Emergency & Resource Response     */}
          {/* (Matches "Customizable Budgets / Black Card with Nodes")   */}
          {/* ========================================================= */}
          <div className="bg-[#e4f1ea] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border border-emerald-200/60 shadow-xs min-h-[380px] sm:min-h-[420px]">
            {/* Header text */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-800 uppercase">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  <span>Emergency & Resource Response</span>
                </div>
                
                {/* View Switcher: Diagram vs Mobile */}
                <div className="flex items-center bg-white/80 p-0.5 rounded-lg border border-emerald-200/70 text-[10px] font-mono font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveBottomRightView('diagram')}
                    className={`px-2 py-0.5 rounded transition-all ${
                      activeBottomRightView === 'diagram'
                        ? 'bg-slate-900 text-white font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Network
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveBottomRightView('mobile')}
                    className={`px-2 py-0.5 rounded transition-all ${
                      activeBottomRightView === 'mobile'
                        ? 'bg-slate-900 text-white font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <h3 className="font-sans font-bold text-slate-900 text-xl sm:text-2xl leading-snug">
                Support rapid response during critical events.
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-md mt-1">
                Coordinates emergency ship operations when field stations trigger an SOS. Reroutes R/V Polaris through sea ice leads with 96% engine readiness.
              </p>
            </div>

            {/* Central Graphic: Choice between Black Nodal Card (exact screenshot match) OR 2nd Mobile View */}
            <div className="relative w-full flex items-center justify-center py-4">
              
              {activeBottomRightView === 'diagram' ? (
                /* EXACT MATCH TO REFERENCE: Sleek Dark Card with Radial Connected Nodes */
                <div className="relative w-full max-w-[340px] sm:max-w-[380px] flex items-center justify-center py-4">
                  {/* Connecting Curved SVG Lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 380 200">
                    {/* Line to Top-Left Node */}
                    <path d="M 190 100 Q 110 50 60 40" fill="none" stroke="#a7d7bc" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Line to Top Node */}
                    <path d="M 190 90 L 190 25" fill="none" stroke="#a7d7bc" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Line to Top-Right Node */}
                    <path d="M 190 100 Q 270 50 320 40" fill="none" stroke="#a7d7bc" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Line to Bottom-Left Node */}
                    <path d="M 190 110 Q 110 150 60 160" fill="none" stroke="#a7d7bc" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Line to Bottom Node */}
                    <path d="M 190 120 L 190 175" fill="none" stroke="#a7d7bc" strokeWidth="1.5" strokeDasharray="3 3" />
                    {/* Line to Bottom-Right Node */}
                    <path d="M 190 110 Q 270 150 320 160" fill="none" stroke="#a7d7bc" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>

                  {/* Radial Node 1: Top-Left (Satellite Mesh) */}
                  <div className="absolute top-1 left-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-emerald-100 flex items-center justify-center text-slate-700" title="Satellite Link">
                    <Radio className="w-3.5 h-3.5 text-sky-600" />
                  </div>

                  {/* Radial Node 2: Top Center (SOS Beacon) */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-rose-200 flex items-center justify-center text-rose-600 animate-pulse" title="Active SOS Alert">
                    <Radio className="w-3.5 h-3.5 text-rose-600" />
                  </div>

                  {/* Radial Node 3: Top-Right (Bunker Fuel) */}
                  <div className="absolute top-1 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-emerald-100 flex items-center justify-center text-slate-700" title="Fuel Burn">
                    <Fuel className="w-3.5 h-3.5 text-emerald-600" />
                  </div>

                  {/* Radial Node 4: Bottom-Left (Sea Ice Radar) */}
                  <div className="absolute bottom-1 left-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-emerald-100 flex items-center justify-center text-slate-700" title="Sea Ice Leads">
                    <Waves className="w-3.5 h-3.5 text-teal-600" />
                  </div>

                  {/* Radial Node 5: Bottom Center (Engine Readiness) */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-emerald-100 flex items-center justify-center text-slate-700" title="Engine 96%">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>

                  {/* Radial Node 6: Bottom-Right (SAR Dispatch) */}
                  <div className="absolute bottom-1 right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-emerald-100 flex items-center justify-center text-slate-700" title="SAR Vessel">
                    <Ship className="w-3.5 h-3.5 text-sky-600" />
                  </div>

                  {/* Center Dark Polar Command Vessel Card (exact visual equivalent to Black Visa Card) */}
                  <div className="relative z-10 w-[210px] sm:w-[230px] rounded-2xl bg-slate-950 text-white p-4 shadow-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-slate-400">
                      <span>POLAR COMMAND</span>
                      <Ship className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xs font-bold font-sans text-slate-100 tracking-wide mb-1">
                      R/V POLARIS
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                      ICEBREAKER CLASS 3
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-emerald-400">
                      <span>ENGINE: 96%</span>
                      <span>ETA: 7h 42m</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Second 3D Mobile View (Seamlessly Blended without inner box) */
                <div className="relative w-full flex items-center justify-center pt-2">
                  <img
                    src="/ship_emergency_transparent.png"
                    alt="Aurora Emergency Intelligence 3D Mobile View"
                    className="w-full max-w-[300px] sm:max-w-[340px] md:max-w-[360px] h-auto object-contain drop-shadow-[0_20px_36px_rgba(15,23,42,0.14)] transition-transform duration-300 hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-4 bg-white/90 backdrop-blur-sm border border-rose-200/80 rounded-md px-2 py-1 text-[10px] font-mono text-rose-700 shadow-sm flex items-center space-x-1.5">
                    <Radio className="w-3 h-3 text-rose-600" />
                    <span>ETA to Station: 7h 42m</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
