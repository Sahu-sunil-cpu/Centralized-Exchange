
import { getDepth, getTickers, getTrades } from '@/lib/httpClient';
import { WsManager } from '@/lib/WsManger';
import React, { useEffect, useState } from 'react';
import { BidTable } from './orderbook/bids';
import { Asks, AskTable } from './orderbook/asks';



export const OrderBook = ({ asks, bids, currentPrice }: { asks: [string, string][], bids: [string, string][], currentPrice: string }) => {

  return (
    <div className="h-full bg-slate-900 p-4 flex flex-col">
    <div className="text-white font-semibold mb-4 text-sm">Order Book</div>
    
    {/* Header */}
    <div className="grid grid-cols-3 text-xs text-slate-400 mb-2">
      <div>Price</div>
      <div className="text-right">Quantity</div>
      <div className="text-right">Total</div>
    </div>

    {/* Ask Orders (Sell) - Scrollable with hidden scrollbar */}
 
      {asks && <AskTable asks={asks} />}
  
 

    {/* Current Price - Fixed at center */}
    <div className="text-center py-3 my-2 border-t border-b border-slate-700 bg-slate-800/50">
      <div className="text-green-400 font-bold text-lg">${currentPrice}</div>
      <div className="text-xs text-slate-400">Mark Price</div>
    </div>

    {/* Bid Orders (Buy) - Scrollable with hidden scrollbar */}
   
      {bids && <BidTable bids={bids} />}
      </div>
 
  );
};

const askOrders: [string, string][] = [
  ["20", "40"],
  ["40", "20"],
  ["21", "40"],
  ["42", "20"],
 
];

const bidOrders: [string, string][] = [
  ["20", "40"],
  ["40", "20"]
];


export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [asks, setAsks] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    WsManager.getInstance().registerCallback("depth", (data: any) => {
      console.log("depth has been updated");
      console.log(data);

      setBids((originalBids) => {
        const bidsAfterUpdate = [...(originalBids || [])];
        // console.log(asks)


        // need to optimize
        for (let i = 0; i < bidsAfterUpdate.length; i++) {
          for (let j = 0; j < data.bids.length; j++) {
            if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
              bidsAfterUpdate[i][1] = data.bids[j][1];
              if (Number(bidsAfterUpdate[i][1]) === 0) {
                bidsAfterUpdate.splice(i, 1);
              }
              break;
            }
          }
        }

        for (let j = 0; j < data.bids.length; j++) {
          if (Number(data.bids[j][1]) !== 0 && !bidsAfterUpdate.map(x => x[0]).includes(data.bids[j][0])) {
            bidsAfterUpdate.push(data.bids[j]);
            break;
          }
        }
        bidsAfterUpdate.sort((x, y) => Number(y[0]) > Number(x[0]) ? -1 : 1);
        return bidsAfterUpdate;
      });

      setAsks((originalAsks) => {
        const asksAfterUpdate = [...(originalAsks || [])];

        for (let i = 0; i < asksAfterUpdate.length; i++) {
          for (let j = 0; j < data.asks.length; j++) {
            if (asksAfterUpdate[i][0] === data.asks[j][0]) {
              asksAfterUpdate[i][1] = data.asks[j][1];
              if (Number(asksAfterUpdate[i][1]) === 0) {
                asksAfterUpdate.splice(i, 1);
              }
              break;
            }
          }
        }

        for (let j = 0; j < data.asks.length; j++) {
          if (Number(data.asks[j][1]) !== 0 && !asksAfterUpdate.map(x => x[0]).includes(data.asks[j][0])) {
            asksAfterUpdate.push(data.asks[j]);
            break;
          }
        }
        asksAfterUpdate.sort((x, y) => Number(y[0]) > Number(x[0]) ? 1 : -1);
        return asksAfterUpdate;
      });
    }, `DEPTH-${market}`);


    // getDepth(market.replace("/", "_")).then(d => {    
    //     setBids(bidOrders.reverse());
    //     setAsks(askOrders);
    // });
    setBids(bidOrders.reverse());
    setAsks(askOrders);

    //    getTickers(market).then(t => setPrice(t.lastPrice));
    //  getTrades(market).then(t => setPrice(t[0].price));


    return () => {
      WsManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
    }
  }, [])
  return <div>
    {<OrderBook asks={asks} bids={bids} currentPrice={"678"} />}
  </div>
}


