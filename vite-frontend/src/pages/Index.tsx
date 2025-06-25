
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown } from "lucide-react";
import { MarketCard } from '@/components/MarketCard';
import { TickerStrip } from '@/components/TickerStrip';
import { FloatingCoin } from '@/components/FloatingCoin';

// Mock market data
const generateMockMarkets = () => {
  const assets = [
    'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'SUI/USDT', 'DOGE/USDT', 'ADA/USDT',
    'DOT/USDT', 'LINK/USDT', 'AVAX/USDT', 'MATIC/USDT', 'UNI/USDT', 'ATOM/USDT'
  ];
  
  return assets.map(asset => {
    const basePrice = Math.random() * 1000 + 10;
    const change = (Math.random() - 0.5) * 20;
    const volume = Math.random() * 1000000000;
    
    return {
      symbol: asset,
      price: basePrice.toFixed(4),
      change: change.toFixed(2),
      high: (basePrice * 1.1).toFixed(4),
      low: (basePrice * 0.9).toFixed(4),
      volume: volume.toFixed(0),
      sparklineData: Array.from({ length: 20 }, () => Math.random() * 100)
    };
  });
};

const Index = () => {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState(generateMockMarkets());

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prev => prev.map(market => ({
        ...market,
        price: (parseFloat(market.price) + (Math.random() - 0.5) * 5).toFixed(4),
        change: (parseFloat(market.change) + (Math.random() - 0.5) * 2).toFixed(2)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      <TickerStrip />
      <FloatingCoin />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20"
            src="https://cdn.pixabay.com/video/2021/08/04/84668-588465361_large.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-1">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-white to-green-400 bg-clip-text text-transparent animate-fade-in">
            The Future of Trading
            <br />
            <span className="text-5xl md:text-6xl">Starts Here</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 animate-fade-in animation-delay-300">
            Trade Spot, Futures, and DeFi Markets in One Unified Interface
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-600">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/exchange/TATA_INR')}
            >
              Launch App
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => document.getElementById('markets')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Markets
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <ChevronDown className="w-8 h-8 text-cyan-400 animate-bounce" />
        </div>
      </section>

      {/* Markets Section */}
      <section id="markets" className="min-h-screen py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Live Markets
            </h2>
            <p className="text-xl text-slate-400">
              Real-time prices across all major cryptocurrencies
            </p>
          </div>

          {/* Markets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {markets.map((market, index) => (
              <MarketCard key={market.symbol} market={market} index={index} onClick={() => navigate(`/exchange/${market.symbol.replace("/", "_")}`)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
