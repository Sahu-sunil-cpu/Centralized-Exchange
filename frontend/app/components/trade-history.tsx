"use client"

// Sample trade history data
const trades = [
  { price: 3.7495, quantity: 40.0, time: "06:38:15" },
  { price: 3.7494, quantity: 2.1, time: "06:38:15" },
  { price: 3.7492, quantity: 1.0, time: "06:38:15" },
  { price: 3.749, quantity: 2.1, time: "06:38:15" },
  { price: 3.7489, quantity: 40.0, time: "06:38:14" },
  { price: 3.7488, quantity: 2.1, time: "06:38:14" },
  { price: 3.7486, quantity: 2.1, time: "06:38:14" },
  { price: 3.7484, quantity: 40.0, time: "06:38:14" },
  { price: 3.7479, quantity: 40.0, time: "06:38:11" },
  { price: 3.7475, quantity: 40.0, time: "06:38:11" },
  { price: 3.7471, quantity: 40.0, time: "06:37:59" },
  { price: 3.7468, quantity: 40.0, time: "06:37:54" },
  { price: 3.7467, quantity: 40.0, time: "06:37:54" },
  { price: 3.7466, quantity: 1.0, time: "06:37:54" },
  { price: 3.744, quantity: 1.0, time: "06:37:46" },
  { price: 3.7438, quantity: 488.6, time: "06:37:44" },
  { price: 3.7418, quantity: 179.5, time: "06:37:28" },
  { price: 3.7426, quantity: 309.1, time: "06:37:10" },
  { price: 3.7406, quantity: 488.6, time: "06:36:30" },
]

export default function TradeHistory() {
  return (
    <div className="text-xs">
      <div className="grid grid-cols-3 text-gray-400 px-4 py-2">
        <div>Price (USD)</div>
        <div className="text-right">Qty (SUI)</div>
        <div className="text-right">Time</div>
      </div>

      <div className="overflow-auto max-h-[300px]">
        {trades.map((trade, index) => {
          // Determine if price is going up or down compared to previous trade
          const prevTrade = trades[index - 1]
          const priceChange = prevTrade ? trade.price - prevTrade.price : 0
          const textColor = priceChange >= 0 ? "text-green-500" : "text-red-500"

          return (
            <div key={index} className="grid grid-cols-3 px-4 py-[2px]">
              <div className={textColor}>{trade.price.toFixed(4)}</div>
              <div className="text-right">{trade.quantity.toFixed(1)}</div>
              <div className="text-right text-gray-400">{trade.time}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
