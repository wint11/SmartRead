"use client"

import { useState, useRef, useEffect } from "react"
import { X, Terminal, Skull } from "lucide-react"

export function DeveloperConsole({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([
    "Forbidden OS v0.9 (Debug Console)",
    "Type 'help' for commands."
  ])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().split(" ")
    const command = args[0].toLowerCase()

    let response = ""

    switch (command) {
      case "help":
        response = "Available commands: help, clear, flag, whoami, exit"
        break
      case "clear":
        setHistory([])
        return
      case "flag":
        response = "Error: Flag is encrypted. Try looking in /hidden_directory"
        break
      case "whoami":
        response = "guest"
        break
      case "exit":
        onClose()
        return
      default:
        response = `Command not found: ${command}`
    }

    setHistory(prev => [...prev, `> ${cmd}`, response])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input)
      setInput("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10001] bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-black border border-green-500 rounded font-mono text-green-500 p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-green-500 pb-2">
          <div className="flex items-center gap-2">
            <Terminal size={16} />
            <span>DEBUG_CONSOLE</span>
          </div>
          <button onClick={onClose} className="hover:text-green-300"><X size={16} /></button>
        </div>
        <div className="h-64 overflow-y-auto mb-4 space-y-1 scrollbar-hide">
          {history.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <div className="flex gap-2">
          <span>{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none border-none text-green-500"
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

export function GlitchEffect({ active, onEnd }: { active: boolean; onEnd: () => void }) {
  useEffect(() => {
    if (active) {
      const timer = setTimeout(onEnd, 2000)
      return () => clearTimeout(timer)
    }
  }, [active, onEnd])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[10002] bg-black pointer-events-none flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-red-500/20 animate-pulse mix-blend-overlay"></div>
      <div className="text-red-500 font-mono text-6xl font-bold animate-bounce flex flex-col items-center">
        <Skull size={100} className="mb-8" />
        <span>SYSTEM ERROR</span>
        <span className="text-xl mt-4">0xDEADBEEF</span>
      </div>
      {/* Random glitch lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div 
          key={i}
          className="absolute h-1 bg-white/50 w-full"
          style={{ 
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 10 - 5}%`,
            opacity: Math.random(),
            transform: `scaleX(${Math.random()})`
          }}
        />
      ))}
    </div>
  )
}
