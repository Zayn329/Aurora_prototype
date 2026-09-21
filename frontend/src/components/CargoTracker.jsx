import React, { useState } from 'react';
import { Package, AlertTriangle, Play, Sparkles, Edit3 } from 'lucide-react';
import { useOperationalState } from '../context/OperationalStateContext';

export default function CargoTracker({ onSelectDisruption }) {
  const { cargoList, updateCargoStatusOffline, isOnline } = useOperationalState();
  const [editingCargoId, setEditingCargoId] = useState(null);
  const [delayInput, setDelayHoursInput] = useState(24);

  const handleApplyOfflineDelay = async (cargo) => {
    await updateCargoStatusOffline(cargo.id, {
      delay_hours: Number(delayInput),
      status: 'DELAYED',
    });
    setEditingCargoId(null);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Package className="h-6 w-6 text-cyan-400" />
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Cargo & Supply Inventory</h3>
            <p className="text-xs text-slate-400">
              Track supplies and record local offline mutations stored in IndexedDB.
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-mono text-slate-400 uppercase">
              <th className="py-3 px-4">Cargo Item</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Location / Stage</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {cargoList.map((c) => {
              const isCanonical = c.id === 'cargo-fuel-crate-001' || c.item_name.includes('Cargo-Fuel-01');
              const isDelayed = c.delay_hours > 0 || c.status === 'DELAYED';
              const isEditing = editingCargoId === c.id;

              return (
                <tr
                  key={c.id}
                  className={`hover:bg-slate-800/40 transition ${
                    isCanonical ? 'bg-cyan-950/20 border-l-2 border-l-cyan-400' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200 flex items-center space-x-2">
                      <span>{c.item_name}</span>
                      {isCanonical && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center space-x-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>CANONICAL DEMO TARGET</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-500">ID: {c.id}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-300">{c.category}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                    {c.quantity} {c.unit}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{c.location_stage}</td>
                  <td className="py-3.5 px-4 font-mono text-xs">
                    {isDelayed ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 font-semibold border border-rose-800 inline-flex items-center space-x-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>DELAYED (+{c.delay_hours}h)</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {c.status}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end space-x-2">
                        <input
                          type="number"
                          value={delayInput}
                          onChange={(e) => setDelayHoursInput(e.target.value)}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 font-mono"
                        />
                        <button
                          onClick={() => handleApplyOfflineDelay(c)}
                          className="px-2 py-1 bg-amber-600 text-slate-950 font-mono text-xs rounded font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCargoId(null)}
                          className="px-2 py-1 bg-slate-800 text-slate-400 font-mono text-xs rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingCargoId(c.id);
                            setDelayHoursInput(c.delay_hours || 24);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center space-x-1"
                          title="Record offline delay mutation"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Quick Delay</span>
                        </button>

                        <button
                          onClick={() => onSelectDisruption(c)}
                          disabled={!isOnline}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-mono text-xs flex items-center space-x-1.5 transition disabled:opacity-40"
                          title={isOnline ? 'Run DAG analysis via API' : 'DAG Analysis Requires Online Backend'}
                        >
                          <Play className="h-3.5 w-3.5" />
                          <span>Analyze DAG</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
