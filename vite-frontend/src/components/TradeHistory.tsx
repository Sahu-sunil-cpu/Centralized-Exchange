
import React from 'react';

export const TradeHistory: React.FC = () => {
  // Mock trade history data
  const trades = [
    { time: '14:32:45', price: '2.4567', quantity: '0.5234', side: 'buy' },
    { time: '14:32:43', price: '2.4556', quantity: '1.2456', side: 'sell' },
    { time: '14:32:41', price: '2.4578', quantity: '0.8734', side: 'buy' },
    { time: '14:32:39', price: '2.4545', quantity: '2.1234', side: 'sell' },
    { time: '14:32:37', price: '2.4567', quantity: '0.9876', side: 'buy' },
    { time: '14:32:35', price: '2.4534', quantity: '1.5678', side: 'sell' },
    { time: '14:32:33', price: '2.4589', quantity: '0.7234', side: 'buy' },
    { time: '14:32:31', price: '2.4556', quantity: '1.8765', side: 'sell' },
  ];

  return (
    <div className="h-full bg-slate-800 p-4">
      <div className="text-white font-semibold mb-4 text-sm">Recent Trades</div>
      
      {/* Header */}
      <div className="grid grid-cols-3 text-xs text-slate-400 mb-2">
        <div>Time</div>
        <div className="text-right">Price</div>
        <div className="text-right">Quantity</div>
      </div>

      {/* Trade List */}
      <div className="space-y-1 overflow-y-auto max-h-60">
        {trades.map((trade, index) => (
          <div 
            key={index} 
            className="grid grid-cols-3 text-xs py-1 hover:bg-slate-700 cursor-pointer"
          >
            <div className="text-slate-400">{trade.time}</div>
            <div className={`text-right ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
              {trade.price}
            </div>
            <div className="text-right text-slate-300">{trade.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
