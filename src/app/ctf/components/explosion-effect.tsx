import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function ExplosionEffect({ initialStage = 'explode' }: { initialStage?: 'explode' | 'aftermath' }) {
  const [stage, setStage] = useState<'explode' | 'aftermath'>(initialStage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Only set timer if starting from explode stage
    if (initialStage === 'explode') {
        // Switch to aftermath after explosion animation
        const timer = setTimeout(() => {
            setStage('aftermath')
        }, 2000)
        return () => clearTimeout(timer)
    }
  }, [initialStage])

  const handleRestart = () => {
      if (typeof window !== 'undefined') {
          // Clear bomb state
          localStorage.removeItem('ctf_bomb_state')
          // Optional: Clear flags too? 
          // localStorage.removeItem('ctf_solved') 
          // User request implies "restarting the level", so probably just resetting the bomb death state.
          window.location.reload()
      }
  }

  if (!mounted) return null

  // Helper to render into portal
  const renderPortal = (content: React.ReactNode) => {
      if (typeof document === 'undefined') return null
      return createPortal(content, document.body)
  }

  if (stage === 'aftermath') {
      return renderPortal(
          <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000">
              {/* Realistic Fire Effect */}
              {/* Primary Fire Base */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-orange-500 via-red-600 to-transparent opacity-90 animate-[fire-flicker_0.5s_infinite_alternate]" />
              
              {/* Secondary Fire Layers for Depth */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400 via-orange-500 to-transparent opacity-70 animate-[fire-flicker_0.7s_infinite_alternate-reverse]" style={{ animationDelay: '0.2s' }} />
              <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-red-900 via-transparent to-transparent opacity-60" />

              {/* Smoke / Haze */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent opacity-80" />

              {/* Intense Embers */}
              {Array.from({ length: 60 }).map((_, i) => (
                  <div 
                    key={i}
                    className="absolute rounded-full bg-orange-400 blur-[0.5px] animate-[rise-up_3s_ease-in_infinite]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: '-20px',
                        width: `${1 + Math.random() * 3}px`,
                        height: `${1 + Math.random() * 3}px`,
                        opacity: 0.8 + Math.random() * 0.2,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 3}s`
                    }}
                  />
              ))}

              {/* Final Text */}
              <div className="relative z-10 flex flex-col items-center space-y-12 animate-[fade-in-text_3s_ease-out_forwards]">
                  <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-200 to-gray-600 tracking-[1rem] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    GAME OVER
                  </div>
                  
                  {/* Restart Button - Minimalist Silver Icon */}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleRestart}
                    className="w-16 h-16 rounded-full text-gray-400 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-500"
                  >
                    <RotateCcw className="w-8 h-8" />
                  </Button>
              </div>
          </div>
      )
  }

  // Explosion Stage
  const particles = React.useMemo(() => Array.from({ length: 100 }).map((_, i) => {
    const seed = i
    const rand1 = Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1
    const rand2 = Math.abs(Math.sin(seed * 78.233) * 43758.5453) % 1
    const rand3 = Math.abs(Math.sin(seed * 45.123) * 43758.5453) % 1
    const rand4 = Math.abs(Math.sin(seed * 99.999) * 43758.5453) % 1
    const rand5 = Math.abs(Math.sin(seed * 11.111) * 43758.5453) % 1

    const angle = rand1 * 360
    const distance = 200 + rand2 * 1000 
    const size = 5 + rand3 * 40
    const delay = rand4 * 0.2
    const duration = 0.5 + rand5 * 0.5
    const color = rand1 > 0.3 ? '#ef4444' : '#fb923c' // Mostly Red, some Orange

    return {
      id: i,
      style: {
        left: '50%',
        top: '50%',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        '--angle': `${angle}deg`,
        '--dist': `${distance}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        boxShadow: `0 0 ${size * 4}px ${color}` // Larger glow
      } as React.CSSProperties
    }
  }), [])

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center">
       {/* Shockwave */}
       <div className="absolute inset-0 bg-white animate-explosion-shockwave" />
       
       {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-explosion-particle"
          style={p.style}
        />
      ))}
    </div>,
    document.body
  )
}