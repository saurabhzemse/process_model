import React from 'react';
import { Layers, PlusCircle, CheckCircle, Clock, Timer, Target } from 'lucide-react';
import { MetricsData } from '../../types';

interface Props { metrics: MetricsData }

interface CardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const MetricCard: React.FC<CardProps> = ({ label, value, icon, color, bgColor, borderColor }) => (
  <div className="bg-white rounded-xl p-4 border-l-4 shadow-sm" style={{ borderLeftColor: borderColor }}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
      </div>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        {icon}
      </div>
    </div>
  </div>
);

export const MetricsCards: React.FC<Props> = ({ metrics }) => {
  const cards: CardProps[] = [
    {
      label: 'Total Processes',
      value: String(metrics.totalProcesses),
      icon: <Layers size={16} color="#2563EB" />,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#2563EB',
    },
    {
      label: 'New Requests',
      value: String(metrics.newRequests),
      icon: <PlusCircle size={16} color="#DB0011" />,
      color: '#DB0011',
      bgColor: '#FFF0F0',
      borderColor: '#DB0011',
    },
    {
      label: 'Closed',
      value: String(metrics.closedRequests),
      icon: <CheckCircle size={16} color="#059669" />,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#059669',
    },
    {
      label: 'Pending EOD',
      value: String(metrics.pendingEod),
      icon: <Clock size={16} color="#D97706" />,
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#D97706',
    },
    {
      label: 'Avg TAT',
      value: `${metrics.tatDays.toFixed(1)}d`,
      icon: <Timer size={16} color="#7C3AED" />,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#7C3AED',
    },
    {
      label: 'ATT %',
      value: `${metrics.attPercentage.toFixed(1)}%`,
      icon: <Target size={16} color="#DB0011" />,
      color:
        metrics.attPercentage >= 90
          ? '#059669'
          : metrics.attPercentage >= 70
          ? '#D97706'
          : '#DB0011',
      bgColor: '#FFF0F0',
      borderColor: '#DB0011',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map(card => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
};
