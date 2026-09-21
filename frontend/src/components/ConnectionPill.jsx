import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export default function ConnectionPill({ isOnline, isCheckingHealth, pendingQueueCount }) {
  if (isCheckingHealth) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 text-xs font-mono text-slate-400">
        <div className="animate-spin h-3 w-3 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
        <span>CHECKING API...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {pendingQueueCount > 0 && (
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-amber-800 bg-amber-950/80 text-amber-300 text-xs font-mono font-semibold animate-pulse">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{pendingQueueCount} PENDING SYNC</span>
        </div>
      )}

      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 text-xs font-mono">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 font-semibold uppercase">ONLINE</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-amber-400" />
            <span className="text-amber-400 font-semibold uppercase">OFFLINE (LOCAL REPLICA)</span>
          </>
        )}
      </div>
    </div>
  );
}
