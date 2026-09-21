import React from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import { Compass, Package, AlertTriangle, Activity, ArrowRight } from 'lucide-react';
import OperationalMap from '../components/OperationalMap';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { missions, cargoList, impactSet, loading } = useOperationalState();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 text-sm space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-sky-600 border-t-transparent rounded-full"></div>
        <span>Loading operational overview...</span>
      </div>
    );
  }

  const activeMissions = missions.filter((m) => m.status === 'IN_PROGRESS' || m.status === 'PLANNED');
  const delayedCargo = cargoList.filter((c) => c.status === 'DELAYED' || c.status === 'DAMAGED');
  const totalImpactedMissions =
    (impactSet?.directly_impacted_mission_ids?.length || 0) +
    (impactSet?.transitively_impacted_mission_ids?.length || 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Current Situation</h2>
        <p className="text-xs text-slate-500">Antarctic operational status overview and critical metrics.</p>
      </div>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Missions</span>
            <Compass className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{activeMissions.length}</span>
            <span className="text-xs text-slate-500">of {missions.length} total</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Logistics Inventory</span>
            <Package className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{cargoList.length}</span>
            <span className="text-xs text-slate-500">cargo items</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Logistics Delays</span>
            <AlertTriangle className={`h-4 w-4 ${delayedCargo.length > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${delayedCargo.length > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
              {delayedCargo.length}
            </span>
            <span className="text-xs text-slate-500">delayed items</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Impacted Missions</span>
            <Activity className={`h-4 w-4 ${totalImpactedMissions > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className={`text-2xl font-bold ${totalImpactedMissions > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
              {totalImpactedMissions}
            </span>
            <span className="text-xs text-slate-500">active disruptions</span>
          </div>
        </div>
      </div>

      {/* Geo-Spatial Map Section */}
      <OperationalMap />

      {/* Active Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mission Summary */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-800">Field Missions</h3>
            <Link to="/missions" className="text-xs text-sky-700 hover:text-sky-800 font-medium flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {missions.slice(0, 4).map((m) => (
              <div key={m.id} className="p-3 border border-slate-100 bg-slate-50/50 rounded-md flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800">{m.name}</div>
                  <div className="text-slate-500 text-[11px]">{m.objective}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium text-[10px]">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Incidents / Disruptions Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-800">Operational Incidents</h3>
            <Link to="/incidents" className="text-xs text-sky-700 hover:text-sky-800 font-medium flex items-center space-x-1">
              <span>Report Incident</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {delayedCargo.length > 0 ? (
            <div className="space-y-2">
              {delayedCargo.map((c) => (
                <div key={c.id} className="p-3 border border-amber-200 bg-amber-50/40 rounded-md flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-amber-900">{c.name} Delayed</div>
                    <div className="text-amber-700 text-[11px]">{c.notes || 'Cargo delivery disrupted'}</div>
                  </div>
                  <Link
                    to="/incidents"
                    className="px-2.5 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded font-medium text-[11px]"
                  >
                    Assess Impact
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-md border border-dashed border-slate-200">
              No active operational incidents reported. All logistics on schedule.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
