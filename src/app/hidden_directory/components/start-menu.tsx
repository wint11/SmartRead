"use client"

import { cn } from "@/lib/utils"
import { ChevronRight, LogOut, Gamepad2, FileText, HardDrive, Calculator, Settings } from "lucide-react"

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
  onLaunch: (appId: string) => void
  onShutdown: () => void
}

export function StartMenu({ isOpen, onClose, onLaunch, onShutdown }: StartMenuProps) {
  if (!isOpen) return null

  return (
    <div className="absolute bottom-12 left-1 w-64 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-600 border-r-gray-600 shadow-xl z-[60] flex flex-col">
      {/* Side Bar */}
      <div className="flex h-full">
        <div className="w-8 bg-[#000080] text-white flex items-end justify-center pb-2 relative overflow-hidden">
          <span className="transform -rotate-90 text-lg font-bold whitespace-nowrap origin-bottom-left translate-x-full mb-4">
            Forbidden OS
          </span>
        </div>
        
        {/* Menu Items */}
        <div className="flex-1 py-1">
          <MenuItem 
            icon={<HardDrive className="w-6 h-6" />} 
            label="File Explorer" 
            onClick={() => onLaunch('explorer')} 
          />
          <MenuItem 
            icon={<FileText className="w-6 h-6" />} 
            label="Notepad" 
            onClick={() => onLaunch('notepad')} 
          />
          
          <div className="h-[1px] bg-gray-400 border-b border-white my-1 mx-1" />
          
          <MenuItem 
            icon={<Gamepad2 className="w-6 h-6" />} 
            label="Games" 
            hasSubmenu
          />
          <MenuItem 
            icon={<Settings className="w-6 h-6" />} 
            label="Settings" 
          />
          
          <div className="h-[1px] bg-gray-400 border-b border-white my-1 mx-1" />

          <MenuItem 
            icon={<LogOut className="w-6 h-6" />} 
            label="Shut Down..." 
            onClick={onShutdown} 
          />
        </div>
      </div>
    </div>
  )
}

function MenuItem({ 
  icon, 
  label, 
  onClick, 
  hasSubmenu = false 
}: { 
  icon: React.ReactNode
  label: string
  onClick?: () => void
  hasSubmenu?: boolean
}) {
  return (
    <div 
      className="flex items-center gap-3 px-3 py-2 hover:bg-[#000080] hover:text-white cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      <span className="flex-1 text-sm">{label}</span>
      {hasSubmenu && <ChevronRight className="w-4 h-4 text-black group-hover:text-white" />}
    </div>
  )
}
