
"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Enhanced Content: Mixed types of messages
const LOG_EVENTS = [
  // System Logs (Intertwined with other features)
  { type: "sys", msg: "WARNING: Unauthorized access detected in /novel/time-rift" },
  { type: "sys", msg: "NOTICE: User 'admin' failed login attempt (SQL Injection blocked)" },
  { type: "sys", msg: "CRITICAL: Timeline divergence at 42nd second mark" },
  { type: "sys", msg: "LOG: robots.txt scanned by external crawler" },
  { type: "sys", msg: "ALERT: Ghost Mode active in session #8821" },
  { type: "sys", msg: "DEBUG: Flag 102 decryption attempt failed" },
  
  // Story Fragments (The "Book")
  { type: "story", msg: "...she realized the book was reading her, not the other way around..." },
  { type: "story", msg: "...the code wasn't just code, it was a map to the old world..." },
  { type: "story", msg: "...he deleted the file, but the file refused to die..." },
  { type: "story", msg: "...every 42 seconds, the world resets. Do you feel it?..." },
  
  // CTF Hints (Subtle)
  { type: "hint", msg: "HINT: Have you checked the HTTP headers?" },
  { type: "hint", msg: "HINT: The cookies taste like base64..." },
  { type: "hint", msg: "HINT: Some secrets are hidden in the console logs..." },
]

export default function GhostWritingPage() {
  const [lines, setLines] = React.useState<Array<{ text: string, type: string, author?: string, timestamp?: Date }>>([])
  const [input, setInput] = React.useState("")
  const [hasContributed, setHasContributed] = React.useState(false)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  // Fetch Stream
  const fetchStream = React.useCallback(async () => {
    try {
      const res = await fetch('/api/novel/ghost-stream')
      if (res.ok) {
        const data = await res.json()
        setLines(data)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Initial Load & Polling (Randomized 10s-30s)
  React.useEffect(() => {
    fetchStream()
    
    let timeoutId: NodeJS.Timeout
    
    const scheduleNextPoll = () => {
        // Random delay between 10000ms (10s) and 30000ms (30s)
        const delay = Math.floor(Math.random() * 20000) + 10000
        timeoutId = setTimeout(() => {
            fetchStream()
            scheduleNextPoll()
        }, delay)
    }

    scheduleNextPoll()

    return () => clearTimeout(timeoutId)
  }, [fetchStream])

  // Auto-scroll only if near bottom
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const currentInput = input
    setInput("") // Optimistic update

    // Check commands locally first
    const lowerInput = currentInput.toLowerCase().trim()
    
    if (lowerInput === "help") {
         // ... local handling for help ...
    }

    try {
      await fetch('/api/novel/ghost-message', {
        method: 'POST',
        body: JSON.stringify({ content: currentInput }),
        headers: { 'Content-Type': 'application/json' }
      })
      
      // Refresh immediately
      fetchStream()

      if (!hasContributed && !['help', 'clear'].includes(lowerInput)) {
        setHasContributed(true)
        // Simulate system response for flag
         await fetch('/api/novel/ghost-message', {
            method: 'POST',
            body: JSON.stringify({ 
                content: "flag{collective_consciousness_writer}", 
                type: "flag" 
            }),
         })
      }
    } catch (e) {
      console.error("Failed to send", e)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black text-green-500 font-mono flex flex-col overflow-hidden">
      {/* CSS to hide scrollbar & Add CRT Effect */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        .scanline::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 2;
          background-size: 100% 2px, 3px 100%;
          pointer-events: none;
        }
        .crt-flicker {
          animation: flicker 0.15s infinite;
        }
        @keyframes flicker {
          0% { opacity: 0.97; }
          50% { opacity: 1; }
          100% { opacity: 0.98; }
        }
      `}</style>

      {/* CRT Scanline & Vignette Effects (CSS only, no image required) */}
      <div className="absolute inset-0 pointer-events-none z-50 scanline mix-blend-overlay opacity-50"></div>
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>
      
      {/* Header - Fixed Height */}
      <header className="flex-none h-16 border-b border-green-800 flex justify-between items-center px-6 z-30 bg-black/90 backdrop-blur-md relative">
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold glitch-text tracking-widest text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">THE INFINITE STORY</h1>
            <p className="text-[10px] text-green-700 uppercase tracking-widest">Data Center: Sector 7 // Node: 42</p>
        </div>
        <Link href="/" className="text-xs border border-green-800 px-4 py-2 hover:bg-red-900/20 hover:text-red-500 hover:border-red-500 transition-all duration-300 tracking-wider">
            [ DISCONNECT ]
        </Link>
      </header>

      {/* Main Content - Flex Grow & Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar z-20 relative crt-flicker">
        {/* Gradient Overlay for top fade */}
        <div className="sticky top-0 left-0 w-full h-12 bg-gradient-to-b from-black to-transparent pointer-events-none z-30"></div>
        
        {lines.map((line, i) => {
            const isSystem = line.type === "sys"
            const isFlag = line.type === "flag"
            const isUser = line.type === "user"
            const isHint = line.type === "hint"
            const isStory = line.type === "story"

            return (
                <div key={i} className={cn(
                    "break-words text-sm md:text-base transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 font-mono",
                    isSystem && "text-yellow-600/90 font-bold border-l-2 border-yellow-600/50 pl-2",
                    isFlag && "bg-green-900/20 p-4 border border-green-500/50 text-green-300 shadow-[0_0_15px_rgba(74,222,128,0.2)] rounded",
                    isUser && "text-white font-semibold text-right border-r-2 border-white/50 pr-2",
                    isHint && "text-blue-400 italic opacity-90 pl-4",
                    isStory && "text-purple-400 italic font-serif text-lg opacity-80 pl-8 border-l border-purple-900/50"
                )}>
                    {isFlag ? (
                        <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase text-green-600">Reward Dispensed</span>
                            <span className="font-mono text-lg tracking-wider">
                                {line.text.split("flag{")[0]}
                                <span className="text-black bg-green-500 px-2 py-0.5 select-all font-bold shadow-[0_0_10px_rgba(74,222,128,0.8)]">flag{'{' + line.text.split("flag{")[1]}</span>
                            </span>
                        </div>
                    ) : (
                        line.text
                    )}
                </div>
            )
        })}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area - Fixed Bottom */}
      <div className="flex-none p-6 bg-black border-t border-green-900/50 z-30 relative shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
        <form onSubmit={handleSubmit} className="relative max-w-5xl mx-auto w-full group">
            <div className="flex items-center gap-4 bg-green-900/10 p-3 rounded border border-green-900/30 group-focus-within:border-green-500/50 group-focus-within:bg-green-900/20 transition-all duration-300 group-focus-within:shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                <span className="animate-pulse text-green-500 font-bold text-xl">&gt;</span>
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder-green-800/50 font-bold font-mono text-lg"
                    placeholder="Enter command or write the next line..."
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
                <button type="submit" className="text-xs text-green-800 uppercase tracking-widest group-focus-within:text-green-500 transition-colors">
                    [ENTER]
                </button>
            </div>
        </form>
      </div>
    </div>
  )
}
