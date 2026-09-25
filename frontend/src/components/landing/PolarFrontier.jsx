import React from 'react';
import { Truck, Microscope, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PolarFrontier() {
  const useCases = [
    {
      category: "TRANSPORTATION",
      title: "Overland Traverse & Heavy Freight",
      description: "Move people, heavy scientific drilling equipment, and bulk fuel across uncharted glaciers and treacherous ice shelves.",
      icon: Truck,
      features: [
        "Tracked convoy route & fuel burn modeling",
        "Crevasse zone detection & dynamic waypoints",
        "Vehicle payload & towing safety constraints"
      ],
      link: "/logistics"
    },
    {
      category: "RESEARCH",
      title: "Scientific Field Deployments",
      description: "Coordinate deep-ice coring, seismic sensing arrays, and atmospheric monitoring pods across unmanned polar sectors.",
      icon: Microscope,
      features: [
        "Cold-chain ice core specimen logging",
        "Automated lab sensor synchronization",
        "Expedition equipment lifecycle tracking"
      ],
      link: "/missions"
    },
    {
      category: "EXPEDITIONS",
      title: "Isolated Teams & Remote Outposts",
      description: "Keep field specialists, base camp habitats, and autonomous survival depots securely synchronized without internet access.",
      icon: Compass,
      features: [
        "Offline peer-to-peer data replication",
        "Blizzard emergency contingency solver",
        "Polar SOP compliance & AI decision support"
      ],
      link: "/decisions"
    }
  ];

  return (
    <section id="about" className="relative w-full py-20 sm:py-28 bg-transparent select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/70 border border-sky-200/80 text-sky-800 text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
            <span>06 — BUILT FOR THE POLAR FRONTIER</span>
          </div>

          <h2 className="font-serif font-normal sm:font-medium tracking-normal text-slate-900 text-3xl sm:text-4xl lg:text-[46px] leading-[1.18]">
            Engineered for extreme operational resilience.
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            From multi-vehicle glacial convoys to isolated deep-ice scientific camps, Aurora unifies polar operations under one common operating picture.
          </p>
        </div>

        {/* 3 Large Use Case Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.category}
                className="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-sky-200/80 p-8 sm:p-9 shadow-sm hover:shadow-2xl hover:shadow-sky-950/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-sky-700 tracking-widest uppercase px-3 py-1 rounded-full bg-sky-50 border border-sky-200">
                      {uc.category}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-sky-600 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif font-medium text-slate-900 text-xl sm:text-2xl mb-3 leading-snug">
                    {uc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans mb-6">
                    {uc.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="space-y-3 pt-4 border-t border-sky-100">
                    {uc.features.map((feat) => (
                      <div key={feat} className="flex items-start space-x-2.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Link */}
                <div className="mt-8 pt-4">
                  <Link
                    to={uc.link}
                    className="inline-flex items-center space-x-2 text-xs font-bold text-sky-700 hover:text-sky-900 group-hover:translate-x-1 transition-all"
                  >
                    <span>Inspect operational workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
