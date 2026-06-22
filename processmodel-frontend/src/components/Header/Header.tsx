import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const HsbcLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,2 44,13 44,35 24,46 4,35 4,13" fill="#DB0011"/>
    <text x="24" y="28" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif">HSBC</text>
  </svg>
);

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="flex items-center justify-between px-6 h-16 bg-[#1A1A1A] border-b-2 border-[#DB0011] shadow-lg z-50 relative">
      <div className="flex items-center gap-3">
        <HsbcLogo />
        <div>
          <div className="text-white text-xs font-medium tracking-widest uppercase opacity-60">HSBC</div>
          <div className="text-white text-xs opacity-40 -mt-0.5">The world's local bank</div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="text-white text-lg font-semibold tracking-wide">Process Intelligence Dashboard</div>
        <div className="text-[#DB0011] text-xs text-center font-medium tracking-widest uppercase mt-0.5">Node Intelligence</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-white text-sm font-mono font-medium">{formatTime(time)}</div>
          <div className="text-gray-400 text-xs">{formatDate(time)}</div>
        </div>
        <button
          onClick={onReset}
          title="Reset Graph"
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <RotateCcw size={14} className="text-white" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#DB0011] flex items-center justify-center">
          <span className="text-white text-xs font-bold">OPS</span>
        </div>
      </div>
    </header>
  );
};
