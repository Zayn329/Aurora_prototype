import React from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import { useSync } from '../context/SyncContext';
import { Settings, RefreshCw, Layers, Radio, Shield, RotateCcw } from 'lucide-react';

export default function SystemPage() {
  const { isOnline, isCheckingHealth, pendingQueueCount, resetSystemState } = useOperationalState();
  const { isSyncing, flushSyncQueue } = useSync();

  const handleReset = async () => {
    if (window.confirm('Reset central SQLite database and clear local replica state?')) {
      await resetSystemState();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System & Synchronization</h2>
        <p className="text-xs text-slate-500">
          Peer-to-peer field synchronization, IndexedDB client replica status, and database maintenance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network & Local Replica Status */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Radio className="h-4 w-4 text-sky-600" />
            <h3 className="text-sm font-semibold text-slate-800">Connection & Offline Replica</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Base Station Link</div>
                <div className="text-slate-500 text-[11px]">Primary REST API connectivity status</div>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                  isOnline
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}
              >
                {isOnline ? 'ONLINE' : 'OFFLINE MODE'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Pending Sync Records</div>
                <div className="text-slate-500 text-[11px]">Local IndexedDB mutations queued for sync</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800">{pendingQueueCount} items</span>
                {pendingQueueCount > 0 && (
                  <button
                    onClick={flushSyncQueue}
                    disabled={isSyncing || !isOnline}
                    className="px-2.5 py-1 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded font-medium text-[11px] border border-sky-200"
                  >
                    Sync Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Database Maintenance */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Shield className="h-4 w-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-800">Database & System State</h3>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Reset central SQLite backend database and flush local IndexedDB browser replica to restore initial seed operational dataset.
            </p>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs transition flex items-center space-x-2 shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Authoritative Operational State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
