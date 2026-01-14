import { useEffect, useRef } from "react"
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
  user = "ctf-user"
}: TerminalInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Auto scroll
  useEffect(() => {
    if (isActive) {
        const timeoutId = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }, 10)
        return () => clearTimeout(timeoutId)
    }
  }, [history, isActive])

  // Focus management
  useEffect(() => {
    if (isActive && !isProcessing) {
        const timer = setTimeout(() => inputRef.current?.focus(), 10)
        return () => clearTimeout(timer)
    }
  }, [isActive, isProcessing, history.length])

  const handleClick = () => {
      if (isActive) inputRef.current?.focus()
  }

  const isRed = theme === 'red'
  const textColor = isRed ? "text-red-200" : "text-gray-300"
  const inputColor = isRed ? "text-red-400" : "text-blue-400"
  const promptColor = isRed ? "text-red-500" : "text-green-500"
  const cursorColor = isRed ? "bg-red-500/70" : "bg-white/70"
  const borderColor = isRed ? "border-red-500/30" : "border-white/10"
  const bgColor = isRed ? "bg-red-950/90" : "bg-black/90"
  
  return (
    <div 
        className={cn(
            "absolute inset-0 rounded-lg border shadow-2xl p-4 font-mono text-sm overflow-hidden flex flex-col",
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
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="absolute inset-0 w-full h-full bg-transparent outline-none border-none text-transparent caret-transparent p-0 m-0 cursor-text"
                    autoFocus={isActive}
                    spellCheck={false}
                    autoComplete="off"
                    disabled={isProcessing || !isActive}
                  />
                  <div className="pointer-events-none whitespace-pre-wrap break-all">
                    {activeTool === 'ssh_password' ? '*'.repeat(input.length) : input}
                    <span className={cn("inline-block w-2.5 h-5 animate-pulse align-middle ml-[1px] translate-y-[-1px]", cursorColor)}></span>
                  </div>
               </div>
            </div>
            <div ref={bottomRef} />
       </div>
    </div>
  )
}
