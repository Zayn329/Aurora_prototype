import React from 'react';
import { CloudSnow, AlertOctagon, CheckSquare, ArrowRight, ShieldCheck, ThermometerSnowflake } from 'lucide-react';

export default function IntelligenceSection() {
  return (
    <section className="relative w-full py-20 sm:py-28 bg-transparent select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/70 border border-sky-200/80 text-sky-800 text-[11px] font-mono font-bold tracking-wider uppercase mb-4">
            <span>05 — INTELLIGENCE</span>
          </div>

          <h2 className="font-serif font-normal sm:font-medium tracking-normal text-slate-900 text-3xl sm:text-4xl lg:text-[46px] leading-[1.18]">
            Turn changing conditions into operational awareness.
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            From sudden katabatic storms to fuel anomalies, Aurora continuously transforms raw field telemetry into grounded risk calculations and commander-approved actions.
          </p>
        </div>

        {/* 3-Step Flow: Weather → Risk → Recommendation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Step 1: Weather & Field Telemetry */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-sky-200/80 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-sky-950/5 transition-all text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-sky-700 uppercase">
                  STEP 01 // TELEMETRY
                </span>
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </div>

              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mb-5">
                <CloudSnow className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 font-sans">
                Field Conditions Shift
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Meteorological stations detect sudden barometric drop, wind speeds escalating to 62 km/h, and high crevasse drift risks.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-sky-100 font-mono text-[11px] text-slate-600 bg-sky-50/50 p-3 rounded-lg">
              <div className="text-sky-800 font-semibold">&bull; Wind: 62 km/h (Katabatic)</div>
              <div className="text-slate-500">&bull; Visibility: Sub-800m</div>
            </div>
          </div>

          {/* Step 2: Deterministic Impact Calculation */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-amber-200/80 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-amber-950/5 transition-all text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">
                  STEP 02 // IMPACT SOLVER
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>

              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-5">
                <AlertOctagon className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 font-sans">
                Deterministic Risk Matrix
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The offline state graph traces all downstream dependencies: vehicle fuel consumption surges by 24%, endangering the scheduled Arrival at Field Camp 07.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-100 font-mono text-[11px] text-slate-600 bg-amber-50/50 p-3 rounded-lg">
              <div className="text-amber-800 font-semibold">&bull; Fuel Impact: -120L safe margin</div>
              <div className="text-slate-500">&bull; Delay: +3.2 hrs at current speed</div>
            </div>
          </div>

          {/* Step 3: Grounded Recommendation & Human Approval */}
          <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-emerald-200/80 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 transition-all text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase">
                  STEP 03 // COMMAND ACTION
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-5">
                <CheckSquare className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2 font-sans">
                Grounded Decision Support
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                RAG and SOP policies generate an optimal detour along Saddle Track B, preserving 100% life-support fuel. Awaiting human commander sign-off.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-100 font-mono text-[11px] text-slate-600 bg-emerald-50/50 p-3 rounded-lg">
              <div className="text-emerald-800 font-semibold">&bull; Divert to Saddle Ridge Track B</div>
              <div className="text-slate-500">&bull; Commander Approval Required</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
