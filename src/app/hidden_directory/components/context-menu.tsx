"use client"

import { useEffect, useRef } from "react"

interface ContextMenuProps {
  x: number
  y: number
  isOpen: boolean
  onClose: () => void
  onRefresh: () => void
  onProperties: () => void
}

export function ContextMenu({ x, y, isOpen, onClose, onRefresh, onProperties }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && menuRef.current) {
      // Adjust position if it goes off screen
      const menu = menuRef.current
      const rect = menu.getBoundingClientRect()
      
      if (x + rect.width > window.innerWidth) {
        menu.style.left = `${x - rect.width}px`
      } else {
        menu.style.left = `${x}px`
      }
      
      if (y + rect.height > window.innerHeight) {
        menu.style.top = `${y - rect.height}px`
      } else {
        menu.style.top = `${y}px`
      }
    }
  }, [x, y, isOpen])

  if (!isOpen) return null

  return (
    <div 
      ref={menuRef}
      className="fixed z-[9999] w-40 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black shadow-xl"
      style={{ left: x, top: y }}
    >
      <div className="flex flex-col py-1">
        <MenuItem label="View" disabled />
        <MenuItem label="Arrange Icons" disabled />
        <MenuItem label="Refresh" onClick={onRefresh} />
        <div className="h-[1px] bg-gray-400 border-b border-white my-1 mx-1" />
        <MenuItem label="Paste" disabled />
        <MenuItem label="Paste Shortcut" disabled />
        <div className="h-[1px] bg-gray-400 border-b border-white my-1 mx-1" />
        <MenuItem label="New" disabled />
        <div className="h-[1px] bg-gray-400 border-b border-white my-1 mx-1" />
        <MenuItem label="Properties" onClick={onProperties} />
      </div>
    </div>
  )
}

function MenuItem({ 
  label, 
  onClick, 
  disabled = false 
}: { 
  label: string
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <div 
      className={`px-4 py-1 text-sm select-none ${disabled ? 'text-gray-500' : 'hover:bg-[#000080] hover:text-white cursor-pointer'}`}
      onClick={(e) => {
        if (!disabled && onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
    >
      {label}
    </div>
  )
}
