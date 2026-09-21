import React from 'react';
import { ShieldAlert, GitCommit, CornerDownRight } from 'lucide-react';

export default function ImpactDisplay({ impactSet }) {
  if (!impactSet) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="h-6 w-6 text-rose-400" />
          <div>
            <h3 className="text-lg font-semibold text-slate-100">
              Deterministic Impact Analysis Result
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Target Entity: <span className="text-cyan-300">{impactSet.target_entity_name}</span> ({impactSet.target_entity_id})
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold uppercase border ${
          impactSet.severity === 'CRITICAL'
            ? 'bg-rose-950/80 text-rose-400 border-rose-800'
            : 'bg-amber-950/80 text-amber-400 border-amber-800'
        }`}>
          {impactSet.severity} SEVERITY
        </span>
      </div>

      <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
        <span className="text-slate-500 uppercase tracking-wider block mb-1">Engine Summary:</span>
        {impactSet.summary_reason}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-amber-400 font-semibold border-b border-slate-800/60 pb-2">
            <GitCommit className="h-4 w-4" />
            <span>Direct Downstream Impacts ({impactSet.directly_affected.length})</span>
          </div>

          {impactSet.directly_affected.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono italic">No direct downstream impacts.</p>
          ) : (
            <div className="space-y-2">
              {impactSet.directly_affected.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="font-semibold text-slate-200">{item.entity_name}</div>
                  <div className="text-slate-400 text-[11px]">{item.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-rose-400 font-semibold border-b border-slate-800/60 pb-2">
            <CornerDownRight className="h-4 w-4" />
            <span>Transitive Cascading Impacts ({impactSet.transitively_affected.length})</span>
          </div>

          {impactSet.transitively_affected.length === 0 ? (
            <p className="text-xs text-slate-500 font-mono italic">No transitive impacts detected.</p>
          ) : (
            <div className="space-y-2">
              {impactSet.transitively_affected.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                  <div className="font-semibold text-slate-200">{item.entity_name}</div>
                  <div className="text-slate-400 text-[11px]">{item.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
