'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Lock, Unlock, BrainCircuit } from 'lucide-react'
import { SKILL_TREE, SkillNode } from '../data/skill-tree'
import { cn } from '@/lib/utils'

interface SkillTreeProps {
  isOpen: boolean
  onClose: () => void
  solvedFlags: number[]
}

export function SkillTree({ isOpen, onClose, solvedFlags }: SkillTreeProps) {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)

  if (!isOpen) return null

  // Group skills by category
  const categories = {
    beginner: SKILL_TREE.filter(s => s.category === 'beginner'),
    web: SKILL_TREE.filter(s => s.category === 'web'),
    system: SKILL_TREE.filter(s => s.category === 'system'),
    crypto: SKILL_TREE.filter(s => s.category === 'crypto'),
    deep: SKILL_TREE.filter(s => s.category === 'deep'),
  }

  const isUnlocked = (skill: SkillNode) => {
    // A skill is unlocked if ALL required flags are solved
    // Or maybe if AT LEAST ONE is solved? Let's be generous: AT LEAST ONE.
    // Actually, "Mastery" implies all. But to fill the tree, let's say "unlocked if any related flag found".
    return skill.requiredFlagIds.some(id => solvedFlags.includes(id))
  }

  const getProgress = (skill: SkillNode) => {
    const solved = skill.requiredFlagIds.filter(id => solvedFlags.includes(id)).length
    return Math.round((solved / skill.requiredFlagIds.length) * 100)
  }

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4 font-mono pointer-events-auto backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-6xl h-[90vh] bg-zinc-950 border border-cyan-900/30 rounded-lg shadow-[0_0_50px_rgba(8,145,178,0.1)] flex overflow-hidden relative">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(8,145,178,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Sidebar / Detail View */}
        <div className="w-80 border-r border-cyan-900/30 bg-zinc-900/50 p-6 flex flex-col z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
              <BrainCircuit className="w-8 h-8" />
              SKILL TREE
            </h2>
            <p className="text-xs text-cyan-600/60 mt-1">NEURAL INTERFACE V2.0</p>
          </div>

          {selectedSkill ? (
            <div className="animate-in slide-in-from-left-4 duration-300">
              <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
                {isUnlocked(selectedSkill) ? <Unlock size={32} /> : <Lock size={32} />}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{selectedSkill.title}</h3>
              <div className="text-xs font-bold px-2 py-1 rounded bg-cyan-950/50 text-cyan-400 inline-block mb-4 border border-cyan-900/50 uppercase">
                {selectedSkill.category}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                {selectedSkill.description}
              </p>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 uppercase">Proficiency</div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 transition-all duration-1000 ease-out"
                    style={{ width: `${getProgress(selectedSkill)}%` }}
                  />
                </div>
                <div className="text-right text-xs text-cyan-400">{getProgress(selectedSkill)}%</div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-gray-600 text-sm">
              SELECT A NODE<br/>TO VIEW DETAILS
            </div>
          )}

          <button 
            onClick={onClose}
            className="mt-auto flex items-center justify-center gap-2 p-3 rounded border border-red-900/30 text-red-400 hover:bg-red-950/30 transition-colors uppercase text-sm font-bold tracking-widest"
          >
            <X size={16} />
            Close Interface
          </button>
        </div>

        {/* Main Tree Area */}
        <div className="flex-1 overflow-auto p-8 z-10 scrollbar-thin scrollbar-thumb-cyan-900/20 scrollbar-track-transparent">
          <div className="flex flex-col gap-12 min-w-max">
            {Object.entries(categories).map(([key, skills]) => (
              <div key={key} className="relative">
                <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">
                  {key} Layer
                </h3>
                <div className="flex flex-wrap gap-8">
                  {skills.map((skill) => {
                    const unlocked = isUnlocked(skill)
                    const isSelected = selectedSkill?.id === skill.id
                    
                    return (
                      <button
                        key={skill.id}
                        onClick={() => setSelectedSkill(skill)}
                        className={cn(
                          "relative group w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105",
                          unlocked 
                            ? "bg-cyan-950/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]" 
                            : "bg-zinc-900 border-zinc-800 text-zinc-700 grayscale",
                          isSelected && "ring-2 ring-white ring-offset-2 ring-offset-black scale-110 z-20 bg-cyan-900/40"
                        )}
                      >
                        {unlocked ? <Unlock size={24} /> : <Lock size={24} />}
                        <span className="text-[10px] mt-2 font-bold max-w-[90%] truncate text-center px-1">
                          {skill.title}
                        </span>
                        
                        {/* Connecting Lines (Simplified visual only) */}
                        {/* In a real tree, we'd draw SVG lines here */}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}
