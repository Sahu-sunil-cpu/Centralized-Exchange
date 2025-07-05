
import React, { useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { orderData } from '@/lib/httpClient';
import axios from 'axios';

export const FloatingCoin: React.FC = () => {


  return (
    <div className="fixed top-20 right-8 z-20 animate-pulse">
      <div className="bg-gradient-to-r from-green-500 to-cyan-500 rounded-full p-4 shadow-2xl shadow-green-500/20 hover:scale-110 transition-transform duration-300">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-white font-bold text-sm">COIN OF DAY</div>
          <div className="text-white text-xs">SUI +127%</div>
        </div>
      </div>
    </div>
  );
};
