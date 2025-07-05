"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

// Sample order book data
const asks = [
  { price: 3.7445, size: 534.6, total: 963.8 },
  { price: 3.744, size: 1.0, total: 429.2 },
  { price: 3.7438, size: 20.0, total: 428.2 },
  { price: 3.7437, size: 267.3, total: 408.2 },
  { price: 3.7432, size: 133.6, total: 140.9 },
  { price: 3.743, size: 2.1, total: 7.3 },
  { price: 3.742, size: 2.1, total: 5.2 },
  { price: 3.7414, size: 1.0, total: 3.1 },
  { price: 3.741, size: 2.1, total: 2.1 },
]

const bids = [
  { price: 3.7402, size: 0, total: 0 },
  { price: 3.7398, size: 5030.5, total: 5030.5 },
  { price: 3.7388, size: 133.6, total: 5164.1 },
  { price: 3.7387, size: 2429.3, total: 7593.4 },
  { price: 3.7378, size: 267.3, total: 7860.7 },
  { price: 3.7371, size: 534.6, total: 8395.3 },
  { price: 3.7363, size: 1338.2, total: 9733.5 },
]

// Sample trade history data
const trades = [
  { price: 3.7402, quantity: 40.0, time: "06:38:15", type: "buy" },
  { price: 3.7401, quantity: 2.1, time: "06:38:15", type: "buy" },
  { price: 3.74, quantity: 1.0, time: "06:38:15", type: "buy" },
  { price: 3.7399, quantity: 2.1, time: "06:38:15", type: "buy" },
  { price: 3.7398, quantity: 40.0, time: "06:38:14", type: "buy" },
  { price: 3.7397, quantity: 2.1, time: "06:38:14", type: "sell" },
  { price: 3.7396, quantity: 2.1, time: "06:38:14", type: "sell" },
  { price: 3.7395, quantity: 40.0, time: "06:38:14", type: "sell" },
  { price: 3.7394, quantity: 40.0, time: "06:38:11", type: "sell" },
  { price: 3.7393, quantity: 40.0, time: "06:38:11", type: "buy" },
  { price: 3.7392, quantity: 40.0, time: "06:37:59", type: "buy" },
  { price: 3.7391, quantity: 40.0, time: "06:37:54", type: "sell" },
  { price: 3.739, quantity: 40.0, time: "06:37:54", type: "sell" },
  { price: 3.7389, quantity: 1.0, time: "06:37:54", type: "buy" },
  { price: 3.7388, quantity: 1.0, time: "06:37:46", type: "buy" },
]

export default function CombinedBookTrades() {
  const [precision, setPrecision] = useState<number>(4)
  const [step, setStep] = useState<number>(0.0001)

  const increaseStep = () => {
    setStep((prev) => Math.min(prev * 10, 0.1))
  }

  const decreaseStep = () => {
    setStep((prev) => Math.max(prev / 10, 0.0001))
  }

  return (
    <Tabs defaultValue="book" className="h-full">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={decreaseStep}>
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs text-gray-400">0.0001</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={increaseStep}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <TabsContent value="book" className="m-0 h-full">
        <div className="h-full text-xs">
          <div className="grid grid-cols-3 text-gray-400 px-4 py-2">
            <div>Price (USD)</div>
            <div className="text-right">Size (SUI)</div>
            <div className="text-right">Total (SUI)</div>
          </div>

          <div className="overflow-auto h-[calc(100%-40px)]">
            {/* Asks (Sell orders) */}
            <div className="space-y-[1px]">
              {asks.map((ask, index) => (
                <div key={index} className="grid grid-cols-3 px-4 py-[2px] relative">
                  <div className="text-red-500 z-10">{ask.price.toFixed(precision)}</div>
                  <div className="text-right z-10">
                    {ask.size.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </div>
                  <div className="text-right z-10">
                    {ask.total.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </div>
                  <div
                    className="absolute right-0 top-0 h-full bg-red-900/20"
                    style={{ width: `${Math.min((ask.size / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Current price */}
            <div className="py-1 px-4">
              <div className="text-green-500">{bids[0].price.toFixed(precision)}</div>
            </div>

            {/* Bids (Buy orders) */}
            <div className="space-y-[1px]">
              {bids.slice(1).map((bid, index) => (
                <div key={index} className="grid grid-cols-3 px-4 py-[2px] relative">
                  <div className="text-green-500 z-10">{bid.price.toFixed(precision)}</div>
                  <div className="text-right z-10">
                    {bid.size.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </div>
                  <div className="text-right z-10">
                    {bid.total.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                  </div>
                  <div
                    className="absolute right-0 top-0 h-full bg-green-900/20"
                    style={{ width: `${Math.min((bid.size / 5000) * 100, 100)}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="trades" className="m-0 h-full">
        <div className="text-xs h-full">
          <div className="grid grid-cols-3 text-gray-400 px-4 py-2">
            <div>Price (USD)</div>
            <div className="text-right">Size (SUI)</div>
            <div className="text-right">Time</div>
          </div>

          <div className="overflow-auto h-[calc(100%-40px)]">
            {trades.map((trade, index) => (
              <div key={index} className="grid grid-cols-3 px-4 py-[2px]">
                <div className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
                  {trade.price.toFixed(precision)}
                </div>
                <div className="text-right">{trade.quantity.toFixed(1)}</div>
                <div className="text-right text-gray-400">{trade.time}</div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
