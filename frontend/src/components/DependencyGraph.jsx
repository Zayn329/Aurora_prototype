import React from 'react';
import { GitBranch, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DependencyGraph({ impactSet }) {
  const isImpacted = Boolean(impactSet);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
        <GitBranch className="h-6 w-6 text-cyan-400" />
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Operational Dependency Graph (DAG)</h3>
          <p className="text-xs text-slate-400">
            Interactive visualization of mission, cargo, and resource dependency chains.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto">
        <div
          className={`p-4 rounded-xl border flex-1 min-w-[200px] transition ${
            isImpacted
              ? 'bg-rose-950/40 border-rose-800 shadow-lg shadow-rose-950/30'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-slate-500">Source Entity (Cargo)</div>
          <div className="font-semibold font-mono text-sm text-slate-200 mt-1">Cargo-Fuel-01</div>
          <div className="text-xs font-mono text-slate-400 mt-2">Polar Diesel Grade A</div>
          {isImpacted && (
            <div className="mt-3 px-2 py-1 rounded bg-rose-900/60 text-rose-300 text-[11px] font-mono flex items-center space-x-1 border border-rose-800">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>DELAYED (+24h)</span>
            </div>
          )}
        </div>

        <ArrowRight className={`h-6 w-6 shrink-0 ${isImpacted ? 'text-rose-400 animate-pulse' : 'text-slate-600'}`} />

        <div
          className={`p-4 rounded-xl border flex-1 min-w-[200px] transition ${
            isImpacted
              ? 'bg-amber-950/40 border-amber-800 shadow-lg shadow-amber-950/30'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-slate-500">Direct Dependent (Mission)</div>
          <div className="font-semibold font-mono text-sm text-slate-200 mt-1">Operation Deep Freeze</div>
          <div className="text-xs font-mono text-slate-400 mt-2">Outpost Alpha Resupply</div>
          {isImpacted ? (
            <div className="mt-3 px-2 py-1 rounded bg-amber-900/60 text-amber-300 text-[11px] font-mono flex items-center space-x-1 border border-amber-800">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>DIRECT IMPACT</span>
            </div>
          ) : (
            <div className="mt-3 px-2 py-1 rounded bg-slate-800 text-emerald-400 text-[11px] font-mono flex items-center space-x-1 border border-slate-700">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>VALID SCHEDULE</span>
            </div>
          )}
        </div>

        <ArrowRight className={`h-6 w-6 shrink-0 ${isImpacted ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />

        <div
          className={`p-4 rounded-xl border flex-1 min-w-[200px] transition ${
            isImpacted
              ? 'bg-rose-950/30 border-rose-900/80 shadow-lg'
              : 'bg-slate-900 border-slate-800'
          }`}
        >
          <div className="text-[10px] font-mono uppercase text-slate-500">Transitive Dependent (Mission)</div>
          <div className="font-semibold font-mono text-sm text-slate-200 mt-1">Glacial Survey Beta</div>
          <div className="text-xs font-mono text-slate-400 mt-2">Dome C Ice Sampling</div>
          {isImpacted ? (
            <div className="mt-3 px-2 py-1 rounded bg-rose-900/40 text-rose-300 text-[11px] font-mono flex items-center space-x-1 border border-rose-800">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span>TRANSITIVE IMPACT</span>
            </div>
          ) : (
            <div className="mt-3 px-2 py-1 rounded bg-slate-800 text-emerald-400 text-[11px] font-mono flex items-center space-x-1 border border-slate-700">
              <CheckCircle2 className="h-3 w-3 shrink-0" />
              <span>VALID SCHEDULE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
