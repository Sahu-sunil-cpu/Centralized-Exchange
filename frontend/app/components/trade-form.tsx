"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

export default function TradeForm() {
  const [price, setPrice] = useState("3.7297")
  const [quantity, setQuantity] = useState("0")
  const [sliderValue, setSliderValue] = useState(0)
  const [orderValue, setOrderValue] = useState("0")

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0])
    // In a real app, this would calculate the quantity based on available balance
    setQuantity(((value[0] / 100) * 10).toFixed(1))
    calculateOrderValue(price, ((value[0] / 100) * 10).toFixed(1))
  }

  const handlePriceChange = (value: string) => {
    setPrice(value)
    calculateOrderValue(value, quantity)
  }

  const handleQuantityChange = (value: string) => {
    setQuantity(value)
    calculateOrderValue(price, value)
  }

  const calculateOrderValue = (price: string, quantity: string) => {
    const priceNum = Number.parseFloat(price)
    const quantityNum = Number.parseFloat(quantity)

    if (!isNaN(priceNum) && !isNaN(quantityNum)) {
      setOrderValue((priceNum * quantityNum).toFixed(1))
    } else {
      setOrderValue("0")
    }
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs text-gray-400">Balance</div>
        <div className="text-xs">-</div>
      </div>

      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Price</span>
            <div className="flex space-x-2">
              <span className="text-gray-400">Mid</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">BBO</span>
            </div>
          </div>
          <div className="relative">
            <Input
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="bg-[#1a1a1a] border-gray-800 h-8 text-right pr-16"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">USD</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Quantity</span>
          </div>
          <div className="relative">
            <Input
              value={quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="bg-[#1a1a1a] border-gray-800 h-8 text-right pr-16"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">SUI</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">0</span>
            <span className="text-xs text-gray-400">100%</span>
          </div>
          <Slider value={[sliderValue]} onValueChange={handleSliderChange} max={100} step={1} className="py-1" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Order Value</span>
          </div>
          <div className="relative">
            <Input value={orderValue} readOnly className="bg-[#1a1a1a] border-gray-800 h-8 text-right pr-16" />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">USD</div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-10">Sign up to trade</Button>
        <Button className="w-full bg-transparent hover:bg-[#1a1a1a] text-white border-0 h-8">Sign in to trade</Button>
        <div className="flex items-center space-x-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="post-only" className="h-4 w-4 rounded border-gray-600" />
            <Label htmlFor="post-only" className="text-xs text-gray-400">
              Post Only
            </Label>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Checkbox id="ioc" className="h-4 w-4 rounded border-gray-600" />
            <Label htmlFor="ioc" className="text-xs text-gray-400">
              IOC
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
