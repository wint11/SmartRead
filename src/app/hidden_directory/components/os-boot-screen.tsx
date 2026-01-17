"use client"

import { useEffect, useState } from "react"

interface OSBootScreenProps {
  onBootComplete: () => void
}

export function OSBootScreen({ onBootComplete }: OSBootScreenProps) {
  const [lines, setLines] = useState<string[]>([])
  const [waitingForInput, setWaitingForInput] = useState(false)

  const bootSequence = [
    "BIOS Date 01/15/95 14:22:55 Ver: 1.0.2",
    "CPU: Intel 486DX2-66",
    "640K RAM System ... OK",
    "Extended RAM 8192K ... OK",
    "Cache Memory 256K ... OK",
    "",
    "Initializing CD-ROM Drive ...",
    "Found: MITSUMI CD-ROM",
    "",
    "Loading Forbidden OS ...",
    "Mounting file system ...",
    "Checking integrity ...",
    "Loading GUI ...",
    "Done.",
    "",
    "Starting session..."
  ]

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex >= bootSequence.length) {
        clearInterval(interval)
        setWaitingForInput(true)
        return
      }

      setLines(prev => [...prev, bootSequence[currentIndex]])
      currentIndex++
    }, 100) // Sped up slightly for better UX

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!waitingForInput) return

    const handleStart = () => {
        // Try fullscreen
        document.documentElement.requestFullscreen().catch(e => console.log("Fullscreen blocked:", e))
        onBootComplete()
    }

    window.addEventListener('keydown', handleStart)
    window.addEventListener('click', handleStart)
    return () => {
        window.removeEventListener('keydown', handleStart)
        window.removeEventListener('click', handleStart)
    }
  }, [waitingForInput, onBootComplete])

  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 text-lg z-50 overflow-hidden cursor-pointer">
      {lines.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">{line}</div>
      ))}
      <div className="animate-pulse">_</div>
      
      {waitingForInput && (
          <div className="mt-8 animate-pulse text-green-400 border border-green-400 p-2 inline-block">
              SYSTEM READY. PRESS ANY KEY OR CLICK TO INITIALIZE.
          </div>
      )}
    </div>
  )
}
