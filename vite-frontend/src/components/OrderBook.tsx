
import React from 'react';

interface OrderBookProps {
  currentPrice: string;
}

export const OrderBook: React.FC<OrderBookProps> = ({ currentPrice }) => {
  // Mock order book data
  const askOrders = [
    { price: '2.4789', quantity: '1.245K', total: '3.087K' },
    { price: '2.4756', quantity: '2.134K', total: '5.284K' },
    { price: '2.4723', quantity: '3.567K', total: '8.825K' },
    { price: '2.4698', quantity: '1.876K', total: '4.635K' },
    { price: '2.4672', quantity: '2.987K', total: '7.374K' },
  ];

  const bidOrders = [
    { price: '2.4634', quantity: '2.456K', total: '6.054K' },
    { price: '2.4601', quantity: '1.789K', total: '4.402K' },
    { price: '2.4578', quantity: '3.234K', total: '7.951K' },
    { price: '2.4545', quantity: '1.567K', total: '3.846K' },
    { price: '2.4512', quantity: '2.876K', total: '7.057K' },
  ];

  return (
    <div className="h-full bg-slate-900 p-4">
      <div className="text-white font-semibold mb-4 text-sm">Order Book</div>
      
      {/* Header */}
      <div className="grid grid-cols-3 text-xs text-slate-400 mb-2">
        <div>Price</div>
        <div className="text-right">Quantity</div>
        <div className="text-right">Total</div>
      </div>

      {/* Ask Orders (Sell) */}
      <div className="mb-4">
        {askOrders.map((order, index) => (
          <div key={`ask-${index}`} className="grid grid-cols-3 text-xs py-1 hover:bg-slate-800 cursor-pointer">
            <div className="text-red-400">{order.price}</div>
            <div className="text-right text-slate-300">{order.quantity}</div>
            <div className="text-right text-slate-400">{order.total}</div>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="text-center py-2 mb-4">
        <div className="text-green-400 font-bold text-lg">${currentPrice}</div>
        <div className="text-xs text-slate-400">Mark Price</div>
      </div>

      {/* Bid Orders (Buy) */}
      <div>
        {bidOrders.map((order, index) => (
          <div key={`bid-${index}`} className="grid grid-cols-3 text-xs py-1 hover:bg-slate-800 cursor-pointer">
            <div className="text-green-400">{order.price}</div>
            <div className="text-right text-slate-300">{order.quantity}</div>
            <div className="text-right text-slate-400">{order.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
