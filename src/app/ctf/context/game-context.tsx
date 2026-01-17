"use client"

import React, { createContext, useContext, ReactNode } from "react"
import { useCtfGame, TerminalLine, BombState } from "../hooks/use-ctf-game"
import { DirectoryNode } from "../data/filesystem"

interface CTFGameContextType {
  history: TerminalLine[]
  input: string
  setInput: (s: string) => void
  isProcessing: boolean
  activeTool: string | null
  
  // Game State
  isDeepLayer: boolean
  isFlipped: boolean
  solvedFlags: number[]
  commandNotFoundCount: number
  isSnakeActive: boolean
  
  // Mechanics
  bombState: BombState
  
  // FileSystem
  fileSystem: DirectoryNode
  currentPath: string
  currentUser: string
  sudoFailCount: number
  
  // Actions
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  resetGame: () => void
  clearHistory: () => void
  execute: (cmdLine: string) => Promise<void>
}

const CTFGameContext = createContext<CTFGameContextType | null>(null)

export function CTFGameProvider({ children }: { children: ReactNode }) {
  const gameState = useCtfGame()
  
  return (
    <CTFGameContext.Provider value={gameState as unknown as CTFGameContextType}>
      {children}
    </CTFGameContext.Provider>
  )
}

export function useCTF() {
  const context = useContext(CTFGameContext)
  if (!context) {
    throw new Error("useCTF must be used within a CTFGameProvider")
  }
  return context
}
