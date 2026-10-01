import React, { useState } from 'react';
import { DEMO_ALERTS } from '../data/expeditionData';
import { useOperationalState } from '../context/OperationalStateContext';
import {
  AlertTriangle,
  ShieldAlert,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  CloudSun,
  Radio,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AlertsPage() {
  const { assistanceAlert, dispatchRescue, setWeatherRouteDecision } = useOperationalState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const severities = ['ALL', 'Critical', 'High', 'Medium', 'Low'];
  const categories = ['ALL', 'Safety', 'Weather', 'Terrain', 'Engineering', 'Logistics', 'Comms', 'Scientific'];

  const allAlerts = DEMO_ALERTS.map((alert) => {
    // Dynamically wire Dr. Vikram Nair's assistance alert status
    if (alert.id === 'ALT-SOS-01' && assistanceAlert) {
      return {
        ...alert,
        status: assistanceAlert.status === 'dispatched' ? 'Dispatched' : 'Active',
        description:
          assistanceAlert.status === 'dispatched'
            ? `Rescue Snowcat-02 dispatched (ETA ${assistanceAlert.eta}). Dr. Vikram Nair holding in emergency thermal shelter EP-03.`
            : assistanceAlert.situation,
      };
    }
    // Dynamically wire Route R-03 route decision
    if (alert.id === 'ALT-001' && assistanceAlert?.routeDecision) {
      return {
        ...alert,
        status: 'Action Taken',
        description:
          assistanceAlert.routeDecision === 'hold'
            ? '✓ Traverse held at Milepost 42 shelter pod. Waiting for storm decay.'
            : '✓ Traverse diverted via Southern Ridge Alt-2 (+14 km). Crevasse and zero-visibility zone bypassed.',
      };
    }
    return alert;
  });

  const filteredAlerts = allAlerts.filter((alert) => {
    const matchesSearch =
      alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.person && alert.person.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = selectedSeverity === 'ALL' || alert.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'ALL' || alert.category === selectedCategory;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const criticalCount = allAlerts.filter((a) => a.severity === 'Critical').length;
  const highCount = allAlerts.filter((a) => a.severity === 'High').length;
  const mediumCount = allAlerts.filter((a) => a.severity === 'Medium').length;

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
            CRITICAL
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
            HIGH PRIORITY
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
            LOW ADVISORY
          </span>
        );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Safety':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'Weather':
        return <CloudSun className="w-4 h-4 text-amber-600" />;
      case 'Terrain':
        return <Compass className="w-4 h-4 text-orange-600" />;
      case 'Engineering':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'Logistics':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'Comms':
        return <Radio className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Active Expedition Alerts & Incident Center</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time environmental hazards, field distress alerts, logistics bottlenecks, and infrastructure warnings.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-semibold animate-pulse">
            {criticalCount} Critical SOS
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
            {highCount} High Warning
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
            {mediumCount} Medium
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">Active Hazard Feed</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{allAlerts.length} Events</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Live sensor & report ingest</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">Emergency Status</div>
          <div className="text-2xl font-bold text-rose-700 mt-1">
            {assistanceAlert.status === 'dispatched' ? 'Rescue Active' : '1 SOS Active'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sector Echo Point R-03</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">Corridor Weather</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">Blizzard Gale</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Route R-03 sustained 68 km/h</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">Deterministic Solver</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">SOP Guard Active</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Human Commander Approval</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search alerts by incident title, location, description, or personnel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none"
            >
              {severities.map((s) => (
                <option key={s} value={s}>
                  Severity: {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isSos = alert.id === 'ALT-SOS-01';
          const isWeatherRoute = alert.id === 'ALT-001';

          return (
            <div
              key={alert.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition hover:shadow-md space-y-3 ${
                alert.severity === 'Critical'
                  ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/15'
                  : alert.severity === 'High'
                  ? 'border-amber-200'
                  : 'border-slate-200'
              }`}
            >
              {/* Alert Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    {getCategoryIcon(alert.category)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-slate-900 text-sm">{alert.type}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{alert.id}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="font-medium text-slate-700">{alert.location}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{alert.timestamp}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  {getSeverityBadge(alert.severity)}
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    alert.status === 'Active'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : alert.status === 'Resolved' || alert.status === 'Dispatched' || alert.status === 'Action Taken'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Alert Description */}
              <p className="text-xs text-slate-700 leading-relaxed">
                {alert.description}
              </p>

              {/* Actionable SOP Recommendation Box */}
              {alert.recommendedAction && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Recommended Polar Protocol
                    </span>
                    <span className="text-slate-800 font-medium">
                      {alert.recommendedAction}
                    </span>
                  </div>

                  {/* Contextual Interactive Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {/* SOS Action */}
                    {isSos && assistanceAlert.status === 'pending' && (
                      <button
                        onClick={() => dispatchRescue('Rescue Snowcat-02')}
                        className="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-medium rounded-lg text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Rescue Snowcat-02</span>
                      </button>
                    )}

                    {isSos && assistanceAlert.status === 'dispatched' && (
                      <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium rounded-lg text-xs flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>En Route (ETA {assistanceAlert.eta})</span>
                      </span>
                    )}

                    {/* Weather Route Action */}
                    {isWeatherRoute && (
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => setWeatherRouteDecision('hold')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            assistanceAlert?.routeDecision === 'hold'
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          Hold in Shelter
                        </button>
                        <button
                          onClick={() => setWeatherRouteDecision('reroute')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                            assistanceAlert?.routeDecision === 'reroute'
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          Divert via Alt-2
                        </button>
                      </div>
                    )}

                    <Link
                      to="/incidents"
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-medium rounded-lg text-xs transition flex items-center space-x-1"
                    >
                      <span>Simulate Impact</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
