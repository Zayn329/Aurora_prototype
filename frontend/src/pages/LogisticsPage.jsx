import React, { useState } from 'react';
import { useOperationalState } from '../context/OperationalStateContext';
import { DEMO_LOGISTICS } from '../data/expeditionData';
import {
  Package,
  Truck,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Scale,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import CargoFlow from '../components/CargoFlow';
import { useNavigate } from 'react-router-dom';

export default function LogisticsPage() {
  const { cargoList: contextCargo, loading } = useOperationalState();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCargoFlow, setSelectedCargoFlow] = useState(null);
  const navigate = useNavigate();

  // Combine live operational context with rich 38-item demo dataset, prioritizing live context updates
  const combinedCargo = React.useMemo(() => {
    const liveMap = new Map((contextCargo || []).map((c) => [c.id, c]));
    const list = [...(contextCargo || [])];
    DEMO_LOGISTICS.forEach((item) => {
      if (!liveMap.has(item.id)) {
        list.push(item);
      }
    });
    return list;
  }, [contextCargo]);

  if (loading && combinedCargo.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500 text-sm space-x-2">
        <div className="animate-spin h-4 w-4 border-2 border-sky-600 border-t-transparent rounded-full"></div>
        <span>Loading cargo manifest...</span>
      </div>
    );
  }

  const filteredCargo = cargoList.filter((c) => {
    // The API uses `item_name`; keep `name` as a fallback for older local replicas.
    const itemName = c.item_name ?? c.name ?? '';
    const searchableText = `${itemName} ${c.id ?? ''}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalWeightKg = combinedCargo.reduce((acc, curr) => acc + (Number(curr.weight_kg) || 0), 0);
  const deliveredCount = combinedCargo.filter((c) => (c.status || '').toUpperCase() === 'DELIVERED').length;
  const inTransitCount = combinedCargo.filter((c) => (c.status || '').toUpperCase().includes('TRANSIT')).length;
  const delayedCount = combinedCargo.filter((c) => (c.status || '').toUpperCase() === 'DELAYED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Expedition Logistics & Cargo Manifest</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Polar fuel drums, scientific drill spares, survival rations, medical caches, and cold-weather batteries.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            {deliveredCount} Delivered
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
            {inTransitCount} In Transit
          </span>
          {delayedCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              {delayedCount} Delayed
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">Total Tracked Consignments</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{combinedCargo.length} Waybills</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Maritime & Traverse lines</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">Gross Manifest Weight</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{(totalWeightKg / 1000).toFixed(1)} Tonnes</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{totalWeightKg.toLocaleString()} kg payload</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">Fuel Reserve Allocation</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">8,200 L</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Polar Grade Diesel & Kerosene</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-slate-400 font-medium uppercase text-[10px] tracking-wider">Supply Chain Health</div>
          <div className="text-2xl font-bold text-sky-700 mt-1">
            {(((combinedCargo.length - delayedCount) / combinedCargo.length) * 100).toFixed(0)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Deterministic solver monitoring</div>
        </div>
      </div>

      {/* Cargo Flow Pipeline Section (if item selected) */}
      {selectedCargoFlow && <CargoFlow item={selectedCargoFlow} />}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cargo by item name, ID, or destination station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="FUEL">Fuel</option>
            <option value="TECHNICAL">Technical</option>
            <option value="RATIONS">Rations</option>
            <option value="MEDICAL">Medical</option>
            <option value="SURVIVAL">Survival</option>
          </select>
        </div>
      </div>

      {/* Cargo Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCargo.map((item) => {
              const itemName = item.item_name ?? item.name ?? item.id ?? 'Unnamed cargo';
              const quantity = item.quantity ?? item.weight_kg;
              const quantityLabel = quantity == null
                ? '—'
                : `${quantity}${item.unit ? ` ${item.unit}` : ' kg'}`;

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span>{itemName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">{item.category}</td>
                <td className="py-3 px-4 text-slate-600">{quantityLabel}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-medium border ${
                      item.status === 'DELAYED'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : item.status === 'DELIVERED'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedCargoFlow(item)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-sky-50 hover:bg-sky-100 text-sky-800 rounded border border-sky-200 transition"
                  >
                    Track Flow
                  </button>
                  <button
                    onClick={() => navigate(`/incidents?cargoId=${item.id}`)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 transition"
                  >
                    Simulate Delay
                  </button>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
