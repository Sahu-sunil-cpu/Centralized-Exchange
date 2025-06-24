
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopNavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-8">
        <div 
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate('/')}
        >
          CryptoX
        </div>
        
        <div className="flex items-center space-x-6">
          <Button variant="ghost" className="text-white hover:text-cyan-400">
            Spot
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-cyan-400">
            Futures
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-cyan-400">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet
          </Button>
          <Button variant="ghost" className="text-slate-400 hover:text-cyan-400">
            Support
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
          Connect Wallet
        </Button>
        <Button className="bg-slate-700 hover:bg-slate-600">
          <User className="w-4 h-4" />
        </Button>
      </div>
    </nav>
  );
};
