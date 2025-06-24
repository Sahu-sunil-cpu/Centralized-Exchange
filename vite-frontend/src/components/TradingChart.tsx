
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

interface TradingChartProps {
  currentPrice: string;
}

export const TradingChart: React.FC<TradingChartProps> = ({ currentPrice }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  
  const timeframes = ['3m', '15m', '1h', '4h', '1d', '1w'];

  // Generate mock candlestick data
  const generateCandlestickData = () => {
    const data = [];
    let price = parseFloat(currentPrice);
    
    for (let i = 0; i < 50; i++) {
      const open = price;
      const volatility = price * 0.02;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);
      
      data.push({ open, high, low, close, volume: Math.random() * 1000000 });
      price = close;
    }
    return data;
  };

  const candlestickData = generateCandlestickData();

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Chart Controls */}
      <div className="h-12 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          {timeframes.map(tf => (
            <Button
              key={tf}
              size="sm"
              variant={selectedTimeframe === tf ? "default" : "ghost"}
              className={`text-xs ${selectedTimeframe === tf ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-cyan-400'}`}
              onClick={() => setSelectedTimeframe(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <span>O: ${candlestickData[candlestickData.length - 1]?.open.toFixed(4)}</span>
          <span>H: ${candlestickData[candlestickData.length - 1]?.high.toFixed(4)}</span>
          <span>L: ${candlestickData[candlestickData.length - 1]?.low.toFixed(4)}</span>
          <span>C: ${candlestickData[candlestickData.length - 1]?.close.toFixed(4)}</span>
        </div>
      </div>

      {/* Mock Chart Area */}
      <div className="flex-1 relative bg-slate-900 p-4">
        <div className="w-full h-full flex items-end justify-between space-x-1">
          {candlestickData.map((candle, index) => {
            const isGreen = candle.close > candle.open;
            const bodyHeight = Math.abs(candle.close - candle.open) * 200;
            const wickTop = (candle.high - Math.max(candle.open, candle.close)) * 200;
            const wickBottom = (Math.min(candle.open, candle.close) - candle.low) * 200;
            
            return (
              <div key={index} className="flex flex-col items-center" style={{ width: '2%' }}>
                {/* Upper wick */}
                <div 
                  className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ height: `${wickTop}px` }}
                />
                {/* Body */}
                <div 
                  className={`w-full ${isGreen ? 'bg-green-400' : 'bg-red-400'} opacity-80`}
                  style={{ height: `${Math.max(bodyHeight, 2)}px` }}
                />
                {/* Lower wick */}
                <div 
                  className={`w-0.5 ${isGreen ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ height: `${wickBottom}px` }}
                />
              </div>
            );
          })}
        </div>
        
        {/* Price line indicator */}
        <div className="absolute right-0 top-1/2 bg-cyan-500 text-white px-2 py-1 text-xs rounded-l">
          ${currentPrice}
        </div>
      </div>
    </div>
  );
};
