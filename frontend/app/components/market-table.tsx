"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Star } from "lucide-react"

type MarketType = "spot" | "futures" | "lend"

interface MarketTableProps {
  type: MarketType
}

interface Market {
  pair: string
  price: number
  change: number
  volume: number
  favorite: boolean
}

// Sample market data
const spotMarkets: Market[] = [
  { pair: "BTC/USDT", price: 65432.1, change: 2.34, volume: 1234567890, favorite: true },
  { pair: "ETH/USDT", price: 3456.78, change: 1.23, volume: 987654321, favorite: true },
  { pair: "SOL/USDT", price: 123.45, change: -0.45, volume: 456789012, favorite: false },
  { pair: "XRP/USDT", price: 0.5678, change: 3.21, volume: 345678901, favorite: false },
  { pair: "ADA/USDT", price: 0.4321, change: -1.23, volume: 234567890, favorite: false },
  { pair: "DOGE/USDT", price: 0.1234, change: 4.56, volume: 123456789, favorite: false },
  { pair: "DOT/USDT", price: 6.789, change: -2.34, volume: 98765432, favorite: false },
  { pair: "LINK/USDT", price: 12.34, change: 1.23, volume: 87654321, favorite: false },
]

const futuresMarkets: Market[] = [
  { pair: "BTC-PERP", price: 65430.5, change: 2.35, volume: 2345678901, favorite: true },
  { pair: "ETH-PERP", price: 3455.67, change: 1.24, volume: 1098765432, favorite: true },
  { pair: "SOL-PERP", price: 123.4, change: -0.46, volume: 567890123, favorite: false },
  { pair: "XRP-PERP", price: 0.5677, change: 3.22, volume: 456789012, favorite: false },
  { pair: "ADA-PERP", price: 0.432, change: -1.24, volume: 345678901, favorite: false },
  { pair: "DOGE-PERP", price: 0.1233, change: 4.57, volume: 234567890, favorite: false },
  { pair: "DOT-PERP", price: 6.788, change: -2.35, volume: 109876543, favorite: false },
  { pair: "LINK-PERP", price: 12.33, change: 1.24, volume: 98765432, favorite: false },
]

const lendMarkets: Market[] = [
  { pair: "BTC", price: 3.65, change: 0.05, volume: 1234567, favorite: true },
  { pair: "ETH", price: 4.32, change: 0.12, volume: 2345678, favorite: true },
  { pair: "SOL", price: 5.67, change: -0.23, volume: 3456789, favorite: false },
  { pair: "USDT", price: 8.9, change: 0.34, volume: 4567890, favorite: false },
  { pair: "USDC", price: 8.85, change: -0.45, volume: 5678901, favorite: false },
  { pair: "DAI", price: 8.75, change: 0.56, volume: 6789012, favorite: false },
  { pair: "BUSD", price: 8.65, change: -0.67, volume: 7890123, favorite: false },
  { pair: "TUSD", price: 8.55, change: 0.78, volume: 8901234, favorite: false },
]

export default function MarketTable({ type }: MarketTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "favorites">("all")

  const getMarkets = () => {
    switch (type) {
      case "spot":
        return spotMarkets
      case "futures":
        return futuresMarkets
      case "lend":
        return lendMarkets
      default:
        return spotMarkets
    }
  }

  const markets = getMarkets()

  const filteredMarkets = markets.filter((market) => {
    const matchesSearch = market.pair.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFavorites = filter === "all" || (filter === "favorites" && market.favorite)
    return matchesSearch && matchesFavorites
  })

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search markets"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex border-b mb-2">
        <button
          className={`pb-2 px-4 text-sm ${filter === "all" ? "border-b-2 border-primary" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`pb-2 px-4 text-sm ${filter === "favorites" ? "border-b-2 border-primary" : ""}`}
          onClick={() => setFilter("favorites")}
        >
          Favorites
        </button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-4 text-xs text-muted-foreground py-1">
          <div>Pair</div>
          <div className="text-right">Price</div>
          <div className="text-right">Change</div>
          <div className="text-right">Volume</div>
        </div>

        {filteredMarkets.map((market, index) => (
          <div key={index} className="grid grid-cols-4 text-sm py-1 hover:bg-muted/50 rounded cursor-pointer">
            <div className="flex items-center">
              <Star
                className={`h-3 w-3 mr-1 ${market.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
              />
              {market.pair}
            </div>
            <div className="text-right">
              {type === "lend"
                ? `${market.price.toFixed(2)}%`
                : market.price < 0.1
                  ? market.price.toFixed(6)
                  : market.price < 1
                    ? market.price.toFixed(4)
                    : market.price.toFixed(2)}
            </div>
            <div className={`text-right ${market.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {market.change >= 0 ? "+" : ""}
              {market.change.toFixed(2)}%
            </div>
            <div className="text-right">
              {market.volume >= 1000000000
                ? `${(market.volume / 1000000000).toFixed(1)}B`
                : market.volume >= 1000000
                  ? `${(market.volume / 1000000).toFixed(1)}M`
                  : market.volume >= 1000
                    ? `${(market.volume / 1000).toFixed(1)}K`
                    : market.volume}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
