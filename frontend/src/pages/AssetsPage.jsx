import React from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import {
  Box,
  Truck,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Ship,
  Plane,
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AssetsPage() {
  const { assistanceAlert, dispatchRescue } = useOperationalState();

  // 5 primary, highly relevant expedition assets
  const primaryAssets = [
    {
      id: 'A-004',
      code: 'SV-04',
      name: 'Snowcat PistenBully 300 Polar',
      type: 'Heavy All-Terrain Tracked Vehicle',
      location: 'Survey Sector Echo (Point R-03)',
      operator: 'Dr. Vikram Nair (Unit Alpha)',
      specs: 'Heavy winch · Front blade · Auxiliary insulated passenger cabin',
      missionId: 'ANT-027',
      fuel: '58%',
      power: '24% (Auxiliary)',
      lastService: '2026-09-15',
      isIncident: true,
    },
    {
      id: 'A-005',
      code: 'SV-02',
      name: 'Rescue Snowcat-02 (Polar Recovery)',
      type: 'Search & Heavy Recovery Vehicle',
      location: 'Bharati Fleet Depot (Hangar Bay 2)',
      operator: 'Vikram Seth (SAR Lead)',
      specs: 'Heavy recovery winch · 4-berth medical thermal pod · Satellite beacon',
      missionId: 'ANT-031',
      fuel: '100%',
      power: '100%',
      lastService: '2026-09-27',
      isRescueUnit: true,
    },
    {
      id: 'A-011',
      code: 'GEN-01',
      name: 'Caterpillar 3406 Diesel Generator',
      type: 'Base Prime Power Generator',
      location: 'Bharati Station Power Plant',
      operator: 'Rajesh Kulkarni (Chief Power Engineer)',
      specs: '250 kW output · Heat recovery loop linked to station radiant floor',
      missionId: 'ANT-026',
      fuel: '82%',
      power: '284 kW Load',
      lastService: '2026-09-20',
      statusText: 'NOMINAL OPERATIONAL',
    },
    {
      id: 'A-002',
      code: 'AIR-01',
      name: 'Twin Otter DHC-6 Polar Utility',
      type: 'Ski-Equipped Utility Aircraft',
      location: 'Bharati Ice Runway (Blue Ice Sector)',
      operator: 'David Evans (Flight Lead)',
      specs: 'Twin turboprop · Skis & wheels · 1,800 kg cargo payload',
      missionId: 'ANT-027',
      fuel: '91%',
      power: '98%',
      lastService: '2026-09-18',
      statusText: 'NOMINAL OPERATIONAL',
    },
    {
      id: 'A-001',
      code: 'RV-01',
      name: 'Polar Explorer Research Vessel',
      type: 'Icebreaker & Oceanographic Vessel',
      location: 'Harbor Dock (Larsemann Coast)',
      operator: 'Capt. Ramesh Sen',
      specs: '6,400 tonnes · Dynamic positioning · Multibeam bathymetric sonar',
      missionId: 'ANT-026',
      fuel: '84%',
      power: '100%',
      lastService: '2026-09-10',
      statusText: 'NOMINAL OPERATIONAL',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Box className="w-5 h-5 text-slate-700" />
            <span>Expedition Fleet & Core Assets</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational status of primary mission vehicles, base generators, and transport platforms.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
            5 Primary Assets
          </span>
          <span className={`px-2.5 py-1 rounded-md font-medium border ${
            assistanceAlert.status === 'pending'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {assistanceAlert.status === 'pending' ? '1 Disabled Unit' : 'All Clear'}
          </span>
        </div>
      </div>

      {/* 5 Clean Professional Asset Cards */}
      <div className="space-y-4">
        {primaryAssets.map((asset) => {
          const isIncident = asset.isIncident && assistanceAlert.status === 'pending';
          const isIncidentDispatched = asset.isIncident && assistanceAlert.status === 'dispatched';
          const isRescueDispatched = asset.isRescueUnit && assistanceAlert.status === 'dispatched';

          return (
            <div
              key={asset.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition ${
                isIncident
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {asset.code}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-base">{asset.name}</h3>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    {asset.id} · {asset.type}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="shrink-0">
                  {isIncident && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                      <span>DISABLED / INCIDENT</span>
                    </span>
                  )}
                  {isIncidentDispatched && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      RECOVERY EN ROUTE
                    </span>
                  )}
                  {asset.isRescueUnit && !isRescueDispatched && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      STANDBY READY
                    </span>
                  )}
                  {asset.isRescueUnit && isRescueDispatched && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>EN ROUTE (ETA {assistanceAlert.eta})</span>
                    </span>
                  )}
                  {!asset.isIncident && !asset.isRescueUnit && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {asset.statusText}
                    </span>
                  )}
                </div>
              </div>

              {/* Incident Alert box for Snowcat-04 */}
              {asset.isIncident && (
                <div className={`mt-3.5 p-3.5 rounded-lg border text-xs ${
                  isIncident
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-semibold flex items-center space-x-2">
                        {isIncident ? (
                          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        )}
                        <span>
                          {isIncident
                            ? 'Field Incident: Left track sheared on glacial sastrugi'
                            : 'Recovery Snowcat-02 Dispatched'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed pl-6">
                        {isIncident
                          ? 'Track failure occurred in sub-zero whiteout. Auxiliary cabin heater battery down to 24%. Crew sheltering in Survival Pod EP-03.'
                          : `Rescue Snowcat-02 en route with replacement track links and auxiliary heating pod (ETA ${assistanceAlert.eta}).`}
                      </p>
                    </div>

                    {isIncident && (
                      <button
                        onClick={() => dispatchRescue('Rescue Snowcat-02')}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white font-medium rounded-lg text-xs transition shrink-0 cursor-pointer shadow-xs flex items-center space-x-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Rescue</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3.5 text-xs">
                {/* 1. Location & Assigned Operator */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Deployment & Operator
                  </div>
                  <div className="flex items-center space-x-1.5 font-medium text-slate-800 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{asset.location}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] pl-5">
                    Operator: {asset.operator}
                  </div>
                </div>

                {/* 2. Technical Specifications */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    System Specifications
                  </div>
                  <div className="text-slate-700 text-[11px] leading-relaxed">
                    {asset.specs}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Last Inspected: {asset.lastService}
                  </div>
                </div>

                {/* 3. Fuel & Power Levels */}
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Power & Fuel Levels
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Fuel Reserve:</span>
                    <span className="font-mono font-medium text-slate-800">{asset.fuel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Power / Battery:</span>
                    <span className="font-mono font-medium text-slate-800">{asset.power}</span>
                  </div>
                  <div className="pt-1 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200/60">
                    <span>Mission: {asset.missionId}</span>
                    <Link
                      to="/missions"
                      className="text-slate-700 hover:text-slate-900 font-medium flex items-center space-x-0.5"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
