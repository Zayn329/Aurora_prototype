import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  BatteryMedium, 
  Wind, 
  ThermometerSnowflake, 
  Radio, 
  User, 
  ShieldAlert, 
  ArrowRight, 
  X,
  Truck
} from 'lucide-react';
import { useOperationalState } from '../context/OperationalStateContext';

export default function EmergencyDistressPopup({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { assistanceAlert, dispatchRescue } = useOperationalState();

  if (!isOpen) return null;

  const handleKnowMore = () => {
    if (onClose) onClose();
    navigate('/alerts?alertId=ALT-SOS-01&emergency=true');
  };

  const handleQuickDispatch = (e) => {
    e.stopPropagation();
    if (dispatchRescue) {
      dispatchRescue('Rescue Snowcat-02');
    }
  };

  const personName = assistanceAlert?.person || 'Dr. Vikram Nair';
  const roleName = assistanceAlert?.role || 'Senior Polar Geophysicist';
  const status = assistanceAlert?.status || 'pending';
  const location = assistanceAlert?.location || 'Survey Sector Echo (Point R-03)';
  const temperature = assistanceAlert?.temperature || '-42°C';
  const wind = assistanceAlert?.wind || '68 km/h Gale';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border-2 border-rose-500 overflow-hidden ring-4 ring-rose-500/20"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Emergency Beacon Warning Bar */}
        <div className="bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 text-white px-5 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase">
                Critical SOS Alert
              </span>
              <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded font-bold">
                ALT-SOS-01
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-rose-100 hidden sm:inline">
              BEACON: 406.025 MHz ACTIVE
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Close popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Person in Emergency Identity Header */}
          <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-rose-100">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center font-bold font-mono text-base shadow-md shadow-rose-600/30 shrink-0">
                VN
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {personName}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase animate-pulse">
                    {status === 'pending' ? 'DISTRESS SOS' : 'DISPATCHED'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  {roleName} · Survey Team Echo (Snowcat-04)
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{location}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Distress ping 12m ago</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Situation Description */}
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-950 space-y-1.5 leading-relaxed">
            <div className="flex items-center space-x-1.5 font-bold text-rose-900 text-xs uppercase tracking-wide">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Casualty & Emergency Situation:</span>
            </div>
            <p className="text-[12px] text-rose-900">
              Snowcat-04 track sheared in blizzard whiteout. Internal cabin heat down to <strong>24%</strong>. 
              Crew has deployed <strong>Emergency Survival Shelter Pod EP-03</strong> at 69°26'S, 76°11'E. 
              Ambient blizzard wind chill reaching critical threshold. Immediate heavy rescue extraction required.
            </p>
          </div>

          {/* Live Survival Telemetry Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                <span>Ambient Temp</span>
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{temperature}</div>
              <div className="text-[10px] text-slate-500">Extreme Frostbite</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                <Wind className="w-3 h-3 text-amber-600" />
                <span>Blizzard Wind</span>
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{wind}</div>
              <div className="text-[10px] text-slate-500">Zero Visibility</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                <BatteryMedium className="w-3 h-3 text-rose-600" />
                <span>Pod Battery</span>
              </div>
              <div className="font-bold text-rose-700 text-sm mt-0.5">42% (~3.2h)</div>
              <div className="text-[10px] text-slate-500">Auxiliary Heat</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-400 font-medium flex items-center space-x-1">
                <Radio className="w-3 h-3 text-purple-600" />
                <span>VHF Channel</span>
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">Ch-16 SOS</div>
              <div className="text-[10px] text-slate-500">Beacon Transmitting</div>
            </div>
          </div>

          {/* Recommended Polar Protocol */}
          <div className="px-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Protocol: <span className="font-semibold text-slate-900">SOP-POL-04 (Whiteout Crew Extraction)</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Station: Bharati Depot
            </span>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition cursor-pointer order-2 sm:order-1 text-center"
          >
            Dismiss & View 3D Globe
          </button>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto order-1 sm:order-2">
            {status === 'pending' && (
              <button
                type="button"
                onClick={handleQuickDispatch}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Dispatch Snowcat-02</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleKnowMore}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-xl transition shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Know More & Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
