import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  BatteryMedium, 
  Wind, 
  ThermometerSnowflake, 
  Radio, 
  ArrowRight, 
  X,
  ShieldAlert
} from 'lucide-react';
import { useOperationalState } from '../context/OperationalStateContext';

export default function EmergencyDistressPopup({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { assistanceAlert } = useOperationalState();

  if (!isOpen) return null;

  const handleKnowMore = () => {
    if (onClose) onClose();
    navigate('/alerts?alertId=ALT-SOS-01&emergency=true');
  };

  const personName = assistanceAlert?.person || 'Dr. Vikram Nair';
  const roleName = assistanceAlert?.role || 'Senior Polar Geophysicist';
  const status = assistanceAlert?.status || 'pending';
  const location = assistanceAlert?.location || 'Survey Sector Echo (Point R-03)';
  const temperature = assistanceAlert?.temperature || '-42°C';
  const wind = assistanceAlert?.wind || '68 km/h';

  return (
    /* Clean transparent backdrop without blur so the 3D globe stays sharp */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35">
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle, Minimal Header Bar with Light Shade */}
        <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="text-xs font-semibold text-slate-800">
              Personnel Distress Alert
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/70 font-medium">
              ALT-SOS-01
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Body Content */}
        <div className="p-4 space-y-3">
          
          {/* Personnel Details */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold font-mono text-xs shrink-0">
              VN
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-slate-900 truncate">
                  {personName}
                </h4>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                  status === 'pending'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {status === 'pending' ? 'SOS Active' : 'Dispatched'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {roleName} · Team Echo
              </p>
            </div>
          </div>

          {/* Location & Time Sub-meta */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="flex items-center space-x-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{location}</span>
            </span>
            <span className="flex items-center space-x-1 shrink-0 text-slate-400 font-mono text-[10px]">
              <Clock className="w-3 h-3" />
              <span>12m ago</span>
            </span>
          </div>

          {/* Light-shaded Incident Summary */}
          <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-lg p-2.5">
            Snowcat-04 track sheared in blizzard whiteout. Cabin heat down to 24%. Crew holding in deployable shelter pod EP-03. Immediate extraction recommended.
          </p>

          {/* Minimal 1-Row Telemetry Matrix */}
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[9px] text-slate-400">Temp</div>
              <div className="font-mono text-xs font-semibold text-slate-800">{temperature}</div>
            </div>
            <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[9px] text-slate-400">Wind</div>
              <div className="font-mono text-xs font-semibold text-slate-800">{wind}</div>
            </div>
            <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[9px] text-slate-400">Battery</div>
              <div className="font-mono text-xs font-semibold text-rose-600">42%</div>
            </div>
            <div className="p-1.5 rounded-md bg-slate-50 border border-slate-100">
              <div className="text-[9px] text-slate-400">Radio</div>
              <div className="font-mono text-xs font-semibold text-slate-800">Ch-16</div>
            </div>
          </div>

        </div>

        {/* Minimal Footer Actions */}
        <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium transition cursor-pointer"
          >
            Dismiss
          </button>

          <button
            type="button"
            onClick={handleKnowMore}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition shadow-xs flex items-center space-x-1.5 cursor-pointer active:scale-[0.98]"
          >
            <span>Know More</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
