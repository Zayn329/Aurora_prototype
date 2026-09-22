import React from 'react';
import { Wifi, WifiOff, RefreshCw, Layers } from 'lucide-react';

export default function ConnectionPill({ isOnline, isCheckingHealth, pendingQueueCount }) {
  return (
    <div className="flex items-center space-x-2 text-xs font-medium">
      {/* Network Status Badge */}
      <div
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border transition ${
          isOnline
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}
      >
        {isCheckingHealth ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-500" />
        ) : isOnline ? (
          <Wifi className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <WifiOff className="h-3.5 w-3.5 text-amber-600" />
        )}
        <span>{isOnline ? 'Base Station Online' : 'Local Offline Mode'}</span>
      </div>

      {/* Pending Local Mutations Counter */}
      {pendingQueueCount > 0 && (
        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md border bg-sky-50 border-sky-200 text-sky-800">
          <Layers className="h-3.5 w-3.5 text-sky-600" />
          <span>{pendingQueueCount} Pending Sync</span>
        </div>
      )}
    </div>
  );
}
