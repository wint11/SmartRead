'use client'

import { cn } from "@/lib/utils"
import { useCtfGame } from "./hooks/use-ctf-game"
import { TerminalInterface } from "./components/terminal-interface"
import { Leaderboard } from "./components/leaderboard"

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
    solvedFlags
  } = useCtfGame()

  return (
    <div className="relative w-full h-[600px]" style={{ perspective: '1000px' }}>
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-1000",
        )}
        style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
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
            isActive={!isFlipped}
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
            isActive={isFlipped}
            user="root"
        />
      </div>

      {/* Leaderboard - Fixed Position, Hidden when flipped */}
      <Leaderboard solvedCount={solvedFlags.length} hidden={isFlipped} />

      {/* Flag 4: Hidden Element */}
      <div style={{ display: 'none' }} id="hidden-flag">
        flag&#123;hidden_in_plain_sight_9988&#125;
      </div>
    </div>
  )
}
