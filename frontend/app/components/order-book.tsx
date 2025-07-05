"use client"

// Sample order book data
const asks = [
  { price: 3.7021, size: 1.9, total: 9187.0 },
  { price: 3.7019, size: 1350.6, total: 9185.1 },
  { price: 3.7016, size: 488.6, total: 7834.5 },
  { price: 3.701, size: 5234.3, total: 7345.9 },
  { price: 3.7006, size: 675.5, total: 2111.6 },
  { price: 3.7001, size: 540.9, total: 1436.1 },
  { price: 3.6999, size: 270.4, total: 895.2 },
  { price: 3.6998, size: 489.6, total: 624.8 },
  { price: 3.6989, size: 135.2, total: 135.2 },
]

const bids = [
  { price: 3.6969, size: 0, total: 0 },
  { price: 3.6972, size: 90.7, total: 90.7 },
  { price: 3.6971, size: 147.8, total: 238.5 },
  { price: 3.697, size: 273.9, total: 512.4 },
  { price: 3.6963, size: 444.0, total: 956.4 },
  { price: 3.6962, size: 986.5, total: 1942.9 },
  { price: 3.696, size: 135.2, total: 2078.1 },
  { price: 3.6959, size: 1736.8, total: 3814.9 },
  { price: 3.6956, size: 3175.6, total: 6990.5 },
  { price: 3.6955, size: 270.4, total: 7260.9 },
]

export default function OrderBook() {
  return (
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
              <div className="text-red-500 z-10">{ask.price.toFixed(4)}</div>
              <div className="text-right z-10">{ask.size.toLocaleString(undefined, { minimumFractionDigits: 1 })}</div>
              <div className="text-right z-10">{ask.total.toLocaleString(undefined, { minimumFractionDigits: 1 })}</div>
              <div
                className="absolute right-0 top-0 h-full bg-red-900/20"
                style={{ width: `${Math.min((ask.size / 5000) * 100, 100)}%` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Current price */}
        <div className="py-1 px-4">
          <div className="text-red-500 font-medium">3.6969</div>
        </div>

        {/* Bids (Buy orders) */}
        <div className="space-y-[1px]">
          {bids.slice(1).map((bid, index) => (
            <div key={index} className="grid grid-cols-3 px-4 py-[2px] relative">
              <div className="text-green-500 z-10">{bid.price.toFixed(4)}</div>
              <div className="text-right z-10">{bid.size.toLocaleString(undefined, { minimumFractionDigits: 1 })}</div>
              <div className="text-right z-10">{bid.total.toLocaleString(undefined, { minimumFractionDigits: 1 })}</div>
              <div
                className="absolute right-0 top-0 h-full bg-green-900/20"
                style={{ width: `${Math.min((bid.size / 5000) * 100, 100)}%` }}
              ></div>
            </div>
          ))}
        </div>

        {/* Order book summary */}
        <div className="grid grid-cols-2 px-4 py-2 mt-2 bg-[#1a1a1a]/30">
          <div className="text-green-500">76%</div>
          <div className="text-right text-red-500">24%</div>
        </div>
      </div>
    </div>
  )
}
