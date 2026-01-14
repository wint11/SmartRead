'use client'

import { cn } from "@/lib/utils"
import { useCtfGame } from "./hooks/use-ctf-game"
import { TerminalInterface } from "./components/terminal-interface"
import { Leaderboard } from "./components/leaderboard"
import { ShatteredEffect } from "./components/shattered-effect"
import { BombEffect } from "./components/bomb-effect"
import { TerminalShatter } from "./components/terminal-shatter"
import { useShatterMechanic } from "./gameplay/shatter"
import { useEffect } from "react"
import { setCtfCookie } from "./actions"

export function CtfChallenge() {
  const {
    history,
    input,
    setInput,
    handleKeyDown,
    isProcessing,
    activeTool,
    isDeepLayer,
    isFlipped,
    solvedFlags,
    commandNotFoundCount,
    bombState,
    resetGame,
    isInitialized
  } = useCtfGame()

  const { visualState, isShattered } = useShatterMechanic(commandNotFoundCount, resetGame)

  useEffect(() => {
    // Flag 13: Cookie
    setCtfCookie()
    
    // Flag 15: Console Log
    console.log("%cSTOP!", "color: red; font-size: 30px; font-weight: bold;")
    console.log("%cThis is a browser feature intended for developers.", "font-size: 16px;")
    console.log("If someone told you to copy-paste something here to enable a feature, it is a scam.")
    console.log("But since you are here for the CTF: flag{console_log_master_3344}")

    // Flag 17: Local Storage
    localStorage.setItem('debug_token', 'flag{local_storage_is_not_secret_5566}')
    
    // Trigger Hint Request for Flag 12
    fetch('/api/ctf/hint').catch(console.error)
  }, [])

  if (!isInitialized) return null

  const isBombCritical = bombState.active && bombState.timeLeft < 60 // Less than 1 min

  return (
    <div className="relative w-full h-[600px]" style={{ perspective: '1000px' }}>
      {/* Visual Effects */}
      {/* Show Overlay during failure message */}
      {visualState === 'system_failure' && <ShatteredEffect active={true} />}
      
      {/* Falling Shards - Only during shattering */}
      {visualState === 'shattering' && (
          <TerminalShatter>
             {/* Pass the current state of the terminal to be shattered */}
             <TerminalInterface 
                theme="dark"
                history={history}
                input={input}
                setInput={() => {}} // No-op
                onKeyDown={() => {}} // No-op
                isProcessing={false}
                activeTool={activeTool}
                isActive={true} // Render as active but static
                user="ctf-user"
                isSnapshot={true} // New prop to disable effects
            />
          </TerminalShatter>
      )}

      <BombEffect 
        active={bombState.active} 
        timeLeft={bombState.timeLeft} 
        exploded={bombState.exploded} 
      />

      {/* Main Terminal Container */}
      {/* Hide completely if shattering OR exploded */}
      {visualState !== 'shattering' && !bombState.exploded && (
      <div 
        className={cn(
          "relative w-full h-full",
          (isShattered || isBombCritical) && "animate-pulse"
        )}
        style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            // Hide terminal only when shattering starts (it turns into shards)
            // Also keep it hidden during recovering, until we switch to normal
            opacity: (visualState === 'shattering' || visualState === 'recovering') ? 0 : 1,
            // Apply distortion during system failure
            filter: visualState === 'system_failure' ? 'blur(2px) contrast(1.5) grayscale(0.8)' : (isShattered ? 'blur(1px) contrast(1.2)' : 'none'),
            // Instant hide for shattering, slow fade in for normal
            transition: visualState === 'shattering' ? 'none' : 'transform 1s ease-in-out, opacity 1s ease-out, filter 0.5s ease'
        }}
      >
        {/* Front Face: Surface Layer */}
        <TerminalInterface 
            theme="dark"
            history={history}
            input={input}
            setInput={setInput}
            onKeyDown={handleKeyDown}
            isProcessing={isProcessing}
            activeTool={activeTool}
            isActive={!isFlipped && visualState === 'normal'} // Disable input when not normal
            user="ctf-user"
        />
        
        {/* Back Face: Deep Layer (Root) */}
        <TerminalInterface 
            theme="red"
            history={history}
            input={input}
            setInput={setInput}
            onKeyDown={handleKeyDown}
            isProcessing={isProcessing}
            activeTool={activeTool}
            isActive={isFlipped && visualState === 'normal'}
            user="root"
        />
      </div>
      )}

      {/* New Terminal (Background Reveal) */}
      {/* 
         When visualState is 'recovering', we want to show the terminal fading in/scaling up.
         But since we reset the game state, the main terminal above will re-render with fresh state.
         We just need to handle the transition effect of it "appearing".
      */}
      {visualState === 'recovering' && (
         <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-green-500 font-mono animate-pulse">
                System Rebooting...
            </div>
         </div>
      )}

      {/* Leaderboard - Fixed Position, Hidden when flipped */}
      <Leaderboard solvedCount={solvedFlags.length} hidden={isFlipped} solvedFlags={solvedFlags} />

      {/* Flag 4: Hidden Element */}
      <div style={{ display: 'none' }} id="hidden-flag">
        flag&#123;hidden_in_plain_sight_9988&#125;
      </div>
    </div>
  )
}
