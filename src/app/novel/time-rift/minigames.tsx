"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

// --- Types ---
export type MinigameResult = 'SUCCESS' | 'FAILURE' | 'CANCELLED'

interface MinigameProps {
  onComplete: (result: MinigameResult) => void
  difficulty?: number // 1-3?
}

// --- Sliding Puzzle (Huarong Dao variant) ---
// 3x3 Grid. 1-8 tiles. Target: Ordered 1-8.

const SOLVED_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0] // 0 is empty

export function SlidingPuzzle({ onComplete, difficulty = 1 }: MinigameProps) {
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isSolving, setIsSolving] = useState(false)

  // Init
  useEffect(() => {
    // Generate solvable puzzle
    const newTiles = [...SOLVED_STATE]
    
    // Shuffle by simulating valid moves to ensure solvability
    // Difficulty determines how many random moves we make from solved state
    const shuffleMoves = difficulty * 15 + 10 
    let emptyIdx = 8
    let lastIdx = -1

    const getNeighborsLocal = (index: number) => {
      const neighbors = []
      const row = Math.floor(index / 3)
      const col = index % 3

      if (row > 0) neighbors.push(index - 3) // Up
      if (row < 2) neighbors.push(index + 3) // Down
      if (col > 0) neighbors.push(index - 1) // Left
      if (col < 2) neighbors.push(index + 1) // Right
      
      return neighbors
    }

    for (let i = 0; i < shuffleMoves; i++) {
      const neighbors = getNeighborsLocal(emptyIdx)
      // filter out last position to avoid immediate undo (simple heuristic)
      const validNeighbors = neighbors.filter(n => n !== lastIdx)
      const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)]
      
      // Swap
      newTiles[emptyIdx] = newTiles[randomNeighbor]
      newTiles[randomNeighbor] = 0
      
      lastIdx = emptyIdx
      emptyIdx = randomNeighbor
    }

    setTimeout(() => {
      setTiles(newTiles)
      setMoves(0)
      setIsSolving(false)
    }, 0)
  }, [difficulty])

  const getNeighbors = (index: number) => {
    const neighbors = []
    const row = Math.floor(index / 3)
    const col = index % 3

    if (row > 0) neighbors.push(index - 3) // Up
    if (row < 2) neighbors.push(index + 3) // Down
    if (col > 0) neighbors.push(index - 1) // Left
    if (col < 2) neighbors.push(index + 1) // Right
    
    return neighbors
  }

  const handleTileClick = (index: number) => {
    if (isSolving) return

    const emptyIdx = tiles.indexOf(0)
    const neighbors = getNeighbors(emptyIdx)

    if (neighbors.includes(index)) {
      // Valid move
      const newTiles = [...tiles]
      newTiles[emptyIdx] = newTiles[index]
      newTiles[index] = 0
      setTiles(newTiles)
      setMoves(m => m + 1)

      // Check win
      if (checkWin(newTiles)) {
        setIsSolving(true)
        setTimeout(() => onComplete('SUCCESS'), 500)
      }
    }
  }

  function checkWin(currentTiles: number[]) {
    return currentTiles.every((val, idx) => val === SOLVED_STATE[idx])
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-sm w-full mx-4">
      <div className="text-green-500 font-mono font-bold mb-4 text-xl tracking-widest glitch-text">
        DECRYPTING...
      </div>
      
      <div className="grid grid-cols-3 gap-1 bg-green-900/30 p-1 border border-green-500/50 mb-4">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            disabled={tile === 0 || isSolving}
            className={cn(
              "w-20 h-20 flex items-center justify-center text-2xl font-bold font-mono transition-all duration-100",
              tile === 0 
                ? "bg-transparent pointer-events-none" 
                : "bg-green-900/80 text-green-400 border border-green-500 hover:bg-green-500 hover:text-black hover:shadow-[0_0_10px_green]",
              // Highlight correct position
              tile !== 0 && tile === SOLVED_STATE[idx] ? "border-cyan-500/50 text-cyan-400" : ""
            )}
          >
            {tile !== 0 && tile}
          </button>
        ))}
      </div>

      <div className="w-full flex justify-between items-center text-xs font-mono text-green-600">
        <div>MOVES: {moves}</div>
        <button 
          onClick={() => onComplete('CANCELLED')}
          className="text-red-500 hover:text-red-400 hover:underline"
        >
          ABORT SEQUENCE
        </button>
      </div>
    </div>
  )
}

