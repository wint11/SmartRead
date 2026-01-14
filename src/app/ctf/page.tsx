import { CtfChallenge } from "./ctf-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "CTF Challenge | SmartRead",
  description: "Secure Terminal Access Required",
}

export default function CtfPage() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-background text-foreground font-mono flex flex-col items-center justify-center p-4">
      {/* Flag 1: HTML Comment - Rendered to DOM */}
      <div dangerouslySetInnerHTML={{ __html: '<!-- flag{welcome_to_smartread_ctf_2026} -->' }} style={{ display: 'none' }} />
      
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between px-1">
          <h1 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            System Diagnostics
          </h1>
          <span className="text-xs text-muted-foreground/50">v1.0.0</span>
        </div>
        
        <CtfChallenge />
      </div>
    </div>
  )
}
