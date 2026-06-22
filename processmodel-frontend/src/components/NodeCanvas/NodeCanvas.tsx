import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  Panel,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './CustomNode';
import { HierarchyNode, ActiveFilters } from '../../types';
import { GraphEdge } from '../../App';
import { RotateCcw } from 'lucide-react';

interface Props {
  nodes: HierarchyNode[];
  edges: GraphEdge[];
  expandedIds: Set<string>;
  selectedNodeKey: string | null;
  onNodeClick: (node: HierarchyNode) => void;
  isLoading: boolean;
  filters?: ActiveFilters;
}

const nodeTypes = { custom: CustomNode };

const NODE_W = 232;
const NODE_H = 170;

function applyDagreLayout(flowNodes: Node[], flowEdges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 48, marginx: 40, marginy: 40 });

  flowNodes.forEach(n => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  flowEdges.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);

  return flowNodes.map(n => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
  });
}

const levelColor: Record<string, string> = {
  JOURNEY: '#DB0011',
  BUSINESS_PROCESS: '#2563EB',
  SUB_BUSINESS_PROCESS: '#059669',
  PROCESS: '#7C3AED',
};

const FlowInner: React.FC<Props> = ({
  nodes,
  edges,
  expandedIds,
  selectedNodeKey,
  onNodeClick,
  isLoading,
  filters,
}) => {
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState<Node>([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();

  const builtEdges = useMemo<Edge[]>(() =>
    edges.map(e => ({
      id: `e-${e.sourceId}-${e.targetId}`,
      source: e.sourceId,
      target: e.targetId,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#DB0011', strokeWidth: 1.5, opacity: 0.7 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#DB0011', width: 14, height: 14 },
    })),
    [edges]
  );

  useEffect(() => {
    if (nodes.length === 0) return;

    const processName = filters?.processName ?? '';
    const rawNodes: Node[] = nodes.map(n => ({
      id: `${n.level}-${n.id}`,
      type: 'custom',
      position: { x: 0, y: 0 },
      data: {
        node: n,
        onClick: onNodeClick,
        isExpanded: expandedIds.has(`${n.level}-${n.id}`),
        isSelected: `${n.level}-${n.id}` === selectedNodeKey,
        isHighlighted:
          !processName ||
          n.name.toLowerCase().includes(processName.toLowerCase()) ||
          n.code.toLowerCase().includes(processName.toLowerCase()),
      },
    }));

    const laid = applyDagreLayout(rawNodes, builtEdges);
    setFlowNodes(laid);
    setFlowEdges(builtEdges);
    setTimeout(() => fitView({ padding: 0.15, duration: 500 }), 60);
  }, [nodes, builtEdges, expandedIds, selectedNodeKey, onNodeClick, fitView, filters]);

  if (isLoading && nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0D1117]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#DB0011] border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm">Loading process graph...</p>
        </div>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={flowNodes}
      edges={flowEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.2}
      maxZoom={2.5}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={true}
      elementsSelectable={false}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={28}
        size={1.2}
        color="#1E2937"
      />
      <Controls
        showInteractive={false}
        style={{ background: '#1A2233', border: '1px solid #2D3748', borderRadius: 8 }}
      />
      <MiniMap
        nodeColor={n => {
          const level = (n.id as string).split('-')[0] + (n.id as string).includes('_') ? n.id.split('-').slice(0,-1).join('_').replace(/^\w+-/, '') : '';
          const parts = (n.id as string).split('-');
          const lvl = parts.slice(0, parts.length - 1).join('_').toUpperCase() ||
                      parts[0].toUpperCase();
          return levelColor[lvl] ?? '#DB0011';
        }}
        style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 8 }}
        maskColor="rgba(0,0,0,0.6)"
      />
      <Panel position="top-left">
        <div className="flex gap-3 items-center ml-2 mt-2">
          {Object.entries({ JOURNEY: 'Journey', BUSINESS_PROCESS: 'Business Process', SUB_BUSINESS_PROCESS: 'Sub Process', PROCESS: 'Process' }).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: levelColor[key] }} />
              <span className="text-gray-400 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </Panel>
    </ReactFlow>
  );
};

export const NodeCanvas: React.FC<Props> = (props) => (
  <ReactFlowProvider>
    <div className="flex-1 relative overflow-hidden">
      <FlowInner {...props} />
    </div>
  </ReactFlowProvider>
);
