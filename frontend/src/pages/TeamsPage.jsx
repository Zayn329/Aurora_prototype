import React from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import {
  Users,
  MapPin,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Compass,
  Zap,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Thermometer,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeamsPage() {
  const { assistanceAlert, dispatchRescue } = useOperationalState();

  // Exactly 3 clean, understandable operations
  const operations = [
    {
      id: 'OP-01',
      code: 'UNIT-ALPHA',
      title: 'Field Glaciology & Ice Shelf Traverse',
      missionId: 'ANT-027',
      missionTitle: 'Ice Shelf Radar & Core Survey',
      location: 'Survey Sector Echo (Point R-03)',
      coordinates: '69°26\'S, 76°11\'E',
      environment: '-42°C · 68 km/h Gale Blizzard',
      objective: 'Deep-ice radar sounding and seismic telemetry across crevassed shelf edge.',
      lead: {
        name: 'Dr. Vikram Nair',
        role: 'Senior Geophysicist & Unit Lead',
        callsign: 'ECHO-01',
      },
      members: [
        { name: 'Dr. Vikram Nair', role: 'Geophysicist', callsign: 'ECHO-01' },
        { name: 'Tenzing Norbu', role: 'Glacial Navigator', callsign: 'NAV-01' },
        { name: 'Suresh Joshi', role: 'Field Mechanic', callsign: 'MECH-02' },
      ],
      assignedAsset: 'Snowcat PistenBully 300 (SV-04) + Survival Pod EP-03',
      hasIncident: true,
    },
    {
      id: 'OP-02',
      code: 'UNIT-BRAVO',
      title: 'Station Command & Base Power Grid',
      missionId: 'ANT-026',
      missionTitle: 'Base Support & Coastal Science',
      location: 'Bharati Main Station Habitat',
      coordinates: '69°24\'S, 76°11\'E',
      environment: '-28°C · 34 km/h Wind · Clear',
      objective: 'Primary station life-support, 284 kW microgrid regulation, and coastal marine telemetry.',
      lead: {
        name: 'Dr. Sunita Rao',
        role: 'Station Commander & Chief Scientist',
        callsign: 'BRAVO-LEAD',
      },
      members: [
        { name: 'Dr. Sunita Rao', role: 'Station Commander', callsign: 'BRAVO-LEAD' },
        { name: 'Cmdr. Kabir Mehra', role: 'Operations Deputy', callsign: 'AURORA-OPS' },
        { name: 'Rajesh Kulkarni', role: 'Chief Power Engineer', callsign: 'POWER-GRID' },
      ],
      assignedAsset: 'Main Complex Module, GEN-01 Generator, Starlink Mast',
      statusText: 'NOMINAL OPERATIONAL',
      hasIncident: false,
    },
    {
      id: 'OP-03',
      code: 'UNIT-CHARLIE',
      title: 'Tactical Search & Rescue (SAR Standby)',
      missionId: 'ANT-031',
      missionTitle: 'Emergency Polar Recovery',
      location: 'Bharati Fleet Depot (Hangar Bay 2)',
      coordinates: '69°24\'S, 76°11\'E',
      environment: 'Staged in heated vehicle bay',
      objective: 'Rapid polar extraction, extreme-weather winch recovery, and sub-zero medical triage.',
      lead: {
        name: 'Vikram Seth',
        role: 'Tactical SAR Officer',
        callsign: 'RESCUE-LEAD',
      },
      members: [
        { name: 'Vikram Seth', role: 'SAR Commander', callsign: 'RESCUE-LEAD' },
        { name: 'Dr. Sanjay Mathur', role: 'Trauma Physician', callsign: 'MEDIC-01' },
        { name: 'Maya Deshmukh', role: 'Emergency Paramedic', callsign: 'RESCUE-MED' },
      ],
      assignedAsset: 'Rescue Snowcat-02 (Heavy Winch + 4-Berth Thermal Pod)',
      statusText: 'READY ON STANDBY',
      hasIncident: false,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-700" />
            <span>Active Field Operations & Teams</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of the 3 primary operational units currently deployed in Eastern Antarctica.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
            3 Units Active
          </span>
          <span className={`px-2.5 py-1 rounded-md font-medium border ${
            assistanceAlert.status === 'pending'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {assistanceAlert.status === 'pending' ? '1 Distress Alert' : '0 Pending Alerts'}
          </span>
        </div>
      </div>

      {/* 3 Clean Operational Cards */}
      <div className="space-y-4">
        {operations.map((op) => {
          const isAlpha = op.id === 'OP-01';
          const isPendingDistress = isAlpha && assistanceAlert.status === 'pending';
          const isDispatched = isAlpha && assistanceAlert.status === 'dispatched';

          return (
            <div
              key={op.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition ${
                isPendingDistress
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {op.code}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-base">{op.title}</h3>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {op.objective}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="shrink-0">
                  {isPendingDistress && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                      <span>ASSISTANCE REQUIRED</span>
                    </span>
                  )}
                  {isDispatched && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>RESCUE EN ROUTE (ETA {assistanceAlert.eta})</span>
                    </span>
                  )}
                  {!op.hasIncident && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {op.statusText}
                    </span>
                  )}
                </div>
              </div>

              {/* Alert Callout for Team Alpha */}
              {isAlpha && (
                <div className={`mt-3.5 p-3.5 rounded-lg border text-xs ${
                  isPendingDistress
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-semibold flex items-center space-x-2">
                        {isPendingDistress ? (
                          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        )}
                        <span>
                          {isPendingDistress
                            ? 'Field Incident at Survey Sector Echo: Dr. Vikram Nair'
                            : 'Rescue Dispatched to Survey Sector Echo'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed pl-6">
                        {isPendingDistress
                          ? assistanceAlert.situation
                          : `Rescue Snowcat-02 en route with auxiliary heating pod. Team Echo holding safely in shelter pod EP-03.`}
                      </p>
                    </div>

                    {isPendingDistress && (
                      <button
                        onClick={() => dispatchRescue('Rescue Snowcat-02')}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white font-medium rounded-lg text-xs transition shrink-0 cursor-pointer shadow-xs flex items-center space-x-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Authorize Rescue</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Grid: Personnel & Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3.5 text-xs">
                {/* 1. Assigned Personnel */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-2">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Unit Personnel (3)
                  </div>
                  <div className="space-y-1.5">
                    {op.members.map((m) => (
                      <div key={m.callsign} className="flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-medium text-slate-900">{m.name}</span>
                          <span className="text-slate-500 text-[10px] ml-1">· {m.role}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                          {m.callsign}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Location & Field Environment */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-2">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Deployment Location
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{op.location}</span>
                    </div>
                    <div className="text-slate-500 font-mono text-[10px] pl-5">
                      {op.coordinates}
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-600 pt-1">
                      <Thermometer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{op.environment}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Operational Asset & Mission Link */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-2">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Assigned Assets & Mission
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="text-slate-800 font-medium">
                      {op.assignedAsset}
                    </div>
                    <div className="text-slate-500 pt-1 flex items-center justify-between">
                      <span className="font-mono text-[10px]">Mission: {op.missionId}</span>
                      <Link
                        to="/missions"
                        className="text-slate-700 hover:text-slate-900 font-medium flex items-center space-x-0.5"
                      >
                        <span>View Plan</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