// --- 2. Memory Match ---
const SYMBOLS = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ']

export function MemoryMatch({ onComplete }: MinigameProps) {
    const [cards, setCards] = useState<{id: number, symbol: string, flipped: boolean, matched: boolean}[]>([])
    const [flippedIndices, setFlippedIndices] = useState<number[]>([])
    const [isChecking, setIsChecking] = useState(false)

    useEffect(() => {
        // Init Game: 4 pairs = 8 cards
        const gameSymbols = SYMBOLS.slice(0, 4) 
        const deck = [...gameSymbols, ...gameSymbols]
            .sort(() => Math.random() - 0.5)
            .map((s, i) => ({ id: i, symbol: s, flipped: false, matched: false }))
        setTimeout(() => setCards(deck), 0)
    }, [])

    const handleCardClick = (index: number) => {
        if (isChecking || cards[index].flipped || cards[index].matched) return

        const newCards = [...cards]
        newCards[index].flipped = true
        setCards(newCards)

        const newFlipped = [...flippedIndices, index]
        setFlippedIndices(newFlipped)

        if (newFlipped.length === 2) {
            setIsChecking(true)
            const [idx1, idx2] = newFlipped
            
            if (cards[idx1].symbol === cards[idx2].symbol) {
                // Match
                setTimeout(() => {
                    const matchedCards = [...newCards]
                    matchedCards[idx1].matched = true
                    matchedCards[idx2].matched = true
                    setCards(matchedCards)
                    setFlippedIndices([])
                    setIsChecking(false)
                    if (matchedCards.every(c => c.matched)) {
                        setTimeout(() => onComplete('SUCCESS'), 500)
                    }
                }, 500)
            } else {
                // No Match
                setTimeout(() => {
                    const resetCards = [...newCards]
                    resetCards[idx1].flipped = false
                    resetCards[idx2].flipped = false
                    setCards(resetCards)
                    setFlippedIndices([])
                    setIsChecking(false)
                }, 1000)
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-sm w-full mx-4">
          <div className="text-green-500 font-mono font-bold mb-4 text-xl tracking-widest glitch-text">
            MEMORY SYNC...
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {cards.map((card, idx) => (
                <button
                    key={idx}
                    onClick={() => handleCardClick(idx)}
                    className={cn(
                        "w-16 h-16 border flex items-center justify-center text-2xl font-bold transition-all duration-300",
                        card.flipped || card.matched 
                            ? "bg-green-900 text-green-400 border-green-400 rotate-y-180" 
                            : "bg-black text-transparent border-green-800 hover:border-green-600"
                    )}
                >
                    {(card.flipped || card.matched) ? card.symbol : '?'}
                </button>
            ))}
          </div>

          <button onClick={() => onComplete('CANCELLED')} className="text-red-500 text-xs hover:underline">ABORT</button>
        </div>
    )
}

// --- 3. Snake (Data Stream) ---
export function SnakeGame({ onComplete }: MinigameProps) {
    const GRID_SIZE = 15
    const WIN_SCORE = 5
    
    const [snake, setSnake] = useState([{x: 7, y: 7}])
    const [food, setFood] = useState({x: 10, y: 10})
    const [dir, setDir] = useState({x: 0, y: 0}) // Start stationary
    const [score, setScore] = useState(0)
    const [gameOver, setGameOver] = useState(false)

    // Input
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if(gameOver) return
            switch(e.key) {
                case 'ArrowUp': if(dir.y === 0) setDir({x:0, y:-1}); break;
                case 'ArrowDown': if(dir.y === 0) setDir({x:0, y:1}); break;
                case 'ArrowLeft': if(dir.x === 0) setDir({x:-1, y:0}); break;
                case 'ArrowRight': if(dir.x === 0) setDir({x:1, y:0}); break;
            }
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [dir, gameOver])

    // Game Loop
    useEffect(() => {
        if (gameOver || (dir.x === 0 && dir.y === 0)) return

        const moveInterval = setInterval(() => {
            setSnake(prev => {
                const head = prev[0]
                const newHead = { x: head.x + dir.x, y: head.y + dir.y }

                // Check Wall Collision
                if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
                    setGameOver(true)
                    return prev
                }
                // Check Self Collision
                if (prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
                    setGameOver(true)
                    return prev
                }

                const newSnake = [newHead, ...prev]
                
                // Eat Food
                if (newHead.x === food.x && newHead.y === food.y) {
                    const newScore = score + 1
                    setScore(newScore)
                    if (newScore >= WIN_SCORE) {
                        setTimeout(() => onComplete('SUCCESS'), 200)
                    } else {
                        // Respawn food
                        let newFood
                        do {
                            newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) }
                        } while (newSnake.some(s => s.x === newFood.x && s.y === newFood.y))
                        setFood(newFood)
                    }
                } else {
                    newSnake.pop() // Remove tail
                }

                return newSnake
            })
        }, 150)

        return () => clearInterval(moveInterval)
    }, [dir, food, gameOver, score, onComplete])

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-sm w-full mx-4">
            <div className="text-green-500 font-mono font-bold mb-2 text-xl tracking-widest">
                DATA STREAM
            </div>
            <div className="text-xs text-green-600 mb-2">COLLECT {WIN_SCORE} PACKETS | ARROWS TO MOVE</div>
            
            <div className="relative bg-green-900/10 border border-green-500/30" 
                 style={{ width: GRID_SIZE * 16, height: GRID_SIZE * 16 }}>
                {/* Food */}
                <div className="absolute w-4 h-4 bg-cyan-400 shadow-[0_0_10px_cyan] animate-pulse"
                     style={{ left: food.x * 16, top: food.y * 16 }} />
                
                {/* Snake */}
                {snake.map((s, i) => (
                    <div key={i} className="absolute w-4 h-4 bg-green-500 border border-black"
                         style={{ left: s.x * 16, top: s.y * 16, opacity: 1 - i/snake.length*0.5 }} />
                ))}

                {gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-red-500 font-bold">
                        CORRUPTED
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-4 text-xs font-mono">
                <div className="text-cyan-400">SCORE: {score}/{WIN_SCORE}</div>
                <button onClick={() => gameOver ? setGameOver(false) || setSnake([{x:7,y:7}]) || setDir({x:0,y:0}) || setScore(0) : onComplete('CANCELLED')} className="text-red-500 hover:underline">
                    {gameOver ? 'RETRY' : 'ABORT'}
                </button>
            </div>
        </div>
    )
}

