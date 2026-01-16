"use client"

import Link from "next/link"
import Image from "next/image"
import { Novel } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Star, BookOpen, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface NovelCardProps {
  novel: Novel
  isGlitchTarget?: boolean
}

export function NovelCard({ novel, isGlitchTarget = false }: NovelCardProps) {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    if (!isGlitchTarget) return

    // Lower frequency glitch effect
    const interval = setInterval(() => {
      // 80% chance to glitch every 4 seconds (very rare)
      if (Math.random() > 0.8) {
        setGlitch(true)
        // Reset after short burst (150-300ms)
        setTimeout(() => setGlitch(false), 500 + Math.random() * 200)
      }
    }, 4000)
    
    return () => clearInterval(interval)
  }, [isGlitchTarget])

  return (
    <Link 
      href={glitch ? "/ctf" : `/novel/${novel.id}`} 
      className="group block h-full relative"
      onClick={() => {
        if (glitch) {
          // Allow default navigation to /ctf
        } else {
          // Default behavior
        }
      }}
    >
      {/* Glitch Overlay */}
      {glitch && (
        <div className="absolute inset-0 z-50 pointer-events-none bg-red-500/10 mix-blend-color-dodge animate-pulse" />
      )}

      <Card className="h-full overflow-hidden border-0 bg-transparent shadow-none">
        <div className={cn(
          "relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-sm transition-all duration-300 group-hover:shadow-xl ring-1 ring-black/5 dark:ring-white/10",
          glitch ? "shadow-red-500/20 group-hover:shadow-red-500/40" : "group-hover:shadow-primary/20"
        )}>
          <Image
            src={novel.coverUrl || "/placeholder.png"}
            alt={novel.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-110",
              glitch && "invert filter contrast-150 translate-x-[2px]"
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Glitch Artifacts */}
          {glitch && (
             <div className="absolute top-1/2 left-0 w-full h-1 bg-white/30 transform -translate-y-1/2" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Hover Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
             <div className="flex items-center justify-between text-xs text-white/90 font-medium mb-2">
               <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                 <Eye className="h-3.5 w-3.5" />
                 {novel.views > 10000 ? `${(novel.views / 10000).toFixed(1)}万` : novel.views}
               </span>
               <span className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                 <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                 {novel.rating}
               </span>
             </div>
             <div className="flex items-center justify-center w-full">
                <span className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300",
                  glitch ? "bg-red-600 text-white font-mono" : "bg-primary text-primary-foreground"
                )}>
                  {glitch ? <AlertTriangle className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                  {glitch ? "SYSTEM ERR" : "立即阅读"}
                </span>
             </div>
          </div>
        </div>
        
        <CardContent className="p-3 pt-4 space-y-1">
          <h3 className={cn(
            "line-clamp-1 font-bold tracking-tight text-lg transition-colors",
            glitch ? "text-red-500 font-mono" : "group-hover:text-primary"
          )}>
            {glitch ? "404_NOT_FOUND" : novel.title}
          </h3>
          <div className="flex items-center justify-between gap-2">
             <p className="line-clamp-1 text-sm text-muted-foreground">
              {glitch ? "Unknown" : novel.author}
            </p>
            <Badge variant="outline" className={cn(
              "h-5 px-1.5 text-[10px] font-normal border-muted-foreground/30 text-muted-foreground",
              glitch && "border-red-500/30 text-red-500/50"
            )}>
              {glitch ? "ERR" : novel.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
