import React from 'react';
import { Package, Truck, Home, MapPin, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CargoFlow({ item }) {
  if (!item) return null;

  const itemName = item.item_name ?? item.name ?? item.id ?? 'Unnamed cargo';
  const isDelayed = item.status === 'DELAYED';

  const stages = [
    { label: 'Central Warehouse', icon: Home, done: true },
    { label: 'In Transit Transport', icon: Truck, done: true, blocked: isDelayed },
    { label: 'Station Storage', icon: Package, done: !isDelayed },
    { label: 'Field Site', icon: MapPin, done: item.status === 'DELIVERED' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-semibold text-slate-800 flex items-center space-x-2">
          <Package className="h-4 w-4 text-sky-600" />
          <span>Cargo Supply Flow Pipeline: {itemName}</span>
        </h4>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
          isDelayed ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {item.status}
        </span>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="grid grid-cols-4 gap-2 text-center py-2 relative">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={st.label} className="flex flex-col items-center space-y-1 z-10">
              <div className={`p-3 rounded-full border-2 transition ${
                st.blocked
                  ? 'bg-amber-50 border-amber-500 text-amber-700 animate-pulse'
                  : st.done
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-[11px] font-semibold text-slate-800">{st.label}</div>
              {st.blocked && (
                <div className="text-[10px] text-amber-700 font-bold flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>BLOCKED IN TRANSIT</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
