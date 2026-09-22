import React, { useState } from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import { Compass, Clock, MapPin, AlertCircle, ChevronRight, CheckCircle2, ShieldAlert, CheckSquare } from 'lucide-react';

export default function MissionsPage() {
  const { missions, cargoList, impactSet, loading } = useOperationalState();
  const [selectedMission, setSelectedMission] = useState(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 text-sm space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-sky-600 border-t-transparent rounded-full"></div>
        <span>Loading missions...</span>
      </div>
    );
  }

  const directlyImpactedIds = impactSet?.directly_impacted_mission_ids || [];
  const transitivelyImpactedIds = impactSet?.transitively_impacted_mission_ids || [];

  const currentMission = selectedMission || missions[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Expedition Missions</h2>
        <p className="text-xs text-slate-500">
          Field operational missions, execution timelines, and resource dependencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mission List Side Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3 lg:col-span-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
            Active & Planned Missions ({missions.length})
          </div>
          <div className="space-y-2">
            {missions.map((m) => {
              const isDirect = directlyImpactedIds.includes(m.id);
              const isTransitive = transitivelyImpactedIds.includes(m.id);
              const isSelected = currentMission?.id === m.id;

              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMission(m)}
                  className={`w-full text-left p-3 rounded-md border text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'border-sky-300 bg-sky-50/70 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                      <span>{m.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>Day {m.start_day} - {m.end_day}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDirect ? (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-medium text-[10px] border border-rose-200">
                        Direct Impact
                      </span>
                    ) : isTransitive ? (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium text-[10px] border border-amber-200">
                        Affected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {m.status}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mission Detail View */}
        {missions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm text-center text-xs text-slate-500 lg:col-span-2 flex flex-col items-center justify-center space-y-2">
            <Compass className="h-8 w-8 text-slate-400" />
            <div className="font-semibold text-slate-700">No Missions Loaded in Local State</div>
            <p className="text-slate-500 max-w-sm">
              Connect to the base station backend or reset state in the System menu to populate synthetic expedition missions.
            </p>
          </div>
        ) : currentMission ? (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6 lg:col-span-2">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-slate-900">{currentMission.name}</h3>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                    Priority {currentMission.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{currentMission.objective}</p>
              </div>

              {directlyImpactedIds.includes(currentMission.id) || transitivelyImpactedIds.includes(currentMission.id) ? (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs font-semibold">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span>Impacted by Disruption</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Operational Status Clear</span>
                </div>
              )}
            </div>

            {/* Intelligence Score Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    <span>Deterministic Risk Level</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    directlyImpactedIds.includes(currentMission.id) ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {directlyImpactedIds.includes(currentMission.id) ? 'HIGH' : 'LOW'}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Primary factor: {directlyImpactedIds.includes(currentMission.id) ? 'Logistics supply chain disruption' : 'Dependencies on schedule'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <CheckSquare className="h-4 w-4 text-sky-600" />
                    <span>Pre-Departure Readiness</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {directlyImpactedIds.includes(currentMission.id) ? '50.0%' : '100.0%'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full ${directlyImpactedIds.includes(currentMission.id) ? 'bg-amber-500 w-1/2' : 'bg-emerald-500 w-full'}`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Mission Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
                <div className="text-slate-400 font-medium">Timeline</div>
                <div className="font-semibold text-slate-800 mt-0.5">Day {currentMission.start_day} to Day {currentMission.end_day}</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
                <div className="text-slate-400 font-medium">Required Personnel</div>
                <div className="font-semibold text-slate-800 mt-0.5">{currentMission.required_personnel_count || 4} Specialists</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-md">
                <div className="text-slate-400 font-medium">Estimated Fuel Demand</div>
                <div className="font-semibold text-slate-800 mt-0.5">{currentMission.required_fuel_liters || 500} L</div>
              </div>
            </div>

            {/* Associated Cargo Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Assigned Logistics & Cargo Requirements
              </h4>
              <div className="space-y-2">
                {cargoList
                  .filter(
                    (c) =>
                      c.mission_id === currentMission.id ||
                      (c.destination_station_id && c.destination_station_id === currentMission.station_id)
                  )
                  .map((c) => (
                    <div key={c.id} className="p-3 border border-slate-200 bg-white rounded-md flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-800">{c.name}</div>
                        <div className="text-[11px] text-slate-500">Category: {c.category} | Weight: {c.weight_kg} kg</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        c.status === 'DELAYED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
