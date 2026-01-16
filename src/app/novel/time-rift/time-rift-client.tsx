"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { cn } from "@/lib/utils"
import { MinigameContainer, MinigameResult } from "./minigames"

// --- Types & Constants ---
type Point = { x: number; y: number }
type GamePhase = 'EXPLORE' | 'ESCAPE' | 'WON' | 'GAME_OVER' | 'HACKING'
type EntityType = 'PLAYER' | 'ENEMY' | 'NPC' | 'ITEM'

const CELL_SIZE = 40 
const VIEW_RADIUS = 9 
const MAP_SIZE = 60 // Expanded map

const START_POS: Point = { x: 2, y: 2 }
const EXIT_POS: Point = { x: 55, y: 55 }

// RPG Data
const ITEMS = {
  DATA_FRAG: { id: 'data_frag', name: 'Memory Fragment', desc: 'Corrupted data.' }
}

const NPCS = [
  { 
    id: 'guide', 
    x: 30, y: 30, 
    name: 'The Uploader', 
    dialogue: {
        intro: ["I need 5 Data Fragments to open the gateway.", "The timeline is unstable.", "Collect them all."],
        completed: ["Data uplink established.", "EXIT PROTOCOL: ACTIVATED.", "RUN!"],
        hasItem: ["Fragment processed...", "Need more data."]
    },
    reqItem: null,
    reward: null
  }
]

// Items config
const TOTAL_FRAGMENTS = 5
const FRAGMENT_LOCATIONS = [
  { x: 10, y: 10, id: 'frag_1' }, // Snake
  { x: 50, y: 10, id: 'frag_2' }, // Sliding
  { x: 10, y: 50, id: 'frag_3' }, // Memory
  { x: 50, y: 50, id: 'frag_4' }, // Simon
  { x: 30, y: 10, id: 'frag_5' }, // Timing
]

// Dynamic Terrain Config
const PHASE_DURATION = 3000 
const WARNING_DURATION = 1000 

