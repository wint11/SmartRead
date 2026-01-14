import React from 'react'
import { cn } from "@/lib/utils"

export function ShatteredEffect({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Cracks SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 0 L40 40 L20 100" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        <path d="M100 0 L60 30 L80 100" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        <path d="M0 100 L30 60 L100 80" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
        <path d="M50 50 L20 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
        <path d="M50 50 L80 0" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
        <path d="M50 50 L100 50" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
        <path d="M50 50 L0 80" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.2" />
      </svg>
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay animate-pulse" />
      
      {/* Shards (Simulated with clip-path blocks that shift) */}
      <div className="absolute inset-0 backdrop-blur-[1px] mix-blend-hard-light">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/5 rotate-12 transform" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white/5 -rotate-6 transform" />
      </div>

      {/* Message */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 font-bold text-4xl tracking-widest uppercase animate-bounce text-center drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
        System Failure<br/>
        <span className="text-sm">Too many errors</span>
      </div>
    </div>
  )
}
