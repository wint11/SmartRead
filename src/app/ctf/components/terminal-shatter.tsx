import React, { useMemo } from 'react'
import { cn } from "@/lib/utils"

export function TerminalShatter({ children }: { children: React.ReactNode }) {
  const shards = useMemo(() => {
    const rows = 5
    const cols = 5
    const newShards = []

    // 1. Generate Jittered Grid Vertices
    // vertices[r][c] = { x: %, y: % }
    const vertices: {x: number, y: number}[][] = []
    
    for (let r = 0; r <= rows; r++) {
        const rowVertices = []
        for (let c = 0; c <= cols; c++) {
            let x = (c / cols) * 100
            let y = (r / rows) * 100

            // Apply jitter to internal vertices
            // Don't jitter boundaries to ensure full coverage
            if (r > 0 && r < rows && c > 0 && c < cols) {
                const jitterRangeX = (100 / cols) * 0.4 // 40% of cell width jitter
                const jitterRangeY = (100 / rows) * 0.4
                x += (Math.random() - 0.5) * jitterRangeX
                y += (Math.random() - 0.5) * jitterRangeY
            }
            rowVertices.push({ x, y })
        }
        vertices.push(rowVertices)
    }

    // 2. Create Shards from Quads
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Get the 4 corners of the quad
            const p1 = vertices[r][c]     // Top-Left
            const p2 = vertices[r][c+1]   // Top-Right
            const p3 = vertices[r+1][c+1] // Bottom-Right
            const p4 = vertices[r+1][c]   // Bottom-Left

            // Calculate Bounding Box
            const minX = Math.min(p1.x, p2.x, p3.x, p4.x)
            const maxX = Math.max(p1.x, p2.x, p3.x, p4.x)
            const minY = Math.min(p1.y, p2.y, p3.y, p4.y)
            const maxY = Math.max(p1.y, p2.y, p3.y, p4.y)

            const width = maxX - minX
            const height = maxY - minY

            // Convert global coordinates to local percentages for clip-path
            // Local X = (Global X - minX) / width * 100
            const toLocal = (p: {x: number, y: number}) => ({
                x: ((p.x - minX) / width) * 100,
                y: ((p.y - minY) / height) * 100
            })

            const lp1 = toLocal(p1)
            const lp2 = toLocal(p2)
            const lp3 = toLocal(p3)
            const lp4 = toLocal(p4)

            const clipPath = `polygon(${lp1.x}% ${lp1.y}%, ${lp2.x}% ${lp2.y}%, ${lp3.x}% ${lp3.y}%, ${lp4.x}% ${lp4.y}%)`

            // Animation props
            const randomRotate = (Math.random() - 0.5) * 120 
            const randomTx = (Math.random() - 0.5) * 300
            const delay = Math.random() * 0.2
            const duration = 1.5 + Math.random() * 0.5

            newShards.push({
                id: r * cols + c,
                clipPath,
                style: {
                    left: `${minX}%`,
                    top: `${minY}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                    '--tx': `${randomTx}px`,
                    '--r': `${randomRotate}deg`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`
                } as React.CSSProperties,
                innerStyle: {
                    width: `${(100 / width) * 100}%`,
                    height: `${(100 / height) * 100}%`,
                    left: `${(minX / width) * -100}%`,
                    top: `${(minY / height) * -100}%`
                } as React.CSSProperties
            })
        }
    }
    return newShards
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
        {shards.map(shard => (
            <div
                key={shard.id}
                className="absolute overflow-hidden animate-shatter-fall"
                style={{ ...shard.style, clipPath: shard.clipPath }}
            >
                {/* Inner Content Positioned to match global coordinates */}
                <div style={{ position: 'absolute', ...shard.innerStyle }}>
                    {children}
                </div>
                
                {/* Border effect (might look weird with clip-path, but worth a try for glass edge) */}
                <div className="absolute inset-0 bg-white/5 pointer-events-none" />
            </div>
        ))}
    </div>
  )
}
