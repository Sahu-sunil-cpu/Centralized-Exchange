interface Coin {
    symbol: string
    name: string
    price: number
    change: number
    icon: string
  }
  
  interface MarketSectionProps {
    title: string
    coins: Coin[]
  }
  
  export default function MarketSection({ title, coins }: MarketSectionProps) {
    return (
      <div>
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        <div className="space-y-3">
          {coins.map((coin) => (
            <div key={coin.symbol} className="flex items-center justify-between">
              <div className="flex items-center">
                <CoinIcon type={coin.icon} symbol={coin.symbol} />
                <span className="ml-2 font-medium">{coin.symbol}</span>
              </div>
              <div className="flex flex-col items-end">
                <span>${formatPrice(coin.price)}</span>
                <span className={coin.change >= 0 ? "text-green-500" : "text-red-500"}>
                  {coin.change >= 0 ? "+" : ""}
                  {coin.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  function CoinIcon({ type, symbol }: { type: string; symbol: string }) {
    const getColor = () => {
      switch (type) {
        case "blue":
          return "bg-blue-500"
        case "teal":
          return "bg-teal-500"
        case "purple":
          return "bg-purple-500"
        case "orange":
          return "bg-orange-500"
        case "yellow":
          return "bg-yellow-500"
        case "gray":
          return "bg-gray-500"
        case "white":
          return "bg-white"
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
  
  function formatPrice(price: number): string {
    if (price >= 1000) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else if (price >= 1) {
      return price.toFixed(2)
    } else if (price >= 0.01) {
      return price.toFixed(4)
    } else {
      return price.toFixed(5)
    }
  }
  