"use client"

import { useEffect, useRef } from "react"

export default function TradingViewChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    chartRef.current.width = chartRef.current.offsetWidth * window.devicePixelRatio
    chartRef.current.height = chartRef.current.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Sample data for candlestick chart
    const candlesticks = [
      { time: 1, open: 3.75, high: 3.85, low: 3.72, close: 3.82, volume: 1000 },
      { time: 2, open: 3.82, high: 3.87, low: 3.78, close: 3.79, volume: 1200 },
      { time: 3, open: 3.79, high: 3.84, low: 3.76, close: 3.83, volume: 800 },
      { time: 4, open: 3.83, high: 3.89, low: 3.8, close: 3.85, volume: 1500 },
      { time: 5, open: 3.85, high: 3.92, low: 3.83, close: 3.88, volume: 2000 },
      { time: 6, open: 3.88, high: 3.94, low: 3.86, close: 3.9, volume: 1800 },
      { time: 7, open: 3.9, high: 3.95, low: 3.87, close: 3.89, volume: 1600 },
      { time: 8, open: 3.89, high: 3.93, low: 3.84, close: 3.86, volume: 1400 },
      { time: 9, open: 3.86, high: 3.91, low: 3.82, close: 3.84, volume: 1300 },
      { time: 10, open: 3.84, high: 3.89, low: 3.8, close: 3.82, volume: 1100 },
      { time: 11, open: 3.82, high: 3.87, low: 3.78, close: 3.8, volume: 900 },
      { time: 12, open: 3.8, high: 3.85, low: 3.76, close: 3.78, volume: 700 },
      { time: 13, open: 3.78, high: 3.83, low: 3.74, close: 3.76, volume: 600 },
      { time: 14, open: 3.76, high: 3.81, low: 3.72, close: 3.74, volume: 500 },
      { time: 15, open: 3.74, high: 3.79, low: 3.7, close: 3.72, volume: 400 },
      { time: 16, open: 3.72, high: 3.77, low: 3.68, close: 3.7, volume: 300 },
      { time: 17, open: 3.7, high: 3.75, low: 3.66, close: 3.68, volume: 200 },
      { time: 18, open: 3.68, high: 3.73, low: 3.64, close: 3.66, volume: 100 },
      { time: 19, open: 3.66, high: 3.71, low: 3.62, close: 3.64, volume: 150 },
      { time: 20, open: 3.64, high: 3.69, low: 3.6, close: 3.62, volume: 250 },
      { time: 21, open: 3.62, high: 3.67, low: 3.58, close: 3.6, volume: 350 },
      { time: 22, open: 3.6, high: 3.65, low: 3.56, close: 3.58, volume: 450 },
      { time: 23, open: 3.58, high: 3.63, low: 3.54, close: 3.56, volume: 550 },
      { time: 24, open: 3.56, high: 3.61, low: 3.52, close: 3.54, volume: 650 },
      { time: 25, open: 3.54, high: 3.59, low: 3.5, close: 3.52, volume: 750 },
      { time: 26, open: 3.52, high: 3.57, low: 3.48, close: 3.5, volume: 850 },
      { time: 27, open: 3.5, high: 3.55, low: 3.46, close: 3.48, volume: 950 },
      { time: 28, open: 3.48, high: 3.53, low: 3.44, close: 3.46, volume: 1050 },
      { time: 29, open: 3.46, high: 3.51, low: 3.42, close: 3.44, volume: 1150 },
      { time: 30, open: 3.44, high: 3.49, low: 3.4, close: 3.42, volume: 1250 },
      { time: 31, open: 3.42, high: 3.47, low: 3.38, close: 3.4, volume: 1350 },
      { time: 32, open: 3.4, high: 3.45, low: 3.36, close: 3.38, volume: 1450 },
      { time: 33, open: 3.38, high: 3.43, low: 3.34, close: 3.36, volume: 1550 },
      { time: 34, open: 3.36, high: 3.41, low: 3.32, close: 3.34, volume: 1650 },
      { time: 35, open: 3.34, high: 3.39, low: 3.3, close: 3.32, volume: 1750 },
      { time: 36, open: 3.32, high: 3.37, low: 3.28, close: 3.3, volume: 1850 },
      { time: 37, open: 3.3, high: 3.35, low: 3.26, close: 3.28, volume: 1950 },
      { time: 38, open: 3.28, high: 3.33, low: 3.24, close: 3.26, volume: 2050 },
      { time: 39, open: 3.26, high: 3.31, low: 3.22, close: 3.24, volume: 2150 },
      { time: 40, open: 3.24, high: 3.29, low: 3.2, close: 3.22, volume: 2250 },
      { time: 41, open: 3.22, high: 3.27, low: 3.18, close: 3.2, volume: 2350 },
      { time: 42, open: 3.2, high: 3.25, low: 3.16, close: 3.18, volume: 2450 },
      { time: 43, open: 3.18, high: 3.23, low: 3.14, close: 3.16, volume: 2550 },
      { time: 44, open: 3.16, high: 3.21, low: 3.12, close: 3.14, volume: 2650 },
      { time: 45, open: 3.14, high: 3.19, low: 3.1, close: 3.12, volume: 2750 },
      { time: 46, open: 3.12, high: 3.17, low: 3.08, close: 3.1, volume: 2850 },
      { time: 47, open: 3.1, high: 3.15, low: 3.06, close: 3.08, volume: 2950 },
      { time: 48, open: 3.08, high: 3.13, low: 3.04, close: 3.06, volume: 3050 },
      { time: 49, open: 3.06, high: 3.11, low: 3.02, close: 3.04, volume: 3150 },
      { time: 50, open: 3.04, high: 3.09, low: 3.0, close: 3.02, volume: 3250 },
    ]

    // Find min and max values for scaling
    const allPrices = candlesticks.flatMap((c) => [c.open, c.high, c.low, c.close])
    const minPrice = Math.min(...allPrices) * 0.99
    const maxPrice = Math.max(...allPrices) * 1.01
    const priceRange = maxPrice - minPrice

    // Chart dimensions
    const width = chartRef.current.offsetWidth
    const height = chartRef.current.offsetHeight
    const chartWidth = width - 60 // Leave space for y-axis labels
    const chartHeight = height - 30 // Leave space for x-axis labels
    const candleWidth = Math.max(Math.min((chartWidth / candlesticks.length) * 0.8, 12), 2)
    const candleSpacing = (chartWidth - candleWidth * candlesticks.length) / (candlesticks.length + 1)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#1a1a1a"
    ctx.lineWidth = 1

    // Horizontal grid lines
    const numHLines = 5
    for (let i = 0; i <= numHLines; i++) {
      const y = 10 + (i / numHLines) * chartHeight
      ctx.beginPath()
      ctx.moveTo(60, y)
      ctx.lineTo(width, y)
      ctx.stroke()

      // Price labels
      const price = maxPrice - (i / numHLines) * priceRange
      ctx.fillStyle = "#666"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(price.toFixed(4), 55, y + 3)
    }

    // Vertical grid lines
    const numVLines = 6
    for (let i = 0; i <= numVLines; i++) {
      const x = 60 + (i / numVLines) * chartWidth
      ctx.beginPath()
      ctx.moveTo(x, 10)
      ctx.lineTo(x, height - 20)
      ctx.stroke()

      // Date labels
      if (i < numVLines) {
        const dataIndex = Math.floor((i / numVLines) * candlesticks.length)
        ctx.fillStyle = "#666"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`${dataIndex + 1}`, x, height - 10)
      }
    }

    // Draw candlesticks
    candlesticks.forEach((candle, i) => {
      const x = 60 + candleSpacing * (i + 1) + candleWidth * i
      const openY = chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight + 10
      const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight + 10
      const highY = chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight + 10
      const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight + 10

      // Draw wick
      ctx.beginPath()
      ctx.moveTo(x + candleWidth / 2, highY)
      ctx.lineTo(x + candleWidth / 2, lowY)
      ctx.strokeStyle = candle.open > candle.close ? "#f44336" : "#4caf50"
      ctx.stroke()

      // Draw body
      ctx.fillStyle = candle.open > candle.close ? "#f44336" : "#4caf50"
      const bodyHeight = Math.abs(closeY - openY)
      const bodyY = Math.min(openY, closeY)
      ctx.fillRect(x, bodyY, candleWidth, bodyHeight || 1) // Ensure at least 1px height
    })

    // Draw SUI/USDT label
    ctx.fillStyle = "#fff"
    ctx.font = "bold 12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("SUI_USDT · 1h · Backpack", 65, 25)

    // Draw price info
    ctx.fillStyle = "#666"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("O: 3.847 H: 3.847 L: 3.704 C: 3.750 V: 0.189 (0.08%)", 250, 25)
  }, [])

  return (
    <div className="relative h-[400px] w-full">
      <canvas ref={chartRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
