"use client"

import { cn } from "@/lib/utils"
import { Folder, FileText, Gamepad2, AlertTriangle, HardDrive, Monitor } from "lucide-react"

interface OSDesktopIconProps {
  label: string
  type: 'folder' | 'text' | 'image' | 'app'
  selected: boolean
  onClick: (e: React.MouseEvent) => void
  onDoubleClick: (e: React.MouseEvent) => void
  icon?: string
}

export function OSDesktopIcon({
  label,
  type,
  selected,
  onClick,
  onDoubleClick,
  icon
}: OSDesktopIconProps) {
  
  const getIcon = () => {
    if (icon === 'gamepad') return <Gamepad2 className="w-8 h-8 text-purple-600" />
    if (icon === 'computer') return <Monitor className="w-8 h-8 text-blue-300" />
    
    switch (type) {
      case 'folder':
        return <Folder className="w-8 h-8 text-yellow-500 fill-yellow-500" />
      case 'text':
        return <FileText className="w-8 h-8 text-white fill-gray-200" />
      case 'app':
        return <HardDrive className="w-8 h-8 text-blue-500" />
      default:
        return <FileText className="w-8 h-8 text-white" />
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-24 p-2 gap-1 cursor-pointer select-none border border-transparent hover:border-white/20 hover:bg-white/10 rounded",
        selected && "bg-[#000080]/50 border-dotted border-white"
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="filter drop-shadow-lg">
        {getIcon()}
      </div>
      <span className={cn(
        "text-white text-xs text-center break-words px-1",
        selected && "bg-[#000080]"
      )}>
        {label}
      </span>
    </div>
  )
}
