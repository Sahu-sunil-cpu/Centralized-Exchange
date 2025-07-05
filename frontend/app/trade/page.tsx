"use client"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, Minus, Plus } from "lucide-react"
import Link from "next/link"
import TradingViewChart from "../components/trading-view-chart"
import OrderBook from "../components/order-book"
import TradeForm from "../components/trade-form"
import { useEffect, useState } from "react"
import useSocket from "../hooks/useSocket"

export default function Page() {
const socket = useSocket();


  useEffect(() => {

    if(socket) {
      socket.onopen = (message) => {
        console.log("connected");
      }
      
      socket.onmessage = (msg) => {
        console.log(msg.data);
      }
    }
return () => {
  socket?.close();
}
  }, [])


  
if(!socket) {
  return <div>
    loading websocket .... .
  </div>
}


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
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded h-8 px-4" onClick={() => socket.send("signin")}>Sign up</Button>
            <Button className="bg-[#1a1a1a] hover:bg-[#252525] text-white border border-gray-800 rounded h-8 px-4">
              Sign in
            </Button>
          </div>
        </div>
      </header>

      {/* Trading Pair Info */}
      <div className="border-b border-gray-800 py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-full h-6 w-6 flex items-center justify-center mr-2">
                <span className="text-xs font-bold">S</span>
              </div>
              <span className="font-bold">SUI/USD</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-red-500 font-bold text-lg">3.6969</span>
                <div className="ml-4">
                  <div className="text-xs text-gray-400">24H Change</div>
                  <div className="text-red-500 text-sm">-0.219% -5.60%</div>
                </div>
                <div className="ml-4">
                  <div className="text-xs text-gray-400">24H High</div>
                  <div className="text-sm">3.9456</div>
                </div>
                <div className="ml-4">
                  <div className="text-xs text-gray-400">24H Low</div>
                  <div className="text-sm">3.6868</div>
                </div>
                <div className="ml-4">
                  <div className="text-xs text-gray-400">24H Volume (USD)</div>
                  <div className="text-sm">7,713,984.74</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded h-8 px-6">Buy</Button>
            <Button className="bg-[#1a1a1a] hover:bg-[#252525] text-white border border-gray-800 rounded h-8 px-6">
              Sell
            </Button>
          </div>
        </div>
      </div>

      {/* Main Trading Area */}
      <div className="flex flex-1">
        {/* Left Side - Chart */}
        <div className="flex-2 border-r border-gray-800">
          <div className="border-b border-gray-800 px-4 py-2">
            <div className="flex items-center space-x-6">
              <Tabs defaultValue="chart" className="w-auto">
                <TabsList className="bg-transparent p-0">
                  <TabsTrigger
                    value="chart"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
                  >
                    Chart
                  </TabsTrigger>
                  <TabsTrigger
                    value="depth"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
                  >
                    Depth
                  </TabsTrigger>
                  <TabsTrigger
                    value="margin"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
                  >
                    Margin
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="p-2 h-[calc(100%-40px)]">
            <TradingViewChart />
          </div>
        </div>

        {/* Right Side - Order Book & Trade Form */}
        <div className="w-[650px] flex flex-col">
          <div className="flex h-[calc(100%-200px)]">
            {/* Order Book */}
            <div className="w-1/2 border-r border-gray-800">
              <div className="border-b border-gray-800 px-4 py-2">
                <Tabs defaultValue="book" className="w-auto">
                  <TabsList className="bg-transparent p-0">
                    <TabsTrigger
                      value="book"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
                    >
                      Book
                    </TabsTrigger>
                    <TabsTrigger
                      value="trades"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
                    >
                      Trades
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-gray-400">0.0001</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <OrderBook />
            </div>

            {/* Trade Form */}
            <div className="w-1/2">
              <div className="border-b border-gray-800 px-4 py-2">
                <Tabs defaultValue="limit" className="w-auto">
                  <TabsList className="bg-transparent p-0">
                    <TabsTrigger
                      value="limit"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
                    >
                      Limit
                    </TabsTrigger>
                    <TabsTrigger
                      value="market"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
                    >
                      Market
                    </TabsTrigger>
                    <TabsTrigger
                      value="conditional"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-2 h-auto"
                    >
                      Conditional
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <TradeForm />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-gray-800 p-2 mt-auto">
            <div className="flex items-center space-x-6 text-xs">
              <button className="px-3 py-1 bg-[#1a1a1a] rounded">Balances</button>
              <button className="px-3 py-1">Positions</button>
              <button className="px-3 py-1">Borrows</button>
              <button className="px-3 py-1">Open Orders</button>
              <button className="px-3 py-1">Fill History</button>
              <button className="px-3 py-1">Order History</button>
              <button className="px-3 py-1">Position History</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <div className="p-4 text-center text-gray-400 text-sm">
        Please{" "}
        <Link href="/sign-in" className="text-blue-400 hover:underline">
          sign in
        </Link>{" "}
        or{" "}
        <Link href="/sign-up" className="text-blue-400 hover:underline">
          sign up
        </Link>{" "}
        first.
      </div>
    </div>
  )
}
