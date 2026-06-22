import React from 'react';
import { X, BarChart3 } from 'lucide-react';
import { MetricsData, HierarchyNode, NodeLevel } from '../../types';
import { MetricsCards } from './MetricsCards';
import { NewClosedChart } from './NewClosedChart';
import { MarketRanking } from './MarketRanking';

interface Props {
  metrics: MetricsData | null;
  node: HierarchyNode | null;
  onClose: () => void;
  isLoading: boolean;
}

const levelLabel: Record<NodeLevel, string> = {
  JOURNEY: 'Journey',
  BUSINESS_PROCESS: 'Business Process',
  SUB_BUSINESS_PROCESS: 'Sub Process',
  PROCESS: 'Process',
};

const levelBadge: Record<NodeLevel, string> = {
  JOURNEY: 'bg-red-50 text-[#DB0011] border-red-200',
  BUSINESS_PROCESS: 'bg-gray-100 text-gray-700 border-gray-200',
  SUB_BUSINESS_PROCESS: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESS: 'bg-green-50 text-green-700 border-green-200',
};

export const ExecutivePanel: React.FC<Props> = ({ metrics, node, onClose, isLoading }) => {
  return (
    <div
      className="w-[480px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col animate-slide-in"
      style={{ boxShadow: '-4px 0 24px rgba(0,0,0,0.08)' }}
    >
      {/* Panel Header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={14} className="text-[#DB0011]" />
              <span className="text-xs text-[#DB0011] font-semibold uppercase tracking-widest">
                Executive View
              </span>
            </div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">{node?.name ?? ''}</h2>
            {node && (
              <span
                className={`inline-flex mt-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${levelBadge[node.level]}`}
              >
                {levelLabel[node.level]}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-gray-600" />
          </button>
        </div>
        {/* Red accent bar under header */}
        <div className="mt-3 h-0.5 bg-gradient-to-r from-[#DB0011] to-transparent rounded-full" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-5 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : metrics ? (
          <div className="p-5 space-y-6">
            {/* Status summary bar */}
            <div className="flex gap-2 text-xs">
              {[
                { label: 'NEW', value: metrics.newRequests, color: '#2563EB', bg: '#EFF6FF' },
                { label: 'IN PROG', value: metrics.inProgressRequests, color: '#7C3AED', bg: '#F5F3FF' },
                { label: 'PENDING', value: metrics.pendingRequests, color: '#D97706', bg: '#FFFBEB' },
                { label: 'CLOSED', value: metrics.closedRequests, color: '#059669', bg: '#ECFDF5' },
                { label: 'REJECTED', value: metrics.rejectedRequests, color: '#DB0011', bg: '#FFF0F0' },
              ].map(s => (
                <div
                  key={s.label}
                  className="flex-1 text-center rounded-lg py-2 px-1"
                  style={{ backgroundColor: s.bg }}
                >
                  <div className="font-bold text-sm" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-gray-500 text-[9px] font-semibold tracking-wide mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* 6 metric cards */}
            <MetricsCards metrics={metrics} />

            {/* Section divider */}
            <div className="border-t border-gray-100" />

            {/* Bar chart */}
            {metrics.businessProcessBreakdown.length > 0 && (
              <NewClosedChart data={metrics.businessProcessBreakdown} />
            )}

            {/* Divider */}
            {metrics.topMarkets.length > 0 && <div className="border-t border-gray-100" />}

            {/* Market ranking */}
            {metrics.topMarkets.length > 0 && (
              <MarketRanking markets={metrics.topMarkets} />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
