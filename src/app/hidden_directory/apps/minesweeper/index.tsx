"use client"

import { useState, useEffect } from "react"
import { AppProps } from "../types"
import { cn } from "@/lib/utils"

// Simple Minesweeper
const BOARD_SIZE = 9
const MINES_COUNT = 10

interface Cell {
  x: number
  y: number
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export function MinesweeperApp({ }: AppProps) {
  const [board, setBoard] = useState<Cell[][]>([])
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)

  const initializeBoard = () => {
    // Init empty board
    let newBoard: Cell[][] = Array(BOARD_SIZE).fill(null).map((_, y) => 
      Array(BOARD_SIZE).fill(null).map((_, x) => ({
        x, y, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0
      }))
    )

    // Place mines
    let minesPlaced = 0
    while (minesPlaced < MINES_COUNT) {
      const x = Math.floor(Math.random() * BOARD_SIZE)
      const y = Math.floor(Math.random() * BOARD_SIZE)
      if (!newBoard[y][x].isMine) {
        newBoard[y][x].isMine = true
        minesPlaced++
      }
    }

    // Calculate neighbors
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (!newBoard[y][x].isMine) {
          let count = 0
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (y + dy >= 0 && y + dy < BOARD_SIZE && x + dx >= 0 && x + dx < BOARD_SIZE) {
                if (newBoard[y + dy][x + dx].isMine) count++
              }
            }
          }
          newBoard[y][x].neighborMines = count
        }
      }
    }

    setBoard(newBoard)
    setGameOver(false)
    setWin(false)
  }

  useEffect(() => {
    initializeBoard()
  }, [])

  const revealCell = (x: number, y: number) => {
    if (gameOver || win || board[y][x].isFlagged || board[y][x].isRevealed) return

    const newBoard = [...board]
    
    if (newBoard[y][x].isMine) {
      // Boom
      newBoard[y][x].isRevealed = true
      setBoard(newBoard)
      setGameOver(true)
      return
    }

    // Reveal (flood fill if 0)
    const reveal = (cx: number, cy: number) => {
      if (cx < 0 || cy < 0 || cx >= BOARD_SIZE || cy >= BOARD_SIZE || newBoard[cy][cx].isRevealed || newBoard[cy][cx].isFlagged) return
      
      newBoard[cy][cx].isRevealed = true
      
      if (newBoard[cy][cx].neighborMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
             reveal(cx + dx, cy + dy)
          }
        }
      }
    }

    reveal(x, y)
    setBoard(newBoard)
    
    // Check win
    const unrevealedSafeCells = newBoard.flat().filter(c => !c.isMine && !c.isRevealed).length
    if (unrevealedSafeCells === 0) {
      setWin(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#c0c0c0] p-4 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600">
      <div className="mb-4 flex gap-4">
        <button 
          onClick={initializeBoard}
          className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white"
        >
          {gameOver ? "😵" : win ? "😎" : "😊"}
        </button>
        <div className="bg-black text-red-500 font-mono px-2 border-2 border-gray-600">
          {MINES_COUNT}
        </div>
      </div>

      <div 
        className="grid bg-gray-400 border-4 border-gray-600"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
      >
        {board.map((row, y) => row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={cn(
              "w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer select-none",
              cell.isRevealed 
                ? "bg-[#c0c0c0] border border-gray-400" 
                : "bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 active:border-t-gray-600 active:border-l-gray-600"
            )}
            onClick={() => revealCell(x, y)}
            onContextMenu={(e) => {
              e.preventDefault()
              // Implement flag logic if needed
            }}
          >
            {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
              <span style={{ color: ['blue', 'green', 'red', 'purple', 'maroon', 'turquoise', 'black', 'gray'][cell.neighborMines - 1] }}>
                {cell.neighborMines}
              </span>
            )}
            {cell.isRevealed && cell.isMine && "💣"}
          </div>
        )))}
      </div>
    </div>
  )
}
