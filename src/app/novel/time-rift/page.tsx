
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Timeline Error | SmartRead",
  description: "Anomaly detected.",
}

export default function TimeRiftPage() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="text-4xl font-bold glitch-text animate-pulse">404: TIMELINE NOT FOUND</h1>
        
        <div className="border border-green-900 bg-black/50 p-6 rounded-lg">
          <p className="mb-4 text-xl">System Alert: Temporal Anomaly Detected</p>
          <p className="leading-relaxed opacity-80">
            You have accessed a timeline that was pruned from the main branch. 
            This chapter was never meant to be published.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500">Decrypting deleted data...</p>
          <div className="w-full bg-gray-900 h-2 rounded overflow-hidden">
            <div className="bg-green-600 h-full w-[80%] animate-pulse"></div>
          </div>
        </div>

        <div className="mt-12 p-4 border-l-4 border-red-600 bg-red-900/10">
          <h2 className="text-xl font-bold text-red-500 mb-2">Restored Fragment:</h2>
          <p className="italic text-gray-400">
            "...and as the system clock struck 42, the backdoor opened. 
            The password was simple, yet elegant: 
            <span className="text-white font-bold bg-red-900/50 px-2 py-1 ml-2 select-all">flag&#123;time_traveler_paradox_4242&#125;</span>"
          </p>
        </div>

        <div className="text-center mt-16">
          <a href="/" className="text-sm text-gray-600 hover:text-white hover:underline">
            &lt; Return to Main Timeline
          </a>
        </div>
      </div>
    </div>
  )
}
