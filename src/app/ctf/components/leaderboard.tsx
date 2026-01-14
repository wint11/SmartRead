'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Trophy, X, CircleHelp } from 'lucide-react'
import { getLeaderboard } from '../actions'
import { cn } from '@/lib/utils'

interface LeaderboardProps {
  solvedCount: number
  hidden?: boolean
}

interface LeaderboardEntry {
  name: string
  score: number
  rank: number
  isUser?: boolean
  message?: string
}

export function Leaderboard({ solvedCount, hidden = false }: LeaderboardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      getLeaderboard(solvedCount)
        .then(res => setData(res))
        .finally(() => setLoading(false))
      
      // ESC key handler
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false)
      }
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, solvedCount])

  if (hidden && !isOpen) return null
  if (!mounted) return null

  return createPortal(
    <>
      <div className="fixed top-24 right-8 z-[9999] group perspective-1000">
        <button 
          onClick={() => setIsOpen(true)}
          className="
            w-14 h-14 
            flex items-center justify-center 
            bg-zinc-900/90 border border-white/20 
            text-white/80
            font-bold text-xl font-mono
            opacity-0 group-hover:opacity-100 
            transition-all duration-500 
            transform -rotate-y-180 group-hover:rotate-y-0 
            cursor-pointer
            shadow-[0_0_15px_rgba(255,255,255,0.1)]
            hover:bg-zinc-800 hover:text-white hover:border-white/40
            backdrop-blur-sm
          "
          title="???"
          style={{ transformStyle: 'preserve-3d' }}
        >
          ?
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-4 font-mono text-gray-300 pointer-events-auto">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-yellow-600" />
                <h2 className="text-lg font-bold text-white">CTF LEADERBOARD</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {loading ? (
                <div className="text-center py-8 animate-pulse text-gray-500">
                  LOADING_DATA...
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-gray-500">
                      <th className="p-2 w-16">#</th>
                      <th className="p-2">HACKER</th>
                      <th className="p-2 text-right">SCORE</th>
                      <th className="p-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((entry) => (
                      <tr 
                        key={entry.rank}
                        className={cn(
                          "border-b border-zinc-800/50 transition-colors hover:bg-zinc-900",
                          entry.isUser && "bg-zinc-900 text-white font-bold"
                        )}
                      >
                        <td className="p-2 text-gray-500">{entry.rank}</td>
                        <td className="p-2 flex items-center gap-2">
                          {entry.name}
                          {entry.rank === 1 && <Trophy size={12} className="text-yellow-600" />}
                        </td>
                        <td className="p-2 text-right font-mono text-gray-400">{entry.score}</td>
                        <td className="p-2 text-center">
                          {entry.message && (
                            <button
                              onClick={() => setExpandedMsg(expandedMsg === entry.name ? null : entry.name)}
                              className="hover:text-white text-gray-500 transition-colors p-1"
                              title="View Message"
                            >
                              <CircleHelp size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Hidden Message Panel */}
            {expandedMsg && (
              <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 text-xs break-all">
                <span className="font-bold text-gray-300">MESSAGE FROM {expandedMsg}:</span>
                <div className="mt-1 opacity-80 text-gray-400 font-mono">
                  {data.find(d => d.name === expandedMsg)?.message}
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div className="p-2 border-t border-zinc-800 text-center text-xs text-gray-600 bg-zinc-950">
              PRESS ESC TO CLOSE
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}
