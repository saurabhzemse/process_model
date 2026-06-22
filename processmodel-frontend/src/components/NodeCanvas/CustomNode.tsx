import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ChevronRight, CheckCircle, AlertCircle, Clock, TrendingUp, ChevronDown } from 'lucide-react';
import { HierarchyNode } from '../../types';

interface CustomNodeData {
  node: HierarchyNode;
  onClick: (node: HierarchyNode) => void;
  isExpanded: boolean;
  isSelected: boolean;
  isHighlighted?: boolean;
}

const levelConfig = {
  JOURNEY: {
    accent: '#DB0011',
    glow: 'rgba(219,0,17,0.35)',
    badge: 'Journey',
    badgeBg: 'rgba(219,0,17,0.15)',
    badgeText: '#FF4D5E',
  },
  BUSINESS_PROCESS: {
    accent: '#2563EB',
    glow: 'rgba(37,99,235,0.3)',
    badge: 'Business Process',
    badgeBg: 'rgba(37,99,235,0.15)',
    badgeText: '#60A5FA',
  },
  SUB_BUSINESS_PROCESS: {
    accent: '#059669',
    glow: 'rgba(5,150,105,0.3)',
    badge: 'Sub Process',
    badgeBg: 'rgba(5,150,105,0.15)',
    badgeText: '#34D399',
  },
  PROCESS: {
    accent: '#7C3AED',
    glow: 'rgba(124,58,237,0.3)',
    badge: 'Process',
    badgeBg: 'rgba(124,58,237,0.15)',
    badgeText: '#A78BFA',
  },
};

export const CustomNode: React.FC<NodeProps> = ({ data }) => {
  const { node, onClick, isExpanded, isSelected, isHighlighted = true } = data as unknown as CustomNodeData;
  const cfg = levelConfig[node.level];
  const m = node.metrics;
  const hasChildren = node.childCount > 0;

  return (
    <>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />

      <div
        onClick={() => onClick(node)}
        style={{
          width: 232,
          opacity: isHighlighted ? 1 : 0.3,
          background: 'linear-gradient(145deg, #161B27 0%, #111827 100%)',
          border: `1px solid ${isSelected ? cfg.accent : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 14,
          boxShadow: isSelected
            ? `0 0 0 2px ${cfg.accent}, 0 8px 32px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.5)`
            : `0 4px 20px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)`,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          overflow: 'hidden',
          position: 'relative',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.border = `1px solid ${cfg.accent}`;
          el.style.boxShadow = `0 0 0 1px ${cfg.accent}40, 0 8px 28px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.5)`;
          el.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.border = `1px solid ${isSelected ? cfg.accent : 'rgba(255,255,255,0.08)'}`;
          el.style.boxShadow = isSelected
            ? `0 0 0 2px ${cfg.accent}, 0 8px 32px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.5)`
            : `0 4px 20px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)`;
          el.style.transform = 'translateY(0)';
        }}
      >
        {/* Top glow line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)` }} />

        {/* Header */}
        <div style={{ padding: '10px 12px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px',
              borderRadius: 20, letterSpacing: '0.04em',
              background: cfg.badgeBg, color: cfg.badgeText,
              border: `1px solid ${cfg.accent}30`,
            }}>
              {cfg.badge}
            </span>
            {hasChildren && (
              <div style={{
                width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                background: isExpanded ? `${cfg.accent}20` : cfg.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isExpanded
                  ? <ChevronDown size={11} color={cfg.accent} />
                  : <ChevronRight size={11} color="#fff" />
                }
              </div>
            )}
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9', lineHeight: 1.3, marginBottom: 3 }}>
            {node.name}
          </div>
          <div style={{ fontSize: 10, color: '#4B5563', fontFamily: 'monospace' }}>{node.code}</div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 12px' }} />

        {/* Metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, padding: '8px 12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <AlertCircle size={9} color="#60A5FA" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#60A5FA' }}>{m?.newRequests ?? 0}</span>
            </div>
            <div style={{ fontSize: 9, color: '#4B5563', marginTop: 2 }}>New</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <CheckCircle size={9} color="#34D399" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>{m?.closedRequests ?? 0}</span>
            </div>
            <div style={{ fontSize: 9, color: '#4B5563', marginTop: 2 }}>Closed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <Clock size={9} color="#FBBF24" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#FBBF24' }}>{m?.pendingEod ?? 0}</span>
            </div>
            <div style={{ fontSize: 9, color: '#4B5563', marginTop: 2 }}>EOD</div>
          </div>
        </div>

        {/* ATT bar */}
        <div style={{ padding: '0 12px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <TrendingUp size={9} color="#6B7280" />
              <span style={{ fontSize: 9, color: '#6B7280' }}>ATT</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: cfg.accent }}>
              {m?.attPercentage?.toFixed(1) ?? '0.0'}%
            </span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${m?.attPercentage ?? 0}%`,
              background: `linear-gradient(90deg, ${cfg.accent}99, ${cfg.accent})`,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 9, color: '#374151' }}>TAT: {m?.tatDays?.toFixed(1) ?? '0.0'}d</span>
            {hasChildren && (
              <span style={{ fontSize: 9, color: '#374151' }}>{node.childCount} items</span>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 1, height: 1 }} />
    </>
  );
};
