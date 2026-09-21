import React from 'react';
import { AlertCircle, ArrowRight, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import { useOperationalState } from '../context/OperationalStateContext';

export default function ImpactDisplay({ impactSet }) {
  const { missions } = useOperationalState();

  if (!impactSet) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
        No active incident impact calculated.
      </div>
    );
  }

  const directIds = impactSet.directly_impacted_mission_ids || [];
  const transitiveIds = impactSet.transitively_impacted_mission_ids || [];

  const directMissions = missions.filter((m) => directIds.includes(m.id));
  const transitiveMissions = missions.filter((m) => transitiveIds.includes(m.id));

  return (
    <div className="space-y-4">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-rose-800">Directly Disrupted Missions</div>
            <div className="text-2xl font-bold text-rose-950 mt-1">{directIds.length}</div>
          </div>
          <AlertCircle className="h-6 w-6 text-rose-600" />
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-800">Cascade Affected Missions</div>
            <div className="text-2xl font-bold text-amber-950 mt-1">{transitiveIds.length}</div>
          </div>
          <Activity className="h-6 w-6 text-amber-600" />
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-700">Total Operational Risk</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{directIds.length + transitiveIds.length}</div>
          </div>
          <ShieldAlert className="h-6 w-6 text-slate-500" />
        </div>
      </div>

      {/* Disrupted Missions Timeline Impact Breakdown */}
      {directMissions.length > 0 && (
        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Directly Affected Mission Timeline Shifts
          </div>
          <div className="space-y-2">
            {directMissions.map((m) => (
              <div key={m.id} className="p-3 bg-rose-50/60 border border-rose-200 rounded-md text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-950">{m.name}</div>
                  <div className="text-rose-800 text-[11px]">{m.objective}</div>
                </div>
                <div className="flex items-center space-x-2 font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-rose-200 text-rose-900">
                  <span>Planned: Day {m.start_day}</span>
                  <ArrowRight className="h-3 w-3 text-rose-500" />
                  <span className="font-bold text-rose-700">Delayed: Day {m.start_day + 3}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