// --- 4. Simon Says (Sequence) ---
export function SimonSays({ onComplete }: MinigameProps) {
    const COLORS = ['red', 'green', 'blue', 'yellow']
    const [sequence, setSequence] = useState<number[]>([])
    const [playerSeq, setPlayerSeq] = useState<number[]>([])
    const [isPlaying, setIsPlaying] = useState(false) // Is showing sequence
    const [activeColor, setActiveColor] = useState<number | null>(null)
    const [round, setRound] = useState(0)
    const TARGET_ROUNDS = 4

    const startRound = useCallback((currentRound: number) => {
        setIsPlaying(true)
        const newStep = Math.floor(Math.random() * 4)
        
        // Actually we just append one step per round? No, usually existing sequence + 1
        // Let's simpler: Just generate full sequence for target rounds? 
        // Classic: Round 1: 1 step. Round 2: 2 steps...
        
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)]
        setSequence(nextSeq)
        setPlayerSeq([])
        
        // Play sequence
        let i = 0
        const interval = setInterval(() => {
            setActiveColor(null)
            setTimeout(() => {
                setActiveColor(nextSeq[i])
                i++
                if (i >= nextSeq.length) {
                    clearInterval(interval)
                    setTimeout(() => {
                        setActiveColor(null)
                        setIsPlaying(false)
                    }, 500)
                }
            }, 100)
        }, 800)

    }, [sequence])

    useEffect(() => {
        if (round === 0 && sequence.length === 0) {
            setTimeout(() => startRound(1), 1000)
        }
    }, [round, sequence, startRound])

    const handleColorClick = (idx: number) => {
        if (isPlaying) return

        // Flash click
        setActiveColor(idx)
        setTimeout(() => setActiveColor(null), 200)

        const expected = sequence[playerSeq.length]
        if (idx === expected) {
            const newPlayerSeq = [...playerSeq, idx]
            setPlayerSeq(newPlayerSeq)

            if (newPlayerSeq.length === sequence.length) {
                // Round Complete
                if (newPlayerSeq.length === TARGET_ROUNDS) {
                    setTimeout(() => onComplete('SUCCESS'), 500)
                } else {
                    setRound(r => r + 1)
                    setTimeout(() => startRound(round + 1), 1000)
                }
            }
        } else {
            // Fail
            // Maybe just restart sequence?
            alert("SEQUENCE ERROR. RETRYING...")
            setSequence([])
            setRound(0)
            setPlayerSeq([])
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-sm w-full mx-4">
             <div className="text-green-500 font-mono font-bold mb-4 text-xl tracking-widest">
                PATTERN LOCK
            </div>
            <div className="text-xs text-green-600 mb-4">REPEAT THE SIGNAL</div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {COLORS.map((c, i) => (
                    <button
                        key={i}
                        onClick={() => handleColorClick(i)}
                        className={cn(
                            "w-24 h-24 rounded-lg border-2 transition-all duration-100",
                            c === 'red' ? "border-red-500 bg-red-900/20" : "",
                            c === 'green' ? "border-green-500 bg-green-900/20" : "",
                            c === 'blue' ? "border-blue-500 bg-blue-900/20" : "",
                            c === 'yellow' ? "border-yellow-500 bg-yellow-900/20" : "",
                            activeColor === i ? "brightness-200 shadow-[0_0_20px_currentColor] scale-95" : "brightness-50"
                        )}
                        style={{ backgroundColor: activeColor === i ? c : undefined }}
                    />
                ))}
            </div>
             <button onClick={() => onComplete('CANCELLED')} className="text-red-500 text-xs hover:underline">ABORT</button>
        </div>
    )
}

