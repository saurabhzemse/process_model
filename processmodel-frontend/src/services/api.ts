import axios from 'axios';
import { HierarchyNode, MetricsData } from '../types';

const api = axios.create({ baseURL: '/api' });

export const getJourneys = (): Promise<HierarchyNode[]> =>
  api.get('/hierarchy/journeys').then(r => r.data);

export const getBusinessProcesses = (journeyId: number): Promise<HierarchyNode[]> =>
  api.get(`/hierarchy/journeys/${journeyId}/business-processes`).then(r => r.data);

export const getSubProcesses = (bpId: number): Promise<HierarchyNode[]> =>
  api.get(`/hierarchy/business-processes/${bpId}/sub-processes`).then(r => r.data);

export const getProcesses = (subBpId: number): Promise<HierarchyNode[]> =>
  api.get(`/hierarchy/sub-processes/${subBpId}/processes`).then(r => r.data);

export const getMetrics = (nodeType: string, nodeId: number): Promise<MetricsData> =>
  api.get('/metrics', { params: { nodeType, nodeId } }).then(r => r.data);
