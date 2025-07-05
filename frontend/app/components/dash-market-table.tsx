"use client"

import { useState } from "react"
import { ArrowDown } from "lucide-react"

// Sample market data
type Chart = "up"|"down"
interface Market {
    name: string,
    icon: string,
    price: number,
    volume: number,
    openInterest: string,
    change: number,
    chart: Chart,
}
const markets: Market[] = [
  {
    name: "SOL-PERP",
    icon: "purple",
    price: 166.9,
    volume: 157000000,
    openInterest: "-",
    change: -1.95,
    chart: "down",
  },
  {
    name: "BTC-PERP",
    icon: "orange",
    price: 103373.0,
    volume: 194300000,
    openInterest: "-",
    change: -0.4,
    chart: "up",
  },
  {
    name: "ETH-PERP",
    icon: "blue",
    price: 2508.64,
    volume: 134800000,
    openInterest: "-",
    change: -1.47,
    chart: "up",
  },
  {
    name: "XRP-PERP",
    icon: "gray",
    price: 2.3598,
    volume: 4700000,
    openInterest: "-",
    change: -0.79,
    chart: "down",
  },
]

export default function DashMarketTable() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-sm text-gray-400 border-b border-gray-800">
            <th className="text-left p-4 font-normal">Name</th>
            <th className="text-right p-4 font-normal cursor-pointer" onClick={() => handleSort("price")}>
              <div className="flex items-center justify-end">
                Price
                {sortColumn === "price" && (
                  <ArrowDown className={`h-3 w-3 ml-1 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </th>
            <th className="text-right p-4 font-normal cursor-pointer" onClick={() => handleSort("volume")}>
              <div className="flex items-center justify-end">
                24h Volume
                {sortColumn === "volume" && (
                  <ArrowDown className={`h-3 w-3 ml-1 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </th>
            <th className="text-right p-4 font-normal cursor-pointer" onClick={() => handleSort("openInterest")}>
              <div className="flex items-center justify-end">
                <ArrowDown className="h-3 w-3 mr-1" />
                Open Interest
                {sortColumn === "openInterest" && (
                  <ArrowDown className={`h-3 w-3 ml-1 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </th>
            <th className="text-right p-4 font-normal cursor-pointer" onClick={() => handleSort("change")}>
              <div className="flex items-center justify-end">
                24h Change
                {sortColumn === "change" && (
                  <ArrowDown className={`h-3 w-3 ml-1 ${sortDirection === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </div>
            </th>
            <th className="text-right p-4 font-normal">Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => (
            <tr key={market.name} className="border-b border-gray-800 hover:bg-gray-900/30 cursor-pointer">
              <td className="p-4">
                <div className="flex items-center">
                  <CoinIcon type={market.icon} symbol={market.name.split("-")[0]} />
                  <span className="ml-2">{market.name}</span>
                </div>
              </td>
              <td className="p-4 text-right">${formatPrice(market.price)}</td>
              <td className="p-4 text-right">${formatVolume(market.volume)}</td>
              <td className="p-4 text-right">{market.openInterest}</td>
              <td className={`p-4 text-right ${market.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {market.change.toFixed(2)}%
              </td>
              <td className="p-4 text-right">
                <MiniChart type={market.chart} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CoinIcon({ type, symbol }: { type: string; symbol: string }) {
  const getColor = () => {
    switch (type) {
      case "blue":
        return "bg-blue-500"
      case "purple":
        return "bg-purple-500"
      case "orange":
        return "bg-orange-500"
      case "gray":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className={`w-6 h-6 rounded-full ${getColor()} flex items-center justify-center text-xs font-bold`}>
      {symbol.charAt(0)}
    </div>
  )
}

function MiniChart({ type }: { type: "up" | "down" }) {
  const color = type === "up" ? "#22c55e" : "#ef4444"

  return (
    <svg width="80" height="24" viewBox="0 0 80 24">
      <path
        d={type === "up" ? "M0,12 Q20,4 40,16 T80,8" : "M0,8 Q20,16 40,4 T80,12"}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  )
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (price >= 1) {
    return price.toFixed(2)
  } else {
    return price.toFixed(4)
  }
}

function formatVolume(volume: number): string {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(1)}B`
  } else if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`
  } else {
    return volume.toString()
  }
}
