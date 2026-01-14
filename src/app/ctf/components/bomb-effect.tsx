import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { ExplosionEffect } from './explosion-effect'

interface BombEffectProps {
  active: boolean
  timeLeft: number
  exploded: boolean
}

export function BombEffect({ active, timeLeft, exploded }: BombEffectProps) {
  // Use a ref to track if we were mounted with an exploded state initially
  const wasExplodedOnMount = React.useRef(exploded)

  if (!active) return null

  // If exploded, show the explosion effect overlay instead of the timer box
  if (exploded) {
      // If we started as exploded, skip the animation
      const startStage = wasExplodedOnMount.current ? 'aftermath' : 'explode'
      return <ExplosionEffect initialStage={startStage} />
  }

  // Format time as HH:MM:SS

  // Format time as HH:MM:SS
  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  const isCritical = timeLeft < 60 // Less than 1 minute
  const isWarning = timeLeft < 300 // Less than 5 minutes

  return (
    <div className={cn(
        "absolute top-4 right-4 z-50 p-4 rounded-lg border-2 font-mono transition-all duration-300",
        "bg-black/80 backdrop-blur-sm",
        isCritical ? "border-red-600 animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.6)]" : 
        isWarning ? "border-orange-500" : "border-red-900/50"
    )}>
        <div className="flex flex-col items-center">
            <div className={cn(
                "text-xs uppercase tracking-widest mb-1",
                isCritical ? "text-red-500 font-bold" : "text-red-500/70"
            )}>
                Self-Destruct Sequence
            </div>
            <div className={cn(
                "text-4xl font-bold tracking-widest tabular-nums",
                isCritical ? "text-red-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]" : 
                isWarning ? "text-orange-500" : "text-red-700"
            )}>
                {formattedTime}
            </div>
            {isCritical && (
                    <div className="text-[10px] text-red-500 mt-1 animate-pulse">
                    CRITICAL FAILURE IMMINENT
                    </div>
            )}
        </div>
    </div>
  )
}
