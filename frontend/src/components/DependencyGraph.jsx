import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useOperationalState } from '../context/OperationalStateContext';
import { GitBranch, Box, Compass, AlertCircle } from 'lucide-react';

export default function DependencyGraph({ impactSet }) {
  const { missions, cargoList } = useOperationalState();

  const directlyImpactedIds = useMemo(() => impactSet?.directly_impacted_mission_ids || [], [impactSet]);
  const transitivelyImpactedIds = useMemo(() => impactSet?.transitively_impacted_mission_ids || [], [impactSet]);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Layout configuration
    let yPosCargo = 50;
    let yPosMission = 50;

    // Render Cargo nodes (Left Column X=50)
    cargoList.forEach((c) => {
      nodes.push({
        id: `cargo-${c.id}`,
        type: 'default',
        data: {
          label: (
            <div className="flex items-center space-x-2 text-xs font-sans p-1">
              <Box className="h-4 w-4 text-slate-500 shrink-0" />
              <div>
                <div className="font-semibold text-slate-800">{c.name}</div>
                <div className="text-[10px] text-slate-500">{c.category} &bull; {c.status}</div>
              </div>
            </div>
          ),
        },
        position: { x: 50, y: yPosCargo },
        style: {
          background: c.status === 'DELAYED' ? '#fef3c7' : '#ffffff',
          borderColor: c.status === 'DELAYED' ? '#f59e0b' : '#cbd5e1',
          borderWidth: 2,
          borderRadius: 8,
          width: 220,
        },
      });
      yPosCargo += 100;
    });

    // Render Mission nodes (Right Column X=400)
    missions.forEach((m) => {
      const isDirect = directlyImpactedIds.includes(m.id);
      const isTransitive = transitivelyImpactedIds.includes(m.id);

      nodes.push({
        id: `mission-${m.id}`,
        type: 'default',
        data: {
          label: (
            <div className="flex items-center space-x-2 text-xs font-sans p-1">
              <Compass className="h-4 w-4 text-sky-600 shrink-0" />
              <div>
                <div className="font-semibold text-slate-900">{m.name}</div>
                <div className="text-[10px] text-slate-500">Day {m.start_day}-{m.end_day}</div>
              </div>
            </div>
          ),
        },
        position: { x: 420, y: yPosMission },
        style: {
          background: isDirect ? '#ffe4e6' : isTransitive ? '#fef3c7' : '#ffffff',
          borderColor: isDirect ? '#e11d48' : isTransitive ? '#f59e0b' : '#cbd5e1',
          borderWidth: 2,
          borderRadius: 8,
          width: 220,
        },
      });

      // Link Cargo -> Mission edges if associated
      cargoList.forEach((c) => {
        if (c.mission_id === m.id || c.destination_station_id === m.station_id) {
          edges.push({
            id: `e-cargo-${c.id}-mission-${m.id}`,
            source: `cargo-${c.id}`,
            target: `mission-${m.id}`,
            animated: isDirect || isTransitive,
            style: {
              stroke: isDirect ? '#e11d48' : isTransitive ? '#f59e0b' : '#94a3b8',
              strokeWidth: isDirect || isTransitive ? 2.5 : 1.5,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isDirect ? '#e11d48' : isTransitive ? '#f59e0b' : '#94a3b8',
            },
          });
        }
      });

      yPosMission += 110;
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [missions, cargoList, directlyImpactedIds, transitivelyImpactedIds]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h4 className="text-xs font-semibold text-slate-800 flex items-center space-x-2">
          <GitBranch className="h-4 w-4 text-sky-600" />
          <span>Interactive Operational Dependency Chain</span>
        </h4>
        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
            <span>Normal</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span>Delayed / Warning</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
            <span>Critical Disruption</span>
          </span>
        </div>
      </div>

      <div className="h-[400px] border border-slate-100 rounded-md bg-slate-50/50">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
        >
          <Background color="#cbd5e1" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