export function TimeRiftClient() {
  // --- State ---
  const [playerPos, setPlayerPos] = useState<Point>(START_POS)
  const [prevPos, setPrevPos] = useState<Point>(START_POS) // For rollback
  const [gamePhase, setGamePhase] = useState<GamePhase>('EXPLORE')
  const [collectedFrags, setCollectedFrags] = useState<string[]>([])
  const [enemies, setEnemies] = useState<Point[]>([])
  
  // Time & Environment
  const [timePhase, setTimePhase] = useState(0)
  const [isWarning, setIsWarning] = useState(false)
  const [escapeTimer, setEscapeTimer] = useState<number | null>(null) // null = inactive
  
  // UI
  const [showTutorial, setShowTutorial] = useState(true)
  const [backdoorHidden, setBackdoorHidden] = useState(false)
  const [inventory, setInventory] = useState<string[]>([])
  const [dialogue, setDialogue] = useState<{show: boolean, text: string, npcId?: string} | null>(null)
  
  // Minigame State
  const [pendingItem, setPendingItem] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // --- Init ---
  useEffect(() => {
    const timer = setTimeout(() => setBackdoorHidden(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  // --- Path Connectivity Logic ---
  // Helper to check if a point is on the "Critical Path" connecting objectives
  const isOnCorridor = useCallback((x: number, y: number) => {
    // Define the sequence of points to connect: Start -> NPCs -> Fragments -> Exit
    const points = [
      START_POS, 
      { x: NPCS[0].x, y: NPCS[0].y }, 
      ...FRAGMENT_LOCATIONS,
      EXIT_POS
    ]

    const CORRIDOR_WIDTH = 1 

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i]
      const p2 = points[i+1]
      
      const minX = Math.min(p1.x, p2.x)
      const maxX = Math.max(p1.x, p2.x)
      if (x >= minX && x <= maxX && Math.abs(y - p1.y) <= CORRIDOR_WIDTH) return true
      
      const minY = Math.min(p1.y, p2.y)
      const maxY = Math.max(p1.y, p2.y)
      if (y >= minY && y <= maxY && Math.abs(x - p2.x) <= CORRIDOR_WIDTH) return true
    }
    return false
  }, [])

  // --- Map Logic ---
  // 0=Path, 1=StaticWall, 2=ClosedWall, 3=OpenWall, 9=Exit
  const getCellType = useCallback((x: number, y: number, phase: number) => {
    if (x < 0 || y < 0 || x >= MAP_SIZE || y >= MAP_SIZE) return 1
    
    // Exit only appears in ESCAPE phase
    if (gamePhase === 'ESCAPE' && x === EXIT_POS.x && y === EXIT_POS.y) return 9
    if (x === START_POS.x && y === START_POS.y) return 0
    
    // Check NPC locations - always safe
    if (NPCS.some(n => n.x === x && n.y === y)) return 0

    // Procedural Gen
    const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
    const rand = seed - Math.floor(seed)
    
    const onCorridor = isOnCorridor(x, y)

    // Dynamic Terrain - More Frequent Now
    // We want a "shifting labyrinth" feel, so more dynamic walls
    const dynamicThreshold = onCorridor ? 0.8 : 0.4 // 60% dynamic in wild, 20% in corridor
    const isDynamic = (x + y) % 3 === 0 && rand > dynamicThreshold // Increased frequency pattern
    
    if (isDynamic) {
      const localPhaseOffset = (x * y) % 3
      // Phase cycle: 0=Open, 1=Closed, 2=Open (2/3 Open time)
      const state = (phase + localPhaseOffset) % 3
      const isOpen = state !== 1 
      return isOpen ? 3 : 2
    }

    if (onCorridor) {
        return 0 
    }

    // Static Walls
    // Reduced static walls to allow more open exploration
    const isWall = rand > 0.85 || (Math.sin(x / 4) * Math.cos(y / 4)) > 0.7
    return isWall ? 1 : 0
  }, [gamePhase, isOnCorridor])

  // --- Enemy AI (The "Time Eaters") ---
  useEffect(() => {
    if (gamePhase === 'WON' || gamePhase === 'GAME_OVER' || gamePhase === 'HACKING' || showTutorial) return

    // Spawn enemies if none exist
    if (enemies.length === 0) {
      const newEnemies: Point[] = []
      let attempts = 0
      while (newEnemies.length < 3 && attempts < 100) {
        attempts++
        const ex = Math.floor(Math.random() * MAP_SIZE)
        const ey = Math.floor(Math.random() * MAP_SIZE)
        
        // 1. Distance Check (Safe Zone around Player)
        const dist = Math.sqrt(Math.pow(ex - playerPos.x, 2) + Math.pow(ey - playerPos.y, 2))
        if (dist < 15) continue

        // 2. Wall Check (Don't spawn in walls)
        if (getCellType(ex, ey, 0) === 1) continue

        newEnemies.push({ x: ex, y: ey })
      }
      // Fallback
      if (newEnemies.length === 0) {
         newEnemies.push({ x: 40, y: 40 }, { x: 40, y: 10 }, { x: 10, y: 40 })
      }
      setTimeout(() => setEnemies(newEnemies), 0)
    }
  }, [gamePhase, showTutorial, enemies.length, playerPos, getCellType])

  useEffect(() => {
    if (gamePhase === 'WON' || gamePhase === 'GAME_OVER' || gamePhase === 'HACKING' || showTutorial) return

    const moveInterval = setInterval(() => {
      setEnemies(prevEnemies => {
        return prevEnemies.map(enemy => {
          // Simple chase logic
          let dx = 0
          let dy = 0
          
          if (playerPos.x > enemy.x) dx = 1
          else if (playerPos.x < enemy.x) dx = -1
          
          if (playerPos.y > enemy.y) dy = 1
          else if (playerPos.y < enemy.y) dy = -1

          // Try moving X first
          let nextX = enemy.x + dx
          let nextY = enemy.y
          
          // Enemies can pass through Dynamic Walls (Ghost-like) but not Static Walls
          if (getCellType(nextX, nextY, timePhase) === 1) {
            // Try Y if X blocked
            nextX = enemy.x
            nextY = enemy.y + dy
            if (getCellType(nextX, nextY, timePhase) === 1) {
               return enemy // Stuck
            }
          } else if (Math.random() > 0.5) {
             // Randomly prioritize Y movement for variety
             nextX = enemy.x
             nextY = enemy.y + dy
             if (getCellType(nextX, nextY, timePhase) === 1) {
                nextX = enemy.x + dx
                nextY = enemy.y
             }
          }

          // Collision with player
          if (nextX === playerPos.x && nextY === playerPos.y) {
            // Handle collision in the collision effect, but we can also set it here if we want immediate feedback
            // But let's leave it to the collision effect to avoid duplicate state updates or sync issues
          }

          return { x: nextX, y: nextY }
        })
      })
    }, gamePhase === 'ESCAPE' ? 250 : 400) // FASTER in ESCAPE mode

    return () => clearInterval(moveInterval)
  }, [playerPos, gamePhase, timePhase, showTutorial, getCellType])

  // --- Game Loop (Time & Collapse) ---
  useEffect(() => {
    if (gamePhase === 'WON' || gamePhase === 'GAME_OVER' || gamePhase === 'HACKING') return

    const timer = setInterval(() => {
      const now = Date.now()
      const cyclePos = now % PHASE_DURATION
      const phase = Math.floor(now / PHASE_DURATION)
      
      const warning = cyclePos > (PHASE_DURATION - WARNING_DURATION)
      setIsWarning(warning)
      if (phase !== timePhase) setTimePhase(phase)

      // Escape Timer
      if (gamePhase === 'ESCAPE' && escapeTimer !== null) {
        setEscapeTimer(prev => {
          if (prev && prev <= 0) {
            setGamePhase('GAME_OVER')
            return 0
          }
          return (prev || 0) - 0.1
        })
      }
    }, 100)
    return () => clearInterval(timer)
  }, [timePhase, gamePhase, escapeTimer])

  // --- Player Collision & Logic ---
  useEffect(() => {
    if (gamePhase === 'WON' || gamePhase === 'GAME_OVER' || gamePhase === 'HACKING') return

    // 1. Terrain Kill
    const cellType = getCellType(playerPos.x, playerPos.y, timePhase)
    if (cellType === 2) {
      setTimeout(() => setGamePhase('GAME_OVER'), 0)
      return
    }

    // 2. Enemy Kill
    if (enemies.some(e => e.x === playerPos.x && e.y === playerPos.y)) {
      setTimeout(() => setGamePhase('GAME_OVER'), 0)
      return
    }

    // 3. Item/Fragment Collection
    const itemHere = FRAGMENT_LOCATIONS.find(f => f.x === playerPos.x && f.y === playerPos.y)
    
    // Handle Fragments (Game Progression)
    if (itemHere && itemHere.id.startsWith('frag_') && !collectedFrags.includes(itemHere.id)) {
      setTimeout(() => {
        setGamePhase('HACKING')
        setPendingItem(itemHere.id)
      }, 0)
      return
    }

    // 4. Win Condition
    if (gamePhase === 'ESCAPE' && cellType === 9) {
      setTimeout(() => setGamePhase('WON'), 0)
    }

  }, [playerPos, timePhase, gamePhase, collectedFrags, enemies, getCellType, inventory])

  // --- Interaction (NPCs) ---
  const handleInteraction = useCallback(() => {
    // Check neighbors for NPC
    const neighbors = [
      { x: playerPos.x + 1, y: playerPos.y },
      { x: playerPos.x - 1, y: playerPos.y },
      { x: playerPos.x, y: playerPos.y + 1 },
      { x: playerPos.x, y: playerPos.y - 1 },
    ]

    const npc = NPCS.find(n => neighbors.some(nb => nb.x === n.x && nb.y === n.y))
    
    if (npc) {
      let textLines: string[] = npc.dialogue.intro || ["..."]
      let text = ""

      if (gamePhase === 'ESCAPE') {
           textLines = ["RUN!", "The collapse is imminent!"]
      } else if (collectedFrags.length === TOTAL_FRAGMENTS) {
           // Complete
           textLines = npc.dialogue.completed || ["Done."]
           setGamePhase('ESCAPE')
           setEscapeTimer(60)
      } else if (collectedFrags.length > 0) {
           // Progress
           textLines = npc.dialogue.hasItem || ["More data."]
           text = `I need ${TOTAL_FRAGMENTS - collectedFrags.length} more fragments.`
      } else {
           // Intro
           textLines = npc.dialogue.intro
      }

      if (!text) text = textLines[Math.floor(Math.random() * textLines.length)]
      setDialogue({ show: true, text, npcId: npc.id })
    }
  }, [playerPos, collectedFrags, gamePhase])

  // --- Movement ---
  const move = useCallback((dx: number, dy: number) => {
    if (gamePhase === 'WON' || gamePhase === 'GAME_OVER' || gamePhase === 'HACKING' || showTutorial) return
    if (dialogue?.show) return // Lock movement during dialogue

    setPlayerPos(prev => {
      const nextX = prev.x + dx
      const nextY = prev.y + dy
      
      // Collision with NPC
      if (NPCS.some(n => n.x === nextX && n.y === nextY)) return prev

      const cellType = getCellType(nextX, nextY, timePhase)
      
      if (cellType === 1 || cellType === 2) return prev
      
      setPrevPos(prev) // Save valid previous position
      return { x: nextX, y: nextY }
    })
  }, [gamePhase, timePhase, showTutorial, getCellType, dialogue])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp','w','W'].includes(e.key)) move(0, -1)
      if (['ArrowDown','s','S'].includes(e.key)) move(0, 1)
      if (['ArrowLeft','a','A'].includes(e.key)) move(-1, 0)
      if (['ArrowRight','d','D'].includes(e.key)) move(1, 0)
      if (['e','E'].includes(e.key)) handleInteraction()
      if (['Escape'].includes(e.key)) setDialogue(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [move, handleInteraction])

  // --- Viewport ---
  const viewportCells = useMemo(() => {
    const cells = []
    for (let dy = -VIEW_RADIUS; dy <= VIEW_RADIUS; dy++) {
      for (let dx = -VIEW_RADIUS; dx <= VIEW_RADIUS; dx++) {
        const x = playerPos.x + dx
        const y = playerPos.y + dy
        const type = getCellType(x, y, timePhase)
        
        // Check for dynamic entities at this position
        // Fragments/Items
        const itemObj = FRAGMENT_LOCATIONS.find(f => f.x === x && f.y === y)
        const hasFragment = itemObj && itemObj.id.startsWith('frag_') && !collectedFrags.includes(itemObj.id)
        const hasItem = itemObj && itemObj.itemId && !inventory.includes(itemObj.itemId)
        
        const hasEnemy = enemies.some(e => e.x === x && e.y === y)
        const hasNPC = NPCS.find(n => n.x === x && n.y === y)
        
        cells.push({ x, y, dx, dy, type, hasFragment, hasItem, hasEnemy, hasNPC })
      }
    }
    return cells
  }, [playerPos, timePhase, collectedFrags, inventory, enemies, getCellType])

  // --- Helpers ---
  const teleportToNextObjective = () => {
    if (gamePhase === 'EXPLORE') {
      const nextFrag = FRAGMENT_LOCATIONS.find(f => !collectedFrags.includes(f.id))
      if (nextFrag) setPlayerPos({ x: nextFrag.x - 1, y: nextFrag.y })
    } else {
      setPlayerPos({ x: EXIT_POS.x - 1, y: EXIT_POS.y })
    }
    setShowTutorial(false)
  }

  const handleMinigameComplete = (result: MinigameResult) => {
    if (result === 'SUCCESS' && pendingItem) {
      // Add Item
      const newCollection = [...collectedFrags, pendingItem]
      setCollectedFrags(newCollection)
      setGamePhase('EXPLORE')
    } else {
      // Failed or Cancelled - Rollback player
      setPlayerPos(prevPos)
      setGamePhase('EXPLORE')
    }
    setPendingItem(null)
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black overflow-hidden font-mono select-none text-green-500 flex items-center justify-center">
      
      {/* --- HUD --- */}
      {/* Top Left: Phase */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
          <div className="text-[10px] text-green-600 mb-1">TERRAIN STATUS</div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isWarning ? "bg-yellow-500 animate-ping" : "bg-green-500")} />
            <span className={cn("font-bold text-sm", isWarning ? "text-yellow-500" : "text-green-400")}>
              {isWarning ? "SHIFTING..." : "STABLE"}
            </span>
          </div>
      </div>

      {/* Top Center: Objective (Key Feature) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center">
          <div className="bg-black/80 border border-green-900 px-6 py-2 rounded-sm backdrop-blur-sm">
             {gamePhase === 'EXPLORE' ? (
               <>
                 <div className="text-[10px] text-green-600 mb-1 tracking-widest uppercase">Current Objective</div>
                 <div className="text-green-400 font-bold flex items-center gap-2">
                   <span>FIND DATA FRAGMENTS</span>
                   <span className="text-white bg-green-900 px-2 rounded text-sm">
                     {collectedFrags.length} / {TOTAL_FRAGMENTS}
                   </span>
                 </div>
               </>
             ) : gamePhase === 'ESCAPE' ? (
               <>
                 <div className="text-[10px] text-red-500 mb-1 tracking-widest uppercase animate-pulse">TIMELINE COLLAPSE</div>
                 <div className="text-red-500 font-bold text-2xl tabular-nums">
                   {escapeTimer?.toFixed(1)}s
                 </div>
                 <div className="text-[10px] text-red-400 mt-1">REACH THE EXIT SECTOR</div>
               </>
             ) : null}
          </div>
      </div>

      {/* Top Right: Location */}
      <div className="absolute top-4 right-4 z-30 pointer-events-none text-right">
           <div className="text-[10px] text-green-600 mb-1">COORDINATES</div>
           <div className="text-green-400 font-mono text-sm">
             X:{playerPos.x} Y:{playerPos.y}
           </div>
      </div>

      {/* Inventory (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
        <div className="text-[10px] text-green-600 mb-1">INVENTORY</div>
        <div className="flex gap-2">
          {inventory.length === 0 && <div className="text-green-900 text-xs">EMPTY</div>}
          {inventory.map(itemId => (
            <div key={itemId} className="w-8 h-8 border border-green-500 bg-green-900/20 flex items-center justify-center" title={Object.values(ITEMS).find(i => i.id === itemId)?.name || itemId}>
               <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Prompt */}
      {NPCS.some(n => Math.abs(n.x - playerPos.x) + Math.abs(n.y - playerPos.y) === 1) && !dialogue?.show && (
         <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 animate-bounce">
            <div className="bg-black border border-white text-white px-4 py-1 text-sm font-bold">
               PRESS [E] TO INTERACT
            </div>
         </div>
      )}

      {/* --- Viewport --- */}
      <div 
        className={cn(
          "relative transition-all duration-500",
          gamePhase === 'ESCAPE' ? "shadow-[0_0_100px_rgba(255,0,0,0.2)]" : ""
        )}
        style={{ width: `${(VIEW_RADIUS * 2 + 1) * CELL_SIZE}px`, height: `${(VIEW_RADIUS * 2 + 1) * CELL_SIZE}px` }}
      >
        <div className="absolute inset-0 grid"
             style={{
               gridTemplateColumns: `repeat(${VIEW_RADIUS * 2 + 1}, ${CELL_SIZE}px)`,
               gridTemplateRows: `repeat(${VIEW_RADIUS * 2 + 1}, ${CELL_SIZE}px)`
             }}
        >
          {viewportCells.map((cell) => {
            const isPlayer = cell.dx === 0 && cell.dy === 0
            let bgClass = "bg-black"
            
            if (cell.type === 1) bgClass = "bg-green-900/20 border border-green-900/30"
            if (cell.type === 2) bgClass = "bg-red-900/40 border border-red-500/50"
            if (cell.type === 3) bgClass = isWarning ? "bg-yellow-900/20 border border-yellow-500/30" : "bg-green-500/5 border border-green-500/10"
            if (cell.type === 9) bgClass = "bg-white/10 border border-white animate-pulse" // Exit

            return (
              <div key={`${cell.x},${cell.y}`} className={cn("relative flex items-center justify-center", bgClass)}>
                {/* Fragment */}
                {cell.hasFragment && (
                  <div className="w-3 h-3 bg-cyan-400 rotate-45 animate-spin shadow-[0_0_10px_cyan]" />
                )}

                {/* RPG Item */}
                {cell.hasItem && (
                   <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_yellow]" />
                )}

                {/* NPC */}
                {cell.hasNPC && (
                   <div className="w-6 h-6 bg-purple-500 rounded-sm flex items-center justify-center border border-purple-300">
                      <span className="text-[10px] text-white font-bold">?</span>
                   </div>
                )}
                
                {/* Enemy */}
                {cell.hasEnemy && (
                  <div className="w-8 h-8 rounded-full border-2 border-red-600 bg-red-900/80 flex items-center justify-center shadow-[0_0_20px_red] z-10">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </div>
                )}

                {/* Player */}
                {isPlayer && (
                  <div className={cn(
                    "w-5 h-5 rounded-sm z-20 shadow-[0_0_15px_currentColor]",
                    gamePhase === 'ESCAPE' ? "bg-white text-white" : "bg-green-400 text-green-400"
                  )} />
                )}

                {/* Exit Marker */}
                {cell.type === 9 && <div className="text-[8px] text-white absolute bottom-1">EXIT</div>}
              </div>
            )
          })}
        </div>
        
        {/* Fog */}
        <div className="absolute inset-0 pointer-events-none z-20"
             style={{ background: `radial-gradient(circle at center, transparent ${CELL_SIZE * 4}px, black ${CELL_SIZE * 9}px)` }}
        />
      </div>

      {/* --- Dialogue Modal --- */}
      {dialogue?.show && (
         <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
             <div className="w-full max-w-2xl bg-black border border-white p-6 relative">
                <div className="absolute -top-3 left-4 bg-black px-2 text-purple-400 font-bold border border-purple-500">
                   {NPCS.find(n => n.id === dialogue.npcId)?.name || 'UNKNOWN SIGNAL'}
                </div>
                <p className="text-xl text-white font-mono leading-relaxed my-4 typing-effect">
                   {dialogue.text}
                </p>
                <div className="flex justify-end mt-6">
                   <button 
                      onClick={() => setDialogue(null)}
                      className="px-4 py-1 bg-white text-black hover:bg-gray-200 font-bold text-sm"
                   >
                      CLOSE [ESC]
                   </button>
                </div>
             </div>
         </div>
      )}

      {/* --- Minigame Overlay --- */}
      {gamePhase === 'HACKING' && (
         <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm">
             <MinigameContainer type={pendingItem || 'frag_1'} onComplete={handleMinigameComplete} />
         </div>
      )}

      {/* --- Overlays --- */}
      {(showTutorial || gamePhase === 'GAME_OVER' || gamePhase === 'WON') && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="max-w-md w-full border border-green-500 bg-black p-8 text-center space-y-6">
            
            {showTutorial && gamePhase === 'EXPLORE' && (
              <>
                <h2 className="text-2xl font-bold text-green-400 tracking-widest mb-4">TEMPORAL PROTOCOL</h2>
                <div className="text-sm text-green-300/80 space-y-3 text-left">
                  <p>1. <span className="text-cyan-400 font-bold">COLLECT</span>: Find 3 Data Fragments scattered in the maze.</p>
                  <p>2. <span className="text-red-400 font-bold">AVOID</span>: &quot;Time Eaters&quot; (Red Orbs) hunt you. They can pass through time-walls.</p>
                  <p>3. <span className="text-yellow-400 font-bold">ADAPT</span>: Terrain shifts every 3s. Don&apos;t get crushed.</p>
                  <p>4. <span className="text-white font-bold">ESCAPE</span>: Once data is secured, the timeline will collapse. Run to the exit.</p>
                </div>
                <button onClick={() => setShowTutorial(false)} className="w-full py-3 bg-green-900/50 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold uppercase mt-4">
                  INITIALIZE
                </button>
              </>
            )}

            {gamePhase === 'GAME_OVER' && (
              <>
                <h2 className="text-4xl font-bold text-red-600 glitch-text">SIGNAL LOST</h2>
                <p className="text-red-400">
                  {enemies.some(e => e.x === playerPos.x && e.y === playerPos.y) 
                    ? "Consumed by a Time Eater." 
                    : escapeTimer && escapeTimer <= 0 
                      ? "Timeline collapsed."
                      : "Crushed by shifting terrain."}
                </p>
                <button onClick={() => window.location.reload()} className="px-8 py-2 bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black uppercase font-bold">
                  REBOOT TIMELINE
                </button>
              </>
            )}

            {gamePhase === 'WON' && (
              <>
                <h2 className="text-3xl font-bold text-white mb-2">MISSION ACCOMPLISHED</h2>
                <p className="text-green-400 text-sm mb-6">Data secured before collapse.</p>
                <div className="p-4 border border-green-500/30 bg-green-900/10 mb-4">
                  <code className="text-lg text-white select-all">flag&#123;run_lola_run_404&#125;</code>
                </div>
                <button onClick={() => window.location.reload()} className="text-xs text-gray-500 hover:text-white">RETURN TO MENU</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Dev Backdoor */}
      <div className={cn(
        "absolute bottom-6 right-6 z-[60] transition-opacity duration-1000",
        backdoorHidden ? "opacity-10 hover:opacity-100" : "opacity-100"
      )}>
        <button
          onClick={teleportToNextObjective}
          className="w-4 h-4 bg-red-500/20 border border-red-500 rounded-full shadow-[0_0_10px_red] hover:bg-red-500 transition-colors"
          title="DEV: WARP TO NEXT OBJECTIVE"
        />
      </div>

    </div>
  )
}
