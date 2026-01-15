"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AppProps } from "../types"

export function DoomApp({ }: AppProps) {
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState("Click to kill bugs!")

  const handleKill = () => {
    setScore(s => s + 100)
    setMessage("Bang! Bug squashed.")
    setTimeout(() => setMessage("Waiting for targets..."), 1000)
  }

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center text-green-500 font-mono p-4">
      <div className="border-2 border-green-500 p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">DOOM.EXE (Shareware)</h1>
        <div className="mb-4 h-32 flex items-center justify-center border border-green-900 bg-green-900/20">
          {message}
        </div>
        <div className="text-xl mb-4">SCORE: {score}</div>
        <Button 
          onClick={handleKill}
          className="bg-green-600 hover:bg-green-700 text-black font-bold w-full"
        >
          SHOOT
        </Button>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        IDDQD not supported.
      </p>
    </div>
  )
}
