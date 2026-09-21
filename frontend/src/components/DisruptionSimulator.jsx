import React, { useState, useEffect } from 'react';
import { AlertOctagon, Send } from 'lucide-react';

export default function DisruptionSimulator({ cargoList, selectedCargo, onSubmitDisruption, loading }) {
  const [targetCargoId, setTargetCargoId] = useState(
    selectedCargo?.id || (cargoList.length > 0 ? cargoList[0].id : 'cargo-fuel-crate-001')
  );
  const [delayHours, setDelayHours] = useState(24);
  const [description, setDescription] = useState(
    'Coastal blizzard and severe pack ice formation delayed cargo vessel unloading.'
  );

  useEffect(() => {
    if (selectedCargo?.id) {
      setTargetCargoId(selectedCargo.id);
    } else if (cargoList.length > 0 && !targetCargoId) {
      setTargetCargoId(cargoList[0].id);
    }
  }, [selectedCargo, cargoList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCargoId = targetCargoId || (cargoList.length > 0 ? cargoList[0].id : 'cargo-fuel-crate-001');
    onSubmitDisruption({
      entity_id: finalCargoId,
      entity_type: 'CARGO',
      disruption_type: 'CARGO_DELAY',
      delay_hours: Number(delayHours),
      severity: 'CRITICAL',
      description,
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur">
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
        <AlertOctagon className="h-6 w-6 text-amber-400" />
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Disruption Simulator</h3>
          <p className="text-xs text-slate-400">
            Inject delay events to run Phase 2 NetworkX DAG impact analysis.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Target Cargo Item</label>
          <select
            value={targetCargoId}
            onChange={(e) => setTargetCargoId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            {cargoList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.item_name} ({c.id})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Delay Duration (Hours)</label>
            <input
              type="number"
              min="1"
              max="168"
              value={delayHours}
              onChange={(e) => setDelayHours(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Severity Classification</label>
            <input
              type="text"
              readOnly
              value="CRITICAL (Deterministic Rule)"
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-2 text-sm text-rose-400 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Incident Description</label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold font-mono text-sm flex items-center space-x-2 transition shadow-lg shadow-cyan-950 disabled:opacity-50"
        >
          {loading ? (
            <span>Computing Deterministic Impact...</span>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Trigger Disruption Impact Analysis</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
