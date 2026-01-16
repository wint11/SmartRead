import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { HistoryItem } from "../hooks/use-ctf-game"

interface TerminalInterfaceProps {
  theme: 'dark' | 'red'
  history: HistoryItem[]
  input: string
  setInput: (s: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  isProcessing: boolean
  activeTool: string | null
  isActive: boolean
  user?: string
}

export function TerminalInterface({
  theme,
  history,
  input,
  setInput,
  onKeyDown,
  isProcessing,
  activeTool,
  isActive,
  user = "ctf-user",
  isSnapshot = false
}: TerminalInterfaceProps & { isSnapshot?: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [cursorPos, setCursorPos] = useState(0)
  
  // Sync cursor position when input changes (typing or history)
  useEffect(() => {
    if (inputRef.current && !isSnapshot) {
        // When input value changes programmatically (e.g. history), React usually moves cursor to end.
        // We sync our visual cursor to match.
        setTimeout(() => setCursorPos(inputRef.current?.selectionStart || 0), 0)
    }
  }, [input, isSnapshot])
  
  // Auto scroll
  useEffect(() => {
    if (isActive && !isSnapshot) {
        const timeoutId = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }, 10)
        return () => clearTimeout(timeoutId)
    }
  }, [history, isActive, isSnapshot])

  // Focus management
  useEffect(() => {
    if (isActive && !isProcessing && !isSnapshot) {
        const timer = setTimeout(() => inputRef.current?.focus(), 10)
        return () => clearTimeout(timer)
    }
  }, [isActive, isProcessing, history.length, isSnapshot])

  const handleClick = () => {
      if (isActive && !isSnapshot) inputRef.current?.focus()
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Manually handle cursor keys for immediate visual feedback
    if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        if (e.key === 'ArrowLeft') {
            setCursorPos(prev => Math.max(0, prev - 1))
        } else if (e.key === 'ArrowRight') {
            setCursorPos(prev => Math.min(input.length, prev + 1))
        } else if (e.key === 'Home') {
            setCursorPos(0)
        } else if (e.key === 'End') {
            setCursorPos(input.length)
        }
    }

    onKeyDown(e)
    // Defer to allow native cursor movement to happen first (catches Ctrl+Left, etc.)
    setTimeout(() => {
        if (inputRef.current) {
            setCursorPos(inputRef.current.selectionStart || 0)
        }
    }, 0)
  }

  const isRed = theme === 'red'
  // Use CSS variables for theme-aware colors
  // Revert text color to softer gray for better readability
  // Dark mode: gray-300 (light gray)
  // Light mode: gray-700 (dark gray) - NOT black, but readable
  const textColor = isRed ? "text-red-200" : "text-gray-700 dark:text-gray-300"
  
  // Dark mode: blue-400 (light blue)
  // Light mode: blue-600 (darker blue)
  const inputColor = isRed ? "text-red-400" : "text-blue-600 dark:text-blue-400"
  
  const promptColor = isRed ? "text-red-500" : "text-green-600 dark:text-green-400"
  
  // Simplified Cursor: Use a neutral gray for less visual noise
  const cursorColor = isRed ? "bg-red-500" : "bg-gray-500 dark:bg-gray-400"
  
  const borderColor = isRed ? "border-red-500/30" : "border-border"
  const bgColor = isRed ? "bg-red-950/90" : "bg-background border"
  
  const displayContent = activeTool === 'ssh_password' ? '*'.repeat(input.length) : input
  const beforeCursor = displayContent.slice(0, cursorPos)
  const cursorChar = displayContent.slice(cursorPos, cursorPos + 1)
  const afterCursor = displayContent.slice(cursorPos + 1)

  return (
    <div 
        className={cn(
            "absolute inset-0 rounded-lg shadow-2xl p-4 font-mono text-sm overflow-hidden flex flex-col",
            bgColor,
            isRed ? "border-red-500/30" : "border-border",
            !isActive && "pointer-events-none"
        )}
        style={{ 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden',
            transform: isRed ? 'rotateY(180deg)' : 'none' 
        }}
        onClick={handleClick}
    >
       {/* Header */}
       <div className={cn("flex items-center justify-between border-b pb-2 mb-2 select-none", borderColor)}>
            <div className="flex gap-1.5">
              <div className={cn("w-3 h-3 rounded-full", isRed ? "bg-red-500" : "bg-red-500/50")} />
              <div className={cn("w-3 h-3 rounded-full", isRed ? "bg-red-500" : "bg-yellow-500/50")} />
              <div className={cn("w-3 h-3 rounded-full", isRed ? "bg-red-500" : "bg-green-500/50")} />
            </div>
            <div className={cn("text-xs", isRed ? "text-red-400" : "text-muted-foreground")}>
                {user}@smartread: ~
            </div>
            <div className="w-4" />
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto scrollbar-hide space-y-1">
            {history.map((item, i) => (
              <div key={i} className={cn(
                "break-words whitespace-pre-wrap",
                item.type === 'input' ? cn("font-bold", inputColor) : textColor
              )}>
                {item.type === 'input' ? (
                   <span className="flex">
                      <span className={cn("mr-2", promptColor)}>
                          {isRed ? '#' : '$'}
                      </span>
                      {item.content}
                   </span>
                ) : (
                   item.content
                )}
              </div>
            ))}

            {/* Input Line */}
            <div className={cn("flex items-center relative", inputColor)}>
               <span className={cn("mr-2 select-none", promptColor)}>
                 {activeTool === 'ssh_password' ? 'Password:' : 
                  activeTool === 'overflow_test' ? '>' : 
                  (isRed ? '#' : '$')}
               </span>
               <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type={activeTool === 'ssh_password' ? 'password' : 'text'}
                    value={input}
                    onChange={e => {
                        setInput(e.target.value)
                        setCursorPos(e.target.selectionStart || 0)
                    }}
                    onKeyDown={handleInputKeyDown}
                    onSelect={e => setCursorPos(e.currentTarget.selectionStart || 0)}
                    onClick={e => setCursorPos(e.currentTarget.selectionStart || 0)}
                    onKeyUp={e => setCursorPos(e.currentTarget.selectionStart || 0)}
                    className="absolute inset-0 w-full h-full bg-transparent outline-none border-none text-transparent caret-transparent p-0 m-0 cursor-text font-mono text-sm"
                    autoFocus={isActive && !isSnapshot}
                    spellCheck={false}
                    autoComplete="off"
                    disabled={isProcessing || !isActive || isSnapshot}
                  />
                  <div className="pointer-events-none whitespace-pre-wrap break-all flex items-center flex-wrap">
                    <span>{beforeCursor}</span>
                    <span 
                        className={cn("inline-block w-2.5 h-5 align-middle", !isSnapshot && "animate-blink", cursorColor)} 
                    />
                    <span>{cursorChar}{afterCursor}</span>
                  </div>
               </div>
            </div>
            <div ref={bottomRef} />
       </div>
    </div>
  )
}
