import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { NodeCanvas } from './components/NodeCanvas/NodeCanvas';
import { ExecutivePanel } from './components/ExecutivePanel/ExecutivePanel';
import { HierarchyNode, MetricsData } from './types';
import {
  getJourneys,
  getBusinessProcesses,
  getSubProcesses,
  getProcesses,
  getMetrics,
} from './services/api';

export interface GraphEdge {
  sourceId: string;
  targetId: string;
}

export default function App() {
  const [graphNodes, setGraphNodes] = useState<HierarchyNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<HierarchyNode | null>(null);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const journeys = await getJourneys();
        setGraphNodes(journeys);
        setGraphEdges([]);
        setExpandedIds(new Set());
      } catch {
        setError('Failed to load journeys. Please ensure the backend is running on port 8080.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchMetrics = useCallback(async (node: HierarchyNode) => {
    setIsMetricsLoading(true);
    setMetricsData(null);
    try {
      const data = await getMetrics(node.level, node.id);
      setMetricsData(data);
    } catch {
      console.error('Failed to load metrics');
    } finally {
      setIsMetricsLoading(false);
    }
  }, []);

  const handleNodeClick = useCallback(
    async (node: HierarchyNode) => {
      setSelectedNode(node);
      setIsPanelOpen(true);
      fetchMetrics(node);

      const nodeKey = `${node.level}-${node.id}`;
      if (expandedIds.has(nodeKey) || node.childCount === 0) return;

      try {
        let children: HierarchyNode[] = [];
        if (node.level === 'JOURNEY') children = await getBusinessProcesses(node.id);
        else if (node.level === 'BUSINESS_PROCESS') children = await getSubProcesses(node.id);
        else if (node.level === 'SUB_BUSINESS_PROCESS') children = await getProcesses(node.id);
        else return;

        setGraphNodes(prev => {
          const existingIds = new Set(prev.map(n => `${n.level}-${n.id}`));
          const newOnes = children.filter(c => !existingIds.has(`${c.level}-${c.id}`));
          return [...prev, ...newOnes];
        });

        setGraphEdges(prev => [
          ...prev,
          ...children.map(child => ({
            sourceId: `${node.level}-${node.id}`,
            targetId: `${child.level}-${child.id}`,
          })),
        ]);

        setExpandedIds(prev => new Set([...prev, nodeKey]));
      } catch {
        setError('Failed to load child nodes.');
      }
    },
    [expandedIds, fetchMetrics]
  );

  const handleReset = useCallback(async () => {
    setIsPanelOpen(false);
    setSelectedNode(null);
    setIsLoading(true);
    setError(null);
    try {
      const journeys = await getJourneys();
      setGraphNodes(journeys);
      setGraphEdges([]);
      setExpandedIds(new Set());
    } catch {
      setError('Failed to reload.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0D1117] overflow-hidden">
      <Header onReset={handleReset} />

      {error && (
        <div className="mx-4 mt-3 px-4 py-3 bg-red-900/40 border border-red-500/50 rounded-lg text-sm text-red-300 font-medium flex-shrink-0">
          {error}
        </div>
      )}

      <main className="flex flex-1 overflow-hidden">
        <NodeCanvas
          nodes={graphNodes}
          edges={graphEdges}
          expandedIds={expandedIds}
          selectedNodeKey={selectedNode ? `${selectedNode.level}-${selectedNode.id}` : null}
          onNodeClick={handleNodeClick}
          isLoading={isLoading}
        />
        {isPanelOpen && (
          <ExecutivePanel
            metrics={metricsData}
            node={selectedNode}
            onClose={() => setIsPanelOpen(false)}
            isLoading={isMetricsLoading}
          />
        )}
      </main>
    </div>
  );
}
