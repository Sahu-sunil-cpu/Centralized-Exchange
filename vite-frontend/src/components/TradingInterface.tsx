
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TradingInterfaceProps {
  currentPrice: string;
}

export const TradingInterface: React.FC<TradingInterfaceProps> = ({ currentPrice }) => {
  const [orderType, setOrderType] = useState('limit');
  const [buyQuantity, setBuyQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState(currentPrice);
  const [sellQuantity, setSellQuantity] = useState('');
  const [sellPrice, setSellPrice] = useState(currentPrice);

  const calculateTotal = (quantity: string, price: string) => {
    const qty = parseFloat(quantity) || 0;
    const prc = parseFloat(price) || 0;
    return (qty * prc).toFixed(4);
  };

  return (
    <div className="h-full bg-slate-900 p-4">
      <div className="text-white font-semibold mb-4 text-sm">Trade SUI/USDT</div>
      
      {/* Order Type Selector */}
      <div className="flex space-x-2 mb-4">
        <Button
          variant={orderType === 'limit' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setOrderType('limit')}
          className="text-xs"
        >
          Limit
        </Button>
        <Button
          variant={orderType === 'market' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setOrderType('market')}
          className="text-xs"
        >
          Market
        </Button>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700">
          <TabsTrigger value="buy" className="text-green-400">Buy</TabsTrigger>
          <TabsTrigger value="sell" className="text-red-400">Sell</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy" className="space-y-4 mt-4">
          {orderType === 'limit' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Price</label>
              <Input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="0.00"
              />
            </div>
          )}
          
          <div>
            <label className="text-xs text-slate-400 block mb-1">Quantity</label>
            <Input
              type="number"
              value={buyQuantity}
              onChange={(e) => setBuyQuantity(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
              placeholder="0.00"
            />
          </div>

          <div className="text-xs text-slate-400">
            Total: {calculateTotal(buyQuantity, buyPrice)} USDT
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            Buy SUI
          </Button>
        </TabsContent>
        
        <TabsContent value="sell" className="space-y-4 mt-4">
          {orderType === 'limit' && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Price</label>
              <Input
                type="number"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                placeholder="0.00"
              />
            </div>
          )}
          
          <div>
            <label className="text-xs text-slate-400 block mb-1">Quantity</label>
            <Input
              type="number"
              value={sellQuantity}
              onChange={(e) => setSellQuantity(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
              placeholder="0.00"
            />
          </div>

          <div className="text-xs text-slate-400">
            Total: {calculateTotal(sellQuantity, sellPrice)} USDT
          </div>

          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            Sell SUI
          </Button>
        </TabsContent>
      </Tabs>

      {/* Balance Info */}
      <div className="mt-6 space-y-2">
        <div className="text-xs text-slate-400">Available Balance</div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-300">SUI:</span>
          <span className="text-white">1,234.56</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-300">USDT:</span>
          <span className="text-white">5,678.90</span>
        </div>
      </div>
    </div>
  );
};
