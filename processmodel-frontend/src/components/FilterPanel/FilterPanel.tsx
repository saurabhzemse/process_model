import React, { useState, useCallback } from 'react';
import {
  SlidersHorizontal, X, ChevronDown, ChevronRight,
  Globe, MapPin, Landmark, Building2, Network, Search, RotateCcw
} from 'lucide-react';
import { FilterOptions, ActiveFilters } from '../../types';

interface Props {
  options: FilterOptions | null;
  filters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
  activeCount: number;
}

// Collapsible section wrapper
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-gray-400">{icon}</span>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">{title}</span>
        </div>
        {open ? <ChevronDown size={13} className="text-gray-500" /> : <ChevronRight size={13} className="text-gray-500" />}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
};

// Checkbox item
const CheckItem: React.FC<{
  label: string;
  sub?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ label, sub, checked, onChange }) => (
  <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
    <div
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
        checked
          ? 'bg-[#DB0011] border-[#DB0011]'
          : 'border-gray-600 group-hover:border-gray-400'
      }`}
    >
      {checked && (
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
    <div className="min-w-0">
      <span className="text-xs text-gray-300 group-hover:text-white transition-colors block truncate">{label}</span>
      {sub && <span className="text-[10px] text-gray-500">{sub}</span>}
    </div>
  </label>
);

// Radio item
const RadioItem: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group" onClick={onChange}>
    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border transition-all ${
      checked ? 'border-[#DB0011]' : 'border-gray-600 group-hover:border-gray-400'
    }`}>
      {checked && <div className="w-2 h-2 rounded-full bg-[#DB0011]" />}
    </div>
    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">{label}</span>
  </label>
);

export const FilterPanel: React.FC<Props> = ({
  options, filters, onChange, isOpen, onToggle, activeCount
}) => {
  const toggle = useCallback(<T,>(list: T[], item: T): T[] =>
    list.includes(item) ? list.filter(x => x !== item) : [...list, item]
  , []);

  const updateField = <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) =>
    onChange({ ...filters, [key]: value });

  // Filter sites by selected countries/regions
  const visibleSites = options?.sites.filter(s => {
    if (filters.regions.length && !filters.regions.includes(s.region)) return false;
    if (filters.countries.length && !filters.countries.includes(s.countryCode)) return false;
    return true;
  }) ?? [];

  // Filter countries by selected regions
  const visibleCountries = options?.countries.filter(c =>
    !filters.regions.length || filters.regions.includes(c.region)
  ) ?? [];

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className="flex-shrink-0 flex flex-col items-center justify-start pt-4 w-10 bg-[#111827] border-r border-white/5 hover:bg-white/5 transition-colors relative"
        title={isOpen ? 'Close Filters' : 'Open Filters'}
      >
        <SlidersHorizontal size={16} className="text-gray-400" />
        {activeCount > 0 && (
          <span className="absolute top-2 right-1 w-4 h-4 rounded-full bg-[#DB0011] text-white text-[9px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="flex-shrink-0 flex flex-col bg-[#0D1117] border-r border-white/5 overflow-hidden"
          style={{ width: 260 }}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-[#DB0011]" />
              <span className="text-sm font-semibold text-white">Filters</span>
              {activeCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DB0011]/20 text-[#FF4D5E]">
                  {activeCount} active
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {activeCount > 0 && (
                <button
                  onClick={() => onChange({
                    regions: [], countries: [], journeyIds: [],
                    lob: '', siteIds: [], processName: ''
                  })}
                  className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
                  title="Clear all filters"
                >
                  <RotateCcw size={12} />
                </button>
              )}
              <button onClick={onToggle} className="p-1.5 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Scrollable filter content */}
          <div className="flex-1 overflow-y-auto">
            {options ? (
              <>
                {/* Process Name Search */}
                <Section title="Process Name" icon={<Search size={13} />} defaultOpen={true}>
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={filters.processName}
                      onChange={e => updateField('processName', e.target.value)}
                      placeholder="Search process..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#DB0011]/50 transition-colors"
                    />
                    {filters.processName && (
                      <button
                        onClick={() => updateField('processName', '')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                </Section>

                {/* Line of Business */}
                <Section title="Line of Business" icon={<Landmark size={13} />} defaultOpen={true}>
                  <RadioItem label="All" checked={filters.lob === ''} onChange={() => updateField('lob', '')} />
                  {options.lobs.map(lob => (
                    <RadioItem key={lob} label={lob} checked={filters.lob === lob} onChange={() => updateField('lob', lob)} />
                  ))}
                </Section>

                {/* Journey */}
                <Section title="Journey" icon={<Network size={13} />} defaultOpen={true}>
                  {options.journeys
                    .filter(j => !filters.lob || j.lob === filters.lob)
                    .map(j => (
                      <CheckItem
                        key={j.id}
                        label={j.name}
                        sub={j.lob}
                        checked={filters.journeyIds.includes(j.id)}
                        onChange={() => updateField('journeyIds', toggle(filters.journeyIds, j.id))}
                      />
                    ))}
                </Section>

                {/* Region */}
                <Section title="Region" icon={<Globe size={13} />} defaultOpen={true}>
                  {options.regions.map(r => (
                    <CheckItem
                      key={r}
                      label={r}
                      checked={filters.regions.includes(r)}
                      onChange={() => updateField('regions', toggle(filters.regions, r))}
                    />
                  ))}
                </Section>

                {/* Country */}
                <Section title="Country" icon={<MapPin size={13} />} defaultOpen={false}>
                  <div className="max-h-48 overflow-y-auto pr-1">
                    {visibleCountries.map(c => (
                      <CheckItem
                        key={c.code}
                        label={c.name}
                        sub={c.code}
                        checked={filters.countries.includes(c.code)}
                        onChange={() => updateField('countries', toggle(filters.countries, c.code))}
                      />
                    ))}
                  </div>
                </Section>

                {/* Site */}
                <Section title="Site" icon={<Building2 size={13} />} defaultOpen={false}>
                  <div className="max-h-48 overflow-y-auto pr-1">
                    {visibleSites.length === 0 ? (
                      <p className="text-xs text-gray-600 py-1">No sites for selected filters</p>
                    ) : visibleSites.map(s => (
                      <CheckItem
                        key={s.id}
                        label={s.name}
                        sub={s.countryCode}
                        checked={filters.siteIds.includes(s.id)}
                        onChange={() => updateField('siteIds', toggle(filters.siteIds, s.id))}
                      />
                    ))}
                  </div>
                </Section>
              </>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-2 border-[#DB0011] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
