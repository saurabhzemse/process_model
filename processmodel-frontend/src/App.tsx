import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { NodeCanvas } from './components/NodeCanvas/NodeCanvas';
import { ExecutivePanel } from './components/ExecutivePanel/ExecutivePanel';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { HierarchyNode, MetricsData, ActiveFilters, FilterOptions } from './types';
import {
  getJourneys,
  getBusinessProcesses,
  getSubProcesses,
  getProcesses,
  getMetrics,
  getFilterOptions,
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

  // Filter state
  const [filters, setFilters] = useState<ActiveFilters>({
    regions: [],
    countries: [],
    journeyIds: [],
    lob: '',
    siteIds: [],
    processName: '',
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Compute active filter count
  const activeFilterCount =
    filters.regions.length +
    filters.countries.length +
    filters.journeyIds.length +
    (filters.lob ? 1 : 0) +
    filters.siteIds.length +
    (filters.processName ? 1 : 0);

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

    // Fetch filter options on mount (non-blocking)
    getFilterOptions()
      .then(setFilterOptions)
      .catch(() => {
        // Filter options are optional - silently fail so main app still works
        console.warn('Could not load filter options from /api/filters');
      });
  }, []);

  const fetchMetrics = useCallback(async (node: HierarchyNode, activeFilters?: ActiveFilters) => {
    setIsMetricsLoading(true);
    setMetricsData(null);
    try {
      const data = await getMetrics(node.level, node.id, activeFilters);
      setMetricsData(data);
    } catch {
      console.error('Failed to load metrics');
    } finally {
      setIsMetricsLoading(false);
    }
  }, []);

  // Re-fetch metrics when filters change and a node is selected
  useEffect(() => {
    if (selectedNode) {
      fetchMetrics(selectedNode, filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleNodeClick = useCallback(
    async (node: HierarchyNode) => {
      setSelectedNode(node);
      setIsPanelOpen(true);
      fetchMetrics(node, filters);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expandedIds, fetchMetrics, filters]
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

  // Compute highlighted state per node based on processName filter
  const nodesWithHighlight = graphNodes.map(n => ({
    ...n,
    isHighlighted:
      !filters.processName ||
      n.name.toLowerCase().includes(filters.processName.toLowerCase()) ||
      n.code.toLowerCase().includes(filters.processName.toLowerCase()),
  }));

  // Filter journey-level nodes by journeyIds filter
  const visibleNodes = nodesWithHighlight.filter(n => {
    if (filters.journeyIds.length > 0 && n.level === 'JOURNEY') {
      return filters.journeyIds.includes(n.id);
    }
    return true;
  });

  // Derive visible edges (only include edges where both endpoints are visible)
  const visibleNodeKeys = new Set(visibleNodes.map(n => `${n.level}-${n.id}`));
  const visibleEdges = graphEdges.filter(
    e => visibleNodeKeys.has(e.sourceId) && visibleNodeKeys.has(e.targetId)
  );

  return (
    <div className="flex flex-col h-screen bg-[#0D1117] overflow-hidden">
      <Header onReset={handleReset} />

      {error && (
        <div className="mx-4 mt-3 px-4 py-3 bg-red-900/40 border border-red-500/50 rounded-lg text-sm text-red-300 font-medium flex-shrink-0">
          {error}
        </div>
      )}

      <main className="flex flex-1 overflow-hidden">
        <FilterPanel
          options={filterOptions}
          filters={filters}
          onChange={setFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(v => !v)}
          activeCount={activeFilterCount}
        />
        <NodeCanvas
          nodes={visibleNodes}
          edges={visibleEdges}
          expandedIds={expandedIds}
          selectedNodeKey={selectedNode ? `${selectedNode.level}-${selectedNode.id}` : null}
          onNodeClick={handleNodeClick}
          isLoading={isLoading}
          filters={filters}
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
