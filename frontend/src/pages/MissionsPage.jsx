import React, { useState } from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import {
  Compass,
  Clock,
  MapPin,
  AlertCircle,
  ChevronRight,
  CheckCircle2,
  ShieldAlert,
  CheckSquare,
  AlertTriangle,
  X,
  Truck,
  Users,
  Radio,
  Navigation,
  Wind,
  Thermometer
} from 'lucide-react';

export default function MissionsPage() {
  const { missions, cargoList, impactSet, loading, assistanceAlert, dispatchRescue } = useOperationalState();
  const [selectedMission, setSelectedMission] = useState(null);
  const [showSosModal, setShowSosModal] = useState(false);

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

            {/* Field Personnel Assistance Alert Callout */}
            {assistanceAlert && (
              <div className={`p-4 rounded-xl border text-xs ${
                assistanceAlert.status === 'pending'
                  ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      assistanceAlert.status === 'pending' ? 'bg-amber-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
                    }`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center space-x-2">
                        <span>Field Incident: {assistanceAlert.person}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          assistanceAlert.status === 'pending' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {assistanceAlert.status === 'pending' ? 'ASSISTANCE REQUIRED' : 'RESCUE DISPATCHED'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Location: <span className="font-semibold text-slate-800">{assistanceAlert.location}</span> · {assistanceAlert.situation}
                      </p>
                      {assistanceAlert.status === 'dispatched' && (
                        <div className="mt-1 text-[11px] font-medium text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{assistanceAlert.dispatchedUnit} en route (ETA {assistanceAlert.eta}). Emergency survival shelter protocol active.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setShowSosModal(true)}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
                    >
                      View Popup Alert
                    </button>
                    {assistanceAlert.status === 'pending' && (
                      <button
                        onClick={() => dispatchRescue('Rescue Snowcat-02')}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-medium rounded-lg text-xs transition cursor-pointer"
                      >
                        Dispatch Rescue
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

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

      {/* SOS Alert Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-800">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Personnel Assistance Alert</h3>
                  <p className="text-[11px] text-slate-500 font-mono">INCIDENT ID: SOS-ECHO-01 · PRIORITY 1</p>
                </div>
              </div>
              <button
                onClick={() => setShowSosModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Personnel and Location Card */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{assistanceAlert.person}</div>
                    <div className="text-slate-500 text-[11px]">{assistanceAlert.role}</div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    assistanceAlert.status === 'pending'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {assistanceAlert.status === 'pending' ? 'Needs Assistance' : 'Rescue Active'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Sector / Waypoint</span>
                    <span className="font-medium text-slate-800 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{assistanceAlert.location}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Field Weather</span>
                    <span className="font-medium text-slate-800 flex items-center space-x-1 mt-0.5">
                      <Thermometer className="w-3 h-3 text-slate-500 shrink-0" />
                      <span>{assistanceAlert.temperature} · {assistanceAlert.wind}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Incident Situation */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Incident Brief
                </div>
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg text-slate-700 leading-relaxed text-xs">
                  {assistanceAlert.situation}
                </div>
              </div>

              {/* Status Update if Dispatched */}
              {assistanceAlert.status === 'dispatched' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start space-x-2.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-xs">Rescue Response Dispatched</div>
                    <div className="text-[11px] text-emerald-800 mt-0.5">
                      Unit: <span className="font-medium">{assistanceAlert.dispatchedUnit}</span> (ETA {assistanceAlert.eta}).
                      Emergency emergency shelter protocol confirmed with field unit.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start space-x-2.5 text-slate-600">
                  <Radio className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-xs text-slate-800">Operational Recommendation</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Polar Safety SOP 4.2 recommends deploying secondary Snowcat recovery unit from Maitri base with auxiliary heating pod and replacement track links.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowSosModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-xs transition cursor-pointer"
              >
                Close
              </button>
              {assistanceAlert.status === 'pending' && (
                <button
                  onClick={() => {
                    dispatchRescue('Rescue Snowcat-02');
                  }}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-medium rounded-lg text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Authorize & Dispatch Rescue</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
