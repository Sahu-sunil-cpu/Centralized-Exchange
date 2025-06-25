
import React from 'react';
import { TrendingUp, TrendingDown } from "lucide-react";

interface Market {
  symbol: string;
  price: string;
  change: string;
  high: string;
  low: string;
  volume: string;
  sparklineData: number[];
}

interface MarketCardProps {
  market: Market;
  index: number;
  onClick: () => any;
}

const Sparkline = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-16 h-8">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        className="opacity-80"
      />
    </svg>
  );
};

export const MarketCard: React.FC<MarketCardProps> = ({ market, index, onClick }) => {
  const isPositive = parseFloat(market.change) >= 0;
  const changeClass = isPositive ? 'text-green-400' : 'text-red-400';
  const bgClass = isPositive ? 'hover:bg-green-500/5' : 'hover:bg-red-500/5';

  return (
    <div 
      className={`bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/30 transition-all duration-300 hover:scale-[1.02] ${bgClass} backdrop-blur-sm`}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-white text-lg">{market.symbol}</div>
        <div className="flex items-center space-x-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm font-medium ${changeClass}`}>
            {isPositive ? '+' : ''}{market.change}%
          </span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-white mb-2">
        ${market.price}
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <Sparkline data={market.sparklineData} isPositive={isPositive} />
        <div className="text-xs text-slate-400">
          Vol: ${(parseFloat(market.volume) / 1000000).toFixed(1)}M
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-400">
        <span>H: ${market.high}</span>
        <span>L: ${market.low}</span>
      </div>
    </div>
  );
};
