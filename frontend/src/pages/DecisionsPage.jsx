import React, { useState } from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import { CheckSquare, Shield, FileText, CheckCircle2, XCircle, ArrowRight, Flame } from 'lucide-react';
import WarRoomModal from '../components/WarRoomModal';

export default function DecisionsPage() {
  const { impactSet, loading } = useOperationalState();
  const [decisionSubmitted, setDecisionSubmitted] = useState(false);
  const [warRoomOpen, setWarRoomOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 text-sm space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-sky-600 border-t-transparent rounded-full"></div>
        <span>Loading decision queue...</span>
      </div>
    );
  }

  const handleApprove = () => {
    setDecisionSubmitted('APPROVED');
  };

  const handleReject = () => {
    setDecisionSubmitted('REJECTED');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Commander Decisions & Review</h2>
          <p className="text-xs text-slate-500">
            Review decision support proposals, verify SOP citations, and approve or reject schedule adjustments.
          </p>
        </div>
        <button
          onClick={() => setWarRoomOpen(true)}
          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-md shadow-sm flex items-center space-x-1.5"
        >
          <Flame className="h-4 w-4" />
          <span>Emergency War Room</span>
        </button>
      </div>

      <WarRoomModal isOpen={warRoomOpen} onClose={() => setWarRoomOpen(false)} />

      {decisionSubmitted ? (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm text-center max-w-md mx-auto space-y-4">
          <div className="inline-flex p-3 bg-emerald-100 rounded-full border border-emerald-200 text-emerald-800">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Decision Recorded</h3>
          <p className="text-xs text-slate-600">
            Commander action was recorded in the audit trail and state updated.
          </p>
          <button
            onClick={() => setDecisionSubmitted(false)}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-md shadow-sm"
          >
            Review Next Proposal
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-6 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold text-[11px]">
                Pending Commander Approval
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                Reschedule Mission Alpha Start Day (+3 Days Shift)
              </h3>
            </div>
            <Shield className="h-6 w-6 text-sky-700" />
          </div>

          {/* Proposal Summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-2">
            <div className="font-semibold text-slate-800">Decision Context</div>
            <p className="text-slate-600">
              Logistics item delay disrupts fuel availability for Mission Alpha. Proposed resolution shifts Mission Alpha start day from Day 4 to Day 7 to ensure full supply delivery before departure.
            </p>
          </div>

          {/* RAG SOP Evidence */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>Grounded Procedure Citations (SOP Context)</span>
            </h4>
            <div className="p-3 bg-sky-50/50 border border-sky-200 rounded-md text-xs text-sky-900 space-y-1">
              <div className="font-semibold">Polar Safety SOP v2 &bull; Section 4.2</div>
              <p className="text-[11px] text-sky-800">
                "No expedition mission shall depart base station without minimum 120% reserve fuel load verified at departure location."
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md flex items-center space-x-1.5 shadow-sm"
            >
              <XCircle className="h-4 w-4 text-slate-500" />
              <span>Reject Proposal</span>
            </button>
            <button
              onClick={handleApprove}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-md flex items-center space-x-1.5 shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve Operational Change</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
