"use client"

import { Button } from "@/components/ui/button"

export default function SeasonBanner() {
  return (
    <div className="relative h-[220px] rounded-lg overflow-hidden">
      {/* Background with animated coins */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* This would be replaced with actual animated coins in production */}
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 shadow-lg transform rotate-12 animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <div className="w-full h-full rounded-full border-4 border-yellow-300 flex items-center justify-center">
                  <div className="w-8 h-4 bg-yellow-300 rounded-sm"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center p-8">
        <h2 className="text-4xl font-bold mb-2">Welcome to Season 1</h2>
        <p className="text-lg mb-6">Trade on Backpack to earn points and increase your rank.</p>
        <div>
          <Button className="bg-white text-black hover:bg-gray-200 font-medium px-6">View Points</Button>
        </div>
      </div>
    </div>
  )
}
