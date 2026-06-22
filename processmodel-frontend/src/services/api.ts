import axios from 'axios';
import { HierarchyNode, MetricsData, FilterOptions, ActiveFilters } from '../types';

const api = axios.create({ baseURL: '/api' });

export const getJourneys = (): Promise<HierarchyNode[]> =>
  api.get('/hierarchy/journeys').then(r => r.data);

export const getBusinessProcesses = (journeyId: number): Promise<HierarchyNode[]> =>
  api.get(`/hierarchy/journeys/${journeyId}/business-processes`).then(r => r.data);

export const getSubProcesses = (bpId: number): Promise<HierarchyNode[]> =>
  api.get(`/hierarchy/business-processes/${bpId}/sub-processes`).then(r => r.data);

export const getProcesses = (subBpId: number): Promise<HierarchyNode[]> =>
  api.get(`/hierarchy/sub-processes/${subBpId}/processes`).then(r => r.data);

export const getMetrics = (
  nodeType: string,
  nodeId: number,
  filters?: ActiveFilters
): Promise<MetricsData> => {
  const params: Record<string, unknown> = { nodeType, nodeId };
  if (filters) {
    if (filters.regions.length) params['regions'] = filters.regions;
    if (filters.countries.length) params['countries'] = filters.countries;
    if (filters.siteIds.length) params['siteIds'] = filters.siteIds;
    if (filters.lob) params['lob'] = filters.lob;
  }
  return api.get('/metrics', { params }).then(r => r.data);
};

export const getFilterOptions = (): Promise<FilterOptions> =>
  api.get('/filters').then(r => r.data);
