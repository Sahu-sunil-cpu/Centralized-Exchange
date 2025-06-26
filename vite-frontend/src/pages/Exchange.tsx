
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { TradingViewChart } from '@/components/TradingChart';
import { Depth, OrderBook } from '@/components/OrderBook';
import { TradeHistory } from '@/components/TradeHistory';
import { TradingInterface } from '@/components/TradingInterface';
import { TopNavBar } from '@/components/TopNavBar';
import { TickerStrip } from '@/components/TickerStrip';
import { useParams } from 'react-router-dom';
import { WsManager } from '@/lib/WsManger';

const Exchange = () => {
  const [selectedPair, setSelectedPair] = useState('SUI/USDT');
  const [currentPrice, setCurrentPrice] = useState('2.4567');
  const { ticker } = useParams();

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const price = parseFloat(currentPrice);
      const newPrice = price + (Math.random() - 0.5) * 0.1;
      setCurrentPrice(newPrice.toFixed(4));
    }, 2000);


    const message = {
      type: "ADD_USER",
      payload: {
        tickerId: `@${ticker}`
      }
    }

    WsManager.getInstance().init();
    WsManager.getInstance().sendMessage(message);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TopNavBar />
      <TickerStrip />

      <div className="h-[calc(100vh-112px)]">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Side - Order Book */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-r border-slate-700 bg-slate-900 scroll">
              <Depth market={ticker.replace("/", "_")} />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center - Chart and Trading Pair Info */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col">
              {/* Trading Pair Header */}
              <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-800 flex-shrink-0">
                <div className="flex items-center space-x-6">
                  <Select value={selectedPair} onValueChange={setSelectedPair}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="SUI/USDT">SUI/USDT</SelectItem>
                      <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                      <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                      <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="text-2xl font-bold text-green-400">${currentPrice}</div>
                      <div className="text-sm text-slate-400">24h Vol: 45.2M</div>
                    </div>
                    <div className="text-green-400 text-sm font-medium">+5.67%</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div>High: $2.67</div>
                  <div>Low: $2.31</div>
                </div>
              </div>

              {/* Resizable Chart and Bottom Section */}
              <ResizablePanelGroup direction="vertical" className="flex-1">
                {/* Chart */}
                <ResizablePanel defaultSize={70} minSize={50}>
                  <div className="h-full bg-slate-900">
                    {/* <TradingViewChart currentPrice={currentPrice} /> */}
                    <TradingViewChart />

                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Bottom Tabs */}
                <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                  <div className="h-full border-t border-slate-700 bg-slate-800">
                    <Tabs defaultValue="trades" className="h-full">
                      <TabsList className="grid w-full grid-cols-5 bg-slate-700">
                        <TabsTrigger value="trades">Trades</TabsTrigger>
                        <TabsTrigger value="depth">Depth</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="balances">Balances</TabsTrigger>
                      </TabsList>

                      <TabsContent value="trades" className="mt-0 h-full">
                        <TradeHistory />
                      </TabsContent>

                      <TabsContent value="depth" className="mt-0 h-full p-4">
                        <div className="text-slate-400">Market depth visualization would go here</div>
                      </TabsContent>

                      <TabsContent value="orders" className="mt-0 h-full p-4">
                        <div className="text-slate-400">Open orders would go here</div>
                      </TabsContent>

                      <TabsContent value="history" className="mt-0 h-full p-4">
                        <div className="text-slate-400">Order history would go here</div>
                      </TabsContent>

                      <TabsContent value="balances" className="mt-0 h-full p-4">
                        <div className="text-slate-400">Account balances would go here</div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Side - Trading Interface */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full border-l border-slate-700 bg-slate-900">
              <TradingInterface currentPrice={currentPrice} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Exchange;
