import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import MarketSection from "../components/market-section"

import SeasonBanner from "../components/season-banner"
import DashMarketTable from "../components/dash-market-table"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-red-600 p-1 rounded">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </div>
              <span className="font-bold text-lg">Backpack</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-white font-medium">
                Spot
              </Link>
              <Link href="/futures" className="text-gray-400 hover:text-white">
                Futures
              </Link>
              <Link href="/lend" className="text-gray-400 hover:text-white">
                Lend
              </Link>
              <div className="flex items-center text-gray-400 hover:text-white cursor-pointer">
                <span>More</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </div>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search markets"
                className="w-[250px] bg-[#1a1a1a] border-gray-800 rounded-md pl-9 text-sm h-9"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">/</div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded h-8 px-4">Sign up</Button>
            <Button className="bg-[#1a1a1a] hover:bg-[#252525] text-white border border-gray-800 rounded h-8 px-4">
              Sign in
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-6 px-4 max-w-7xl">
        {/* Season Banner */}
        <div className="relative mb-8">
          <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 z-10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 z-10">
            <ChevronRight className="h-5 w-5" />
          </button>
          <SeasonBanner />

          {/* Pagination Dots */}
          <div className="flex justify-center mt-4 space-x-1">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-gray-600"}`} />
            ))}
          </div>
        </div>

        {/* Market Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <MarketSection
            title="New"
            coins={[
              { symbol: "SUI", name: "Sui", price: 3.77, change: -2.39, icon: "blue" },
              { symbol: "J", name: "Jupiter", price: 0.2183, change: -2.63, icon: "teal" },
              { symbol: "MELANIA", name: "Melania", price: 0.329, change: -6.8, icon: "gray" },
              { symbol: "TRUMP", name: "Trump", price: 12.51, change: -1.97, icon: "yellow" },
              { symbol: "SONIC", name: "Sonic", price: 0.28849, change: -0.51, icon: "purple" },
            ]}
          />
          <MarketSection
            title="Top Gainers"
            coins={[
              { symbol: "PRCL", name: "Parcl", price: 0.1307, change: 13.26, icon: "white" },
              { symbol: "BLUR", name: "Blur", price: 0.11, change: 7.84, icon: "orange" },
              { symbol: "ENA", name: "ENA", price: 0.3813, change: 3.5, icon: "gray" },
              { symbol: "AAVE", name: "Aave", price: 228.65, change: 2.94, icon: "purple" },
              { symbol: "HONEY", name: "Honey", price: 0.02998, change: 1.59, icon: "blue" },
            ]}
          />
          <MarketSection
            title="Popular"
            coins={[
              { symbol: "SOL", name: "Solana", price: 166.88, change: -2.02, icon: "purple" },
              { symbol: "ETH", name: "Ethereum", price: 2508.65, change: -1.4, icon: "blue" },
              { symbol: "SUI", name: "Sui", price: 3.77, change: -2.39, icon: "blue" },
              { symbol: "BTC", name: "Bitcoin", price: 103375.4, change: -0.38, icon: "orange" },
              { symbol: "USDT", name: "Tether", price: 1.0, change: -0.01, icon: "teal" },
            ]}
          />
        </div>

        {/* Market Table */}
        <div className="bg-[#0f0f0f] rounded-lg border border-gray-800 overflow-hidden">
          <div className="border-b border-gray-800 p-4">
            <div className="flex space-x-6">
              <button className="text-white font-medium">Spot</button>
              <button className="text-gray-400">Futures</button>
              <button className="text-gray-400">Lend</button>
            </div>
          </div>
          <DashMarketTable />
        </div>
      </main>
    </div>
  )
}
