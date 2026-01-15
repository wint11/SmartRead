"use client"

import { useEffect, useState } from "react"

interface OSBootScreenProps {
  onBootComplete: () => void
}

export function OSBootScreen({ onBootComplete }: OSBootScreenProps) {
  const [lines, setLines] = useState<string[]>([])

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
        setTimeout(onBootComplete, 1000)
        return
      }

      setLines(prev => [...prev, bootSequence[currentIndex]])
      currentIndex++
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 text-lg z-50 overflow-hidden">
      {lines.map((line, index) => (
        <div key={index} className="whitespace-pre-wrap">{line}</div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  )
}
