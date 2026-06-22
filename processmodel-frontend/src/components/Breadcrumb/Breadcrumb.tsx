import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem, NodeLevel } from '../../types';

interface Props {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (item: BreadcrumbItem | null) => void;
}

const levelLabel: Record<NodeLevel, string> = {
  JOURNEY: 'Journey',
  BUSINESS_PROCESS: 'Business Process',
  SUB_BUSINESS_PROCESS: 'Sub Process',
  PROCESS: 'Process',
};

const levelColors: Record<NodeLevel, string> = {
  JOURNEY: 'bg-red-50 text-[#DB0011] border-red-200',
  BUSINESS_PROCESS: 'bg-gray-100 text-gray-700 border-gray-200',
  SUB_BUSINESS_PROCESS: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESS: 'bg-green-50 text-green-700 border-green-200',
};

export const Breadcrumb: React.FC<Props> = ({ breadcrumbs, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1.5 px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-[#DB0011] transition-colors duration-150 text-sm font-medium"
      >
        <Home size={14} />
        <span>All Journeys</span>
      </button>

      {breadcrumbs.map((item, index) => (
        <React.Fragment key={`${item.level}-${item.id}`}>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${levelColors[item.level]}`}>
              {levelLabel[item.level]}
            </span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-900 text-sm font-semibold">{item.name}</span>
            ) : (
              <button
                onClick={() => onNavigate(item)}
                className="text-[#DB0011] text-sm font-medium hover:underline hover:text-[#9B0000] transition-colors"
              >
                {item.name}
              </button>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};
