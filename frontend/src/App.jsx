import React, { useState } from 'react';
import { Shield, LayoutDashboard, Package, AlertOctagon, GitBranch, RotateCcw } from 'lucide-react';
import { OperationalStateProvider, useOperationalState } from './context/OperationalStateContext';
import { SyncProvider, useSync } from './context/SyncContext';
import ConnectionPill from './components/ConnectionPill';
import OperationalOverview from './components/OperationalOverview';
import CargoTracker from './components/CargoTracker';
import DisruptionSimulator from './components/DisruptionSimulator';
import ImpactDisplay from './components/ImpactDisplay';
import DependencyGraph from './components/DependencyGraph';

function CommandPlatformContent() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'cargo' | 'disruption' | 'graph'
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [simulationLoading, setSimulationLoading] = useState(false);

  const {
    isOnline,
    isCheckingHealth,
    hasLocalData,
    pendingQueueCount,
    missions,
    cargoList,
    impactSet,
    loading,
    error,
    simulateDisruption,
    resetSystemState,
  } = useOperationalState();

  const { isSyncing } = useSync();

  const handleSelectDisruption = (cargoItem) => {
    setSelectedCargo(cargoItem);
    setActiveTab('disruption');
  };

  const handleSimulateDisruption = async (disruptionPayload) => {
    setSimulationLoading(true);
    try {
      await simulateDisruption(disruptionPayload);
      setActiveTab('disruption');
    } catch (err) {
      console.error('Disruption simulation error:', err);
      alert(`Simulation Error: ${err.message}`);
    } finally {
      setSimulationLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset central SQLite database and clear local IndexedDB replica?')) {
      await resetSystemState();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Command Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between backdrop-blur sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-cyan-400 shrink-0" />
          <div>
            <h1 className="text-xl font-bold tracking-wider text-slate-100 font-mono">AURORA</h1>
            <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">
              Polar Expedition Command Platform
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {isOnline && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center space-x-1.5 transition"
              title="Reset SQLite database to initial seed dataset"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Seed State</span>
            </button>
          )}
          <ConnectionPill
            isOnline={isOnline}
            isCheckingHealth={isCheckingHealth || isSyncing}
            pendingQueueCount={pendingQueueCount}
          />
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-slate-800 bg-slate-900/40 px-6 flex space-x-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs font-mono uppercase font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Operational Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('cargo')}
          className={`px-4 py-3 text-xs font-mono uppercase font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'cargo'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Cargo Tracker</span>
        </button>

        <button
          onClick={() => setActiveTab('disruption')}
          className={`px-4 py-3 text-xs font-mono uppercase font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'disruption'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertOctagon className="h-4 w-4" />
          <span>Disruption Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`px-4 py-3 text-xs font-mono uppercase font-semibold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'graph'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="h-4 w-4" />
          <span>Dependency DAG</span>
        </button>
      </nav>

      {/* Main View Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {loading ? (
          <div className="flex items-center justify-center p-16 text-slate-400 font-mono text-sm space-x-3">
            <div className="animate-spin h-5 w-5 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
            <span>Loading Operational State (Backend / IndexedDB Replica)...</span>
          </div>
        ) : error && !hasLocalData ? (
          <div className="bg-rose-950/40 border border-rose-800 rounded-xl p-6 text-center max-w-xl mx-auto space-y-3">
            <div className="text-rose-400 font-bold font-mono text-base">Backend API & Local Replica Unavailable</div>
            <p className="text-xs text-rose-300 font-mono">{error}</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OperationalOverview
                missions={missions}
                cargoList={cargoList}
                onSelectDisruption={handleSelectDisruption}
              />
            )}

            {activeTab === 'cargo' && (
              <CargoTracker onSelectDisruption={handleSelectDisruption} />
            )}

            {activeTab === 'disruption' && (
              <div className="space-y-6">
                <DisruptionSimulator
                  cargoList={cargoList}
                  selectedCargo={selectedCargo}
                  onSubmitDisruption={handleSimulateDisruption}
                  loading={simulationLoading}
                />
                <ImpactDisplay impactSet={impactSet} />
              </div>
            )}

            {activeTab === 'graph' && (
              <DependencyGraph impactSet={impactSet} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs font-mono text-slate-500">
        Aurora Command Platform &bull; Transport-Agnostic Synchronization & IndexedDB Client Replica
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <OperationalStateProvider>
      <SyncProvider>
        <CommandPlatformContent />
      </SyncProvider>
    </OperationalStateProvider>
  );
}
