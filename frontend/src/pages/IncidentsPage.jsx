import React, { useState, useEffect } from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import { AlertTriangle, Activity, ArrowRight, GitBranch } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DependencyGraph from '../components/DependencyGraph';

export default function IncidentsPage() {
  const { cargoList, impactSet, simulateDisruption, loading } = useOperationalState();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCargoId, setSelectedCargoId] = useState('');
  const [delayDays, setDelayDays] = useState(3);
  const [reason, setReason] = useState('Severe Antarctic blizzard causing transport grounding');
  const [simulating, setSimulating] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    const cargoIdFromUrl = searchParams.get('cargoId');
    if (cargoIdFromUrl) {
      setSelectedCargoId(cargoIdFromUrl);
    } else if (cargoList.length > 0 && !selectedCargoId) {
      setSelectedCargoId(cargoList[0].id);
    }
  }, [cargoList, searchParams]);

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!selectedCargoId) return;

    setSimulating(true);
    try {
      await simulateDisruption({
        cargo_id: selectedCargoId,
        delay_days: Number(delayDays),
        reason: reason,
      });
    } catch (err) {
      console.error('Incident simulation failed:', err);
      alert(`Simulation error: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 text-sm space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-sky-600 border-t-transparent rounded-full"></div>
        <span>Loading incident solver...</span>
      </div>
    );
  }

  const directlyImpactedMissions = impactSet?.directly_impacted_mission_ids || [];
  const transitivelyImpactedMissions = impactSet?.transitively_impacted_mission_ids || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Incidents & Deterministic Impact Analysis</h2>
        <p className="text-xs text-slate-500">
          Assess operational disruptions and evaluate deterministic cascade effects across field missions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Form Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4 lg:col-span-1">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-800">Report / Simulate Incident</h3>
          </div>

          <form onSubmit={handleSimulate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Affected Logistics Item</label>
              <select
                value={selectedCargoId}
                onChange={(e) => setSelectedCargoId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {cargoList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Delay Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={delayDays}
                onChange={(e) => setDelayDays(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Incident Reason / Notes</label>
              <textarea
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={simulating}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs transition flex items-center justify-center space-x-2 shadow-sm"
            >
              {simulating ? (
                <span>Calculating Cascade...</span>
              ) : (
                <>
                  <Activity className="h-3.5 w-3.5" />
                  <span>Analyze Deterministic Impact</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Deterministic Impact Display Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center space-x-2">
              <GitBranch className="h-4 w-4 text-sky-600" />
              <span>Cascade Impact Results</span>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowGraph(!showGraph)}
                className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded border border-slate-200 font-medium text-xs flex items-center space-x-1"
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>{showGraph ? 'Hide Graph' : 'View Dependency Map'}</span>
              </button>
              {impactSet && (
                <button
                  onClick={() => navigate('/decisions')}
                  className="px-3 py-1 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded border border-sky-200 font-medium text-xs flex items-center space-x-1"
                >
                  <span>View Recommendations</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {!impactSet ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-md border border-dashed border-slate-200">
              No incident impact calculated yet. Select an item on the left and run analysis.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Impact Breakdown Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-md">
                  <div className="text-xs font-semibold text-rose-800">Directly Affected Missions</div>
                  <div className="text-2xl font-bold text-rose-900 mt-1">{directlyImpactedMissions.length}</div>
                </div>
                <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-md">
                  <div className="text-xs font-semibold text-amber-800">Cascade Affected Missions</div>
                  <div className="text-2xl font-bold text-amber-900 mt-1">{transitivelyImpactedMissions.length}</div>
                </div>
              </div>

              {/* Directly Impacted Missions List */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Directly Dependent Missions
                </h4>
                {directlyImpactedMissions.length > 0 ? (
                  <div className="space-y-2">
                    {directlyImpactedMissions.map((id) => (
                      <div key={id} className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs font-semibold text-rose-900">
                        Mission ID: {id}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-500">
                    No direct mission dependencies disrupted.
                  </div>
                )}
              </div>

              {/* Embedded Dependency Graph Visualizer */}
              {showGraph && (
                <div className="pt-4 border-t border-slate-100">
                  <DependencyGraph impactSet={impactSet} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
