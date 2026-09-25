import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Package,
  Ship,
  Waves,
  Activity,
  Anchor,
  ArrowDown,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function OperationLayer() {
  const [activeStep, setActiveStep] = useState(null);

  // The 6 exact operational dimensions requested for Operation 047: Southern Ocean & Ice-Shelf Resupply
  const steps = [
    {
      num: "01",
      tag: "01 — ROUTE",
      title: "ROUTE",
      hook: "Plan the Mission",
      feature: "Route Planning & Optimization",
      desc: "Define departure points, destinations, waypoints, and operational corridors while accounting for ice conditions, weather, sea state, and restricted zones.",
      keyData: ["Route", "Distance", "Waypoints", "Risk Zones", "ETA"],
      hudShort: "01 ROUTE: PLAN MISSION",
      icon: MapPin,
      badgeColor: "text-sky-700 bg-sky-50 border-sky-200/80"
    },
    {
      num: "02",
      tag: "02 — PERSONNEL",
      title: "PERSONNEL",
      hook: "Know Who Is Going",
      feature: "Personnel & Team Management",
      desc: "Maintain a live view of expedition members, roles, certifications, assignments, health/readiness status, and movement.",
      keyData: ["Crew", "Roles", "Certifications", "Assignments", "Readiness"],
      hudShort: "02 PERSONNEL: TEAM & READINESS",
      icon: Users,
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200/80"
    },
    {
      num: "03",
      tag: "03 — CARGO",
      title: "CARGO",
      hook: "Move What the Mission Needs",
      feature: "Cargo & Inventory Management",
      desc: "Track fuel, equipment, scientific supplies, provisions, medical resources, and mission-critical cargo from loading to deployment.",
      keyData: ["Cargo", "Quantity", "Priority", "Location", "Delivery Status"],
      hudShort: "03 CARGO: 1,200T MANIFEST",
      icon: Package,
      badgeColor: "text-amber-800 bg-amber-50 border-amber-200/80"
    },
    {
      num: "04",
      tag: "04 — ASSETS",
      title: "ASSETS",
      hook: "Track Every Mission Asset",
      feature: "Vessel & Equipment Tracking",
      desc: "Monitor vessels, vehicles, field equipment, research systems, and other operational assets throughout the expedition.",
      keyData: ["Vessels", "Equipment", "Position", "Condition", "Utilization"],
      hudShort: "04 ASSETS: 2 VESSELS & RIGS",
      icon: Ship,
      badgeColor: "text-cyan-800 bg-cyan-50 border-cyan-200/80"
    },
    {
      num: "05",
      tag: "05 — ENVIRONMENT",
      title: "ENVIRONMENT",
      hook: "Understand the Conditions",
      feature: "Environmental Intelligence",
      desc: "Continuously monitor weather, ocean conditions, sea ice, visibility, temperature, wind, and other environmental factors that can affect operations.",
      keyData: ["Temperature", "Wind", "Sea State", "Ice", "Weather Alerts"],
      hudShort: "05 ENV: −18°C & SEA STATE 6",
      icon: Waves,
      badgeColor: "text-teal-800 bg-teal-50 border-teal-200/80"
    },
    {
      num: "06",
      tag: "06 — STATUS",
      title: "STATUS",
      hook: "See the Mission as It Happens",
      feature: "Real-Time Mission Status",
      desc: "Bring operational data together into a single mission view, showing progress, active risks, alerts, resource status, and changes that require attention.",
      keyData: ["Mission Status", "Alerts", "Progress", "Risks", "Last Update"],
      hudShort: "06 STATUS: ACTIVE MISSION",
      icon: Activity,
      badgeColor: "text-emerald-800 bg-emerald-50 border-emerald-200/80"
    }
  ];

  return (
    <section className="relative w-full py-20 sm:py-28 bg-transparent select-none overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Operation 047 Header Block */}
        <div className="text-left mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
            <div>

              <h2 className="font-serif font-medium text-slate-900 text-3xl sm:text-4xl lg:text-5xl mt-1 tracking-tight">
                How ARORA Powers a Polar Mission
              </h2>
            </div>


          </div>

          {/* Clean Polar Divider */}

          {/* Quick Flow Breadcrumb Pipeline */}

        </div>

        {/* 6 Minimal Operational Dimension Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-8 sm:mb-10 text-left">
          {steps.map((step, index) => {
            const isHovered = activeStep === index;
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
                className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-xl transition-all duration-150 cursor-pointer border ${isHovered
                  ? 'bg-white/90 border-sky-300 shadow-sm'
                  : 'bg-white/45 border-slate-200/70 hover:border-slate-300 hover:bg-white/70'
                  }`}
              >
                <div>
                  {/* Top line: 01 — ROUTE & tiny icon */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-400 text-[11px] tracking-wider uppercase">
                      {step.tag}
                    </span>
                    <Icon className={`w-3.5 h-3.5 transition-colors ${isHovered ? 'text-sky-600' : 'text-slate-400'}`} />
                  </div>

                  {/* Subtitle / Action hook: "Plan the Mission" */}
                  <h3 className="font-sans font-semibold text-slate-900 text-sm sm:text-[15px] leading-snug">
                    {step.hook}
                  </h3>

                  {/* Feature tag: "Route Planning & Optimization" */}
                  <div className="text-[11px] font-mono text-sky-800 font-medium mb-1.5 mt-0.5">
                    {step.feature}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-sans mb-3">
                    {step.desc}
                  </p>
                </div>

                {/* Minimal Key Data Row */}
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-sans flex items-baseline">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 mr-1.5 shrink-0">
                    Key data:
                  </span>
                  <span className="text-slate-700 font-medium truncate">
                    {step.keyData.join(' • ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Central 3D Isometric Shipping Process Workflow - Blended into Page Background */}
        <div className="relative w-full bg-transparent my-4">
          {/* Soft ambient ground depth matching the page's polar blue tones */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-100/40 to-transparent rounded-3xl blur-2xl pointer-events-none -z-10" />

          {/* Seamless 3D image with removed background mixing directly into the page */}
          <img
            src="/maritime_workflow.png"
            alt="Southern Ocean & Ice-Shelf Resupply 3D Process Workflow"
            className="w-full h-auto object-contain block mx-auto relative z-0 drop-shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
            loading="eager"
          />

          {/* 3D HUD Markers & Pinpoints tied to the 6 Maritime Operation dimensions */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 01: Port Laptop Dispatch (Lower Left) */}
            <div
              className="absolute top-[62%] left-[16%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onMouseEnter={() => setActiveStep(0)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-md transition-all flex items-center space-x-1.5 ${activeStep === 0 ? 'bg-slate-900 text-white scale-110 ring-2 ring-sky-400' : 'bg-white/95 text-slate-800 border border-slate-200 hover:border-slate-400'
                }`}>
                <MapPin className="w-3 h-3 text-sky-600" />
                <span>01 ROUTE: PLAN MISSION</span>
              </div>
            </div>

            {/* 02: Unloading Barge & Pallets / Personnel (Lower Center-Right) */}
            <div
              className="absolute top-[72%] left-[62%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onMouseEnter={() => setActiveStep(1)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-md transition-all flex items-center space-x-1.5 ${activeStep === 1 ? 'bg-slate-900 text-white scale-110 ring-2 ring-sky-400' : 'bg-white/95 text-slate-800 border border-slate-200 hover:border-slate-400'
                }`}>
                <Users className="w-3 h-3 text-blue-600" />
                <span>02 PERSONNEL: WHO IS GOING</span>
              </div>
            </div>

            {/* 03: Seaport Container Cranes / Cargo (Upper Left) */}
            <div
              className="absolute top-[22%] left-[26%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onMouseEnter={() => setActiveStep(2)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-md transition-all flex items-center space-x-1.5 ${activeStep === 2 ? 'bg-slate-900 text-white scale-110 ring-2 ring-sky-400' : 'bg-white/95 text-slate-800 border border-slate-200 hover:border-slate-400'
                }`}>
                <Package className="w-3 h-3 text-amber-600" />
                <span>03 CARGO: MOVE MISSION NEEDS</span>
              </div>
            </div>

            {/* 04: Icebreaker & Cargo Ship in Channel / Assets (Upper Right) */}
            <div
              className="absolute top-[25%] left-[64%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onMouseEnter={() => setActiveStep(3)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-md transition-all flex items-center space-x-1.5 ${activeStep === 3 ? 'bg-slate-900 text-white scale-110 ring-2 ring-sky-400' : 'bg-white/95 text-slate-800 border border-slate-200 hover:border-slate-400'
                }`}>
                <Ship className="w-3 h-3 text-cyan-600" />
                <span>04 ASSETS: TRACK EVERY ASSET</span>
              </div>
            </div>

            {/* 05: Offshore Oceanographic Telemetry Buoy / Environment (Center) */}
            <div
              className="absolute top-[44%] left-[49%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onMouseEnter={() => setActiveStep(4)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-md transition-all flex items-center space-x-1.5 ${activeStep === 4 ? 'bg-slate-900 text-white scale-110 ring-2 ring-sky-400' : 'bg-white/95 text-slate-800 border border-slate-200 hover:border-slate-400'
                }`}>
                <Waves className="w-3 h-3 text-teal-600" />
                <span>05 ENVIRONMENT: CONDITIONS</span>
              </div>
            </div>

            {/* 06: Coastal Harbor Station with Location Pin / Status (Far Right) */}
            <div
              className="absolute top-[60%] left-[84%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
              onMouseEnter={() => setActiveStep(5)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-md transition-all flex items-center space-x-1.5 ${activeStep === 5 ? 'bg-slate-900 text-white scale-110 ring-2 ring-sky-400' : 'bg-white/95 text-slate-800 border border-slate-200 hover:border-slate-400'
                }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>06 STATUS: REAL-TIME MISSION</span>
              </div>
            </div>
          </div>
        </div>



      </div>
    </section>
  );
}
