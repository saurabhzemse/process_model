import React from 'react';
import { MarketRanking as MarketRankingType } from '../../types';

interface Props { markets: MarketRankingType[] }

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

const AttBar: React.FC<{ value: number }> = ({ value }) => {
  const color = value >= 90 ? '#059669' : value >= 70 ? '#D97706' : '#DB0011';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-12 text-right" style={{ color }}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
};

export const MarketRanking: React.FC<Props> = ({ markets }) => (
  <div>
    <h3 className="text-sm font-bold text-gray-800 mb-3">Top 10 Markets by SLA Adherence</h3>
    <div className="overflow-hidden rounded-lg border border-gray-100">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left py-2.5 px-3 text-gray-500 font-semibold w-8">#</th>
            <th className="text-left py-2.5 px-3 text-gray-500 font-semibold">Market</th>
            <th className="text-right py-2.5 px-3 text-gray-500 font-semibold">Reqs</th>
            <th className="text-left py-2.5 px-3 text-gray-500 font-semibold w-36">SLA Adherence</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((m, i) => (
            <tr
              key={m.marketCode}
              className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
            >
              <td className="py-2.5 px-3">
                <span
                  className="text-xs font-bold"
                  style={{ color: i < 3 ? medalColors[i] : '#9CA3AF' }}
                >
                  {m.rank}
                </span>
              </td>
              <td className="py-2.5 px-3">
                <div className="font-semibold text-gray-800">{m.marketName}</div>
                <div className="text-gray-400 text-[10px] font-mono">{m.marketCode}</div>
              </td>
              <td className="py-2.5 px-3 text-right text-gray-600 font-medium">
                {m.totalRequests}
              </td>
              <td className="py-2.5 px-3">
                <AttBar value={m.slaAdherencePercentage} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
