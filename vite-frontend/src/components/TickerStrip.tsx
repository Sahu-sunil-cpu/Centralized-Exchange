
import React, { useState, useEffect } from 'react';

const tickerData = [
  { symbol: 'BTC', price: '67834.50', change: '+2.34' },
  { symbol: 'ETH', price: '3567.89', change: '+1.87' },
  { symbol: 'SOL', price: '234.56', change: '+5.67' },
  { symbol: 'SUI', price: '2.4567', change: '+8.92' },
  { symbol: 'DOGE', price: '0.3456', change: '-1.23' },
  { symbol: 'ADA', price: '0.8934', change: '+3.45' },
  { symbol: 'AVAX', price: '45.67', change: '+2.11' },
  { symbol: 'DOT', price: '12.34', change: '-0.56' },
  { symbol: 'LINK', price: '23.45', change: '+4.78' },
  { symbol: 'UNI', price: '8.90', change: '+1.23' },
];

export const TickerStrip: React.FC = () => {
  const [currentData, setCurrentData] = useState(tickerData);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(prev => prev.map(item => ({
        ...item,
        price: (parseFloat(item.price) + (Math.random() - 0.5) * parseFloat(item.price) * 0.001).toFixed(item.price.includes('.') ? 4 : 2),
        change: (parseFloat(item.change) + (Math.random() - 0.5) * 0.5).toFixed(2)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50 py-2 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {/* First set of items */}
        {currentData.map((item, index) => {
          const isPositive = parseFloat(item.change) >= 0;
          return (
            <div key={`first-${item.symbol}-${index}`} className="flex items-center space-x-2 text-sm px-6 flex-shrink-0">
              <span className="font-semibold text-cyan-400">{item.symbol}</span>
              <span className="text-white">${item.price}</span>
              <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                {isPositive ? '+' : ''}{item.change}%
              </span>
            </div>
          );
        })}
        {/* Second set of items for seamless loop */}
        {currentData.map((item, index) => {
          const isPositive = parseFloat(item.change) >= 0;
          return (
            <div key={`second-${item.symbol}-${index}`} className="flex items-center space-x-2 text-sm px-6 flex-shrink-0">
              <span className="font-semibold text-cyan-400">{item.symbol}</span>
              <span className="text-white">${item.price}</span>
              <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                {isPositive ? '+' : ''}{item.change}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
