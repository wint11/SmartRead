"use client"

import { useState, useEffect, useRef } from "react"
import { X, Minus, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface OSWindowProps {
  id: string
  title: string
  isOpen: boolean
  isActive: boolean
  onClose: () => void
  onFocus: () => void
  onMinimize?: () => void
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  children: React.ReactNode
  icon?: React.ReactNode
}

export function OSWindow({
  title,
  isOpen,
  isActive,
  onClose,
  onFocus,
  onMinimize,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 600, height: 400 },
  children,
  icon
}: OSWindowProps) {
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [preMaximizeState, setPreMaximizeState] = useState({ position, size })

  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return
    onFocus()
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      setPosition(preMaximizeState.position)
      setSize(preMaximizeState.size)
    } else {
      setPreMaximizeState({ position, size })
      setPosition({ x: 0, y: 0 })
      setSize({ width: window.innerWidth, height: window.innerHeight - 48 }) // -48 for taskbar
    }
    setIsMaximized(!isMaximized)
  }

  if (!isOpen) return null

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute flex flex-col bg-[#c0c0c0] shadow-xl overflow-hidden",
        "border-t-white border-l-white border-b-black border-r-black border-2", // Windows 95 outer bevel
        isActive ? "z-40" : "z-30"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        boxShadow: isActive ? "2px 2px 10px rgba(0,0,0,0.5)" : "none"
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className={cn(
          "flex items-center justify-between px-1 py-0.5 select-none cursor-default mx-0.5 mt-0.5",
          isActive 
            ? "bg-[#000080] text-white" 
            : "bg-[#808080] text-[#c0c0c0]"
        )}
        onMouseDown={handleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center gap-2 font-bold text-sm truncate px-1">
          {icon && <span className="w-4 h-4">{icon}</span>}
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <WindowButton onClick={(e) => { e.stopPropagation(); onMinimize?.() }}>
            <Minus className="w-3 h-3 relative bottom-1" />
          </WindowButton>
          <WindowButton onClick={(e) => { e.stopPropagation(); toggleMaximize() }}>
            <Square className="w-3 h-3 relative bottom-0.5" />
          </WindowButton>
          <WindowButton onClick={(e) => { e.stopPropagation(); onClose() }} className="ml-1">
            <X className="w-3 h-3" />
          </WindowButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#c0c0c0] p-1 text-black font-sans text-sm relative">
         <div className="w-full h-full border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white bg-white">
            {children}
         </div>
      </div>
    </div>
  )
}

function WindowButton({ onClick, children, className }: { onClick: (e: React.MouseEvent) => void, children: React.ReactNode, className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-4 h-4 flex items-center justify-center bg-[#c0c0c0] text-black border border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white",
        className
      )}
    >
      {children}
    </button>
  )
}
