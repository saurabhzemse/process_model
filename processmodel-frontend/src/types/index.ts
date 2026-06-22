export interface NodeMetrics {
  totalProcesses: number;
  newRequests: number;
  closedRequests: number;
  pendingEod: number;
  tatDays: number;
  attPercentage: number;
}

export interface HierarchyNode {
  id: number;
  name: string;
  code: string;
  description: string;
  level: 'JOURNEY' | 'BUSINESS_PROCESS' | 'SUB_BUSINESS_PROCESS' | 'PROCESS';
  parentId: number | null;
  childCount: number;
  metrics: NodeMetrics;
}

export interface BpBreakdown {
  name: string;
  newCount: number;
  closedCount: number;
  inProgressCount: number;
}

export interface MarketRanking {
  rank: number;
  marketName: string;
  marketCode: string;
  slaAdherencePercentage: number;
  totalRequests: number;
  closedRequests: number;
}

export interface MetricsData {
  nodeId: number;
  nodeName: string;
  nodeType: string;
  totalProcesses: number;
  newRequests: number;
  inProgressRequests: number;
  pendingRequests: number;
  closedRequests: number;
  rejectedRequests: number;
  pendingEod: number;
  tatDays: number;
  attPercentage: number;
  businessProcessBreakdown: BpBreakdown[];
  topMarkets: MarketRanking[];
}

export type NodeLevel = 'JOURNEY' | 'BUSINESS_PROCESS' | 'SUB_BUSINESS_PROCESS' | 'PROCESS';

export interface BreadcrumbItem {
  id: number;
  name: string;
  level: NodeLevel;
}
