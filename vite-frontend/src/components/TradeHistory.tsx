import { WsManager } from '@/lib/WsManger';
import React, { useEffect, useState } from 'react';

export const TradeHistory = ({ market }: { market: string }) => {
  // Mock trade history data with more entries
  const [trade, setTrade] = useState<Trade[]>();

  interface Trade {
    tradeId: string,
    matched: string,
    price: string,
    quantity: string,
    symbol: string,
    side: string,
    time: number
  }

  const getDate = (date: number)  => {
    console.log(date)
    const time = new Date(date).toTimeString().split(" ")[0];
    return time;
  }

  useEffect(() => {
   
    WsManager.getInstance().registerCallback("trade", (data: any) => {
      setTrade((previousTrade) => {
        const newTrade = [...(previousTrade || [])];
        newTrade.push(data);
        newTrade.sort((x, y) => Number(y.time) > Number(x.time) ? 1 : -1);

        return newTrade
      })

    }, `TRADE-${market}`)
  }, [])

  
  return (
    <div className="h-full bg-slate-800 p-4 flex flex-col">
      <div className="text-white font-semibold mb-4 text-sm">Recent Trades</div>
      
      {/* Header */}
      <div className="grid grid-cols-3 text-xs text-slate-400 mb-2">
        <div>Time</div>
        <div className="text-right">Price</div>
        <div className="text-right">Quantity</div>
      </div>

      {/* Trade List - Scrollable with hidden scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {trade && trade.map(({price, quantity, side, time, tradeId}) => (
            <div 
              key={tradeId} 
              className="grid grid-cols-3 text-xs py-1 hover:bg-slate-700 cursor-pointer"
            >
              <div className="text-slate-400">{getDate(time)}</div>
              <div className={`text-right ${side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                {price}
              </div>
              <div className="text-right text-slate-300">{quantity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
