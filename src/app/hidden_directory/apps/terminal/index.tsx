"use client"

import { useState, useRef, useEffect } from "react"
import { AppProps } from "../types"
import { cn } from "@/lib/utils"
import { useCTF } from "@/app/ctf/context/game-context"

export function TerminalApp({ isFocused }: AppProps) {
  const { history, execute, input, setInput } = useCTF()
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFocused) {
      inputRef.current?.focus()
    }
  }, [isFocused])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        await execute(input)
        setInput("")
    }
  }

  return (
    <div 
      className="flex flex-col h-full bg-black text-green-500 font-mono text-sm p-2 overflow-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className={cn("mb-1", line.type === 'input' ? "text-white" : "text-green-500")}>
          {line.type === 'input' ? '> ' : ''}{line.content}
        </div>
      ))}
      <div className="flex">
        <span className="text-white mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-white border-none p-0 m-0"
          autoFocus
        />
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
