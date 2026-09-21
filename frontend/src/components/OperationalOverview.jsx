import React from 'react';
import { Shield, Clock, AlertTriangle, Package, MapPin } from 'lucide-react';

export default function OperationalOverview({ missions, cargoList, onSelectDisruption }) {
  const delayedCargoCount = cargoList.filter((c) => c.delay_hours > 0 || c.status === 'DELAYED').length;
  const criticalMissionsCount = missions.filter((m) => m.priority === 1).length;

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Active Missions</span>
            <Shield className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-2">{missions.length}</div>
          <div className="text-xs text-slate-500 mt-1">{criticalMissionsCount} Priority 1 (Critical)</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Cargo Inventory</span>
            <Package className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-2">{cargoList.length}</div>
          <div className="text-xs text-slate-500 mt-1">Items tracked across outposts</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Delayed Cargo</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className={`text-2xl font-bold font-mono mt-2 ${delayedCargoCount > 0 ? 'text-amber-400' : 'text-slate-100'}`}>
            {delayedCargoCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Disruptions requiring impact check</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Base Outposts</span>
            <MapPin className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-2">3</div>
          <div className="text-xs text-slate-500 mt-1">Outpost Alpha, Beta, Depot Gamma</div>
        </div>
      </div>

      {/* Active Missions Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur">
        <h3 className="text-base font-semibold text-slate-200 mb-4 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-cyan-400" />
          <span>Scheduled Polar Missions</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Planned Start</th>
                <th className="py-3 px-4">Planned End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {missions.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-medium text-slate-200">{m.title}</td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className={`px-2 py-0.5 rounded ${m.priority === 1 ? 'bg-rose-950/80 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-300'}`}>
                      P{m.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                    {new Date(m.planned_start_time).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                    {new Date(m.planned_end_time).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
