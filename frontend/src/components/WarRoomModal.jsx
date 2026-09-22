import React, { useState } from 'react';
import { Flame, ShieldAlert, FileText, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';
import { useOperationalState } from '../context/OperationalStateContext';

export default function WarRoomModal({ isOpen, onClose }) {
  const { impactSet } = useOperationalState();
  const [actionDone, setActionDone] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border-2 border-rose-500 rounded-xl max-w-2xl w-full shadow-2xl p-6 space-y-6">
        {/* War Room Header */}
        <div className="flex items-center justify-between border-b border-rose-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-100 rounded-lg border border-rose-200">
              <Flame className="h-6 w-6 text-rose-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">Emergency Response Mode</h3>
                <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded">
                  CRITICAL PRIORITY
                </span>
              </div>
              <p className="text-xs text-slate-500">Antarctic Outpost Alpha Heating Reserve Shortage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Situation Triage Breakdown */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md">
            <div className="font-semibold text-rose-900">Active Threat</div>
            <div className="text-rose-700 mt-0.5">Primary Heating Reserve Fuel Deficit</div>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="font-semibold text-amber-900">Emergency Personnel Roll Call</div>
            <div className="text-amber-800 mt-0.5">
              12 Accounted For &bull; 1 Unreachable &bull; 4 Fit Specialists
            </div>
          </div>
        </div>

        {/* RAG Grounded Guidance */}
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-md text-xs space-y-1">
          <div className="font-bold text-sky-900 flex items-center space-x-1">
            <FileText className="h-3.5 w-3.5" />
            <span>SOP Contingency: Fuel_and_Power_Contingency.md §2.1</span>
          </div>
          <p className="text-[11px] text-sky-800">
            "Under severe sub-zero thermal deficit, field commanders may re-allocate reserve diesel fuel from transport assets to station heating grid."
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Commander approval required before executing asset dispatch.</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setActionDone(true);
                setTimeout(() => {
                  setActionDone(false);
                  onClose();
                }, 1500);
              }}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-md shadow-sm flex items-center space-x-1"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>{actionDone ? 'Executing Triage...' : 'Approve Emergency Triage'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