// --- 5. Timing Challenge ---
export function TimingChallenge({ onComplete }: MinigameProps) {
    const [pos, setPos] = useState(0)
    const [dir, setDir] = useState(1)
    const [target] = useState({ start: 40, width: 20 })
    const [isRunning, setIsRunning] = useState(true)
    
    useEffect(() => {
        if (!isRunning) return
        const interval = setInterval(() => {
            setPos(p => {
                if (p >= 100) setDir(-1)
                if (p <= 0) setDir(1)
                return p + (dir * 2) // Speed
            })
        }, 20)
        return () => clearInterval(interval)
    }, [dir, isRunning])

    const handleStop = () => {
        setIsRunning(false)
        if (pos >= target.start && pos <= target.start + target.width) {
            setTimeout(() => onComplete('SUCCESS'), 500)
        } else {
            setTimeout(() => {
                // Retry
                setPos(0)
                setIsRunning(true)
            }, 1000)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.2)] max-w-sm w-full mx-4">
            <div className="text-green-500 font-mono font-bold mb-4 text-xl tracking-widest">
                FREQUENCY SYNC
            </div>
            <div className="text-xs text-green-600 mb-8">STOP IN THE ZONE</div>

            <div className="w-full h-8 bg-gray-900 relative border border-gray-700 mb-8 rounded overflow-hidden">
                {/* Target Zone */}
                <div 
                    className="absolute top-0 bottom-0 bg-cyan-500/30 border-x border-cyan-500"
                    style={{ left: `${target.start}%`, width: `${target.width}%` }}
                />
                
                {/* Cursor */}
                <div 
                    className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_red]"
                    style={{ left: `${pos}%` }}
                />
            </div>

            <button 
                onClick={handleStop}
                disabled={!isRunning}
                className="px-8 py-4 bg-green-600 text-black font-bold text-xl rounded hover:bg-green-400 disabled:opacity-50"
            >
                SYNC
            </button>
             <button onClick={() => onComplete('CANCELLED')} className="text-red-500 text-xs hover:underline mt-4">ABORT</button>
        </div>
    )
}

// --- Main Container ---
export function MinigameContainer({ type, onComplete }: { type: string, onComplete: (res: MinigameResult) => void }) {
    switch (type) {
        case 'frag_1': return <SnakeGame onComplete={onComplete} />
        case 'frag_2': return <SlidingPuzzle onComplete={onComplete} difficulty={1} />
        case 'frag_3': return <MemoryMatch onComplete={onComplete} />
        case 'frag_4': return <SimonSays onComplete={onComplete} />
        case 'frag_5': return <TimingChallenge onComplete={onComplete} />
        default: return <SlidingPuzzle onComplete={onComplete} />
    }
}
