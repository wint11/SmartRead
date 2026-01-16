"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { OSBootScreen } from "./os-boot-screen"
import { OSWindow } from "./os-window"
import { OSDesktopIcon } from "./os-desktop-icon"
import { FileSystemNode, initialFileSystem } from "./file-system"
import { getApp, APP_REGISTRY } from "../apps/registry"
import { AppProps } from "../apps/types"
import { StartMenu } from "./start-menu"
import { useSystemInterceptors } from "../hooks/use-system-interceptors"
import { ContextMenu } from "./context-menu"

interface WindowState {
  id: string
  appId: string
  title: string
  file?: FileSystemNode
  zIndex: number
  minimized: boolean
  width: number
  height: number
}

export function OSDesktop() {
  const [booted, setBooted] = useState(false)
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [nextZIndex, setNextZIndex] = useState(10)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [showShutdown, setShowShutdown] = useState(false)
  const startButtonRef = useRef<HTMLButtonElement>(null)
  
  const { contextMenu, closeContextMenu } = useSystemInterceptors()

  // Find the desktop folder
  const desktopFolder = initialFileSystem[0]?.children?.find(c => c.id === 'desktop')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleBootComplete = () => {
    setBooted(true)
  }

  const handleRefresh = () => {
    // Fake refresh effect
    setBooted(false)
    setTimeout(() => setBooted(true), 100)
    closeContextMenu()
  }

  const handleProperties = () => {
    alert("System Properties:\n\nOS: Forbidden OS v1.0\nMemory: 640K (should be enough for anyone)\nCPU: 486DX2-66")
    closeContextMenu()
  }

  const focusWindow = (id: string) => {
    setActiveWindowId(id)
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex, minimized: false } : w
    ))
    setNextZIndex(prev => prev + 1)
  }

  const launchApp = useCallback((appId: string, file?: FileSystemNode) => {
    // Unique ID for the window. 
    // If it's a singleton app (like minesweeper maybe?), we might want to check if open.
    // For now, allow multiple instances unless it's the same file.
    
    const windowId = file ? `${appId}-${file.id}` : `${appId}-${Date.now()}`
    
    // Check if window already open
    const existingWindow = windows.find(w => w.id === windowId)
    if (existingWindow) {
      focusWindow(windowId)
      return
    }

    const appConfig = getApp(appId)
    if (!appConfig) {
      console.error(`App ${appId} not found`)
      return
    }

    const newWindow: WindowState = {
      id: windowId,
      appId: appId,
      title: file ? file.name : appConfig.name,
      file: file,
      zIndex: nextZIndex,
      minimized: false,
      width: appConfig.defaultWidth || 600,
      height: appConfig.defaultHeight || 400
    }
    
    setWindows(prev => [...prev, newWindow])
    setNextZIndex(prev => prev + 1)
    setActiveWindowId(windowId)
    
    // Close start menu
    setIsStartMenuOpen(false)
  }, [windows, nextZIndex])

  const handleFileOpen = (node: FileSystemNode) => {
    if (node.type === 'folder') {
      launchApp('explorer', node)
    } else if (node.type === 'app') {
      if (node.appId === 'explorer' && node.id === 'my_computer') {
        // Special case: My Computer shortcut opens the root
        launchApp('explorer', initialFileSystem[0])
      } else if (node.appId) {
        launchApp(node.appId, node)
      }
    } else if (node.type === 'text') {
      launchApp('notepad', node)
    } else {
      // Default to notepad for unknown types for now
      launchApp('notepad', node)
    }
  }

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    if (activeWindowId === id) {
      setActiveWindowId(null)
    }
  }

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        if (activeWindowId === id && !w.minimized) {
          setActiveWindowId(null)
        }
        return { ...w, minimized: !w.minimized }
      }
      return w
    }))
  }

  if (!booted) {
    return <OSBootScreen onBootComplete={handleBootComplete} />
  }

  if (showShutdown) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-[#ff6600] font-mono text-xl animate-pulse">
         It is now safe to turn off your computer.
      </div>
    )
  }

  return (
    <div 
      className="relative w-full h-screen bg-[#008080] overflow-hidden select-none font-sans"
      onClick={() => {
        setSelectedIconId(null)
        setIsStartMenuOpen(false)
        closeContextMenu()
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 p-4 flex flex-col gap-4 flex-wrap content-start h-[calc(100%-48px)]">
        {desktopFolder?.children?.map(node => (
          <OSDesktopIcon
            key={node.id}
            label={node.name}
            type={node.type}
            icon={node.icon}
            selected={selectedIconId === node.id}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedIconId(node.id)
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              handleFileOpen(node)
            }}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.map(window => {
        const appConfig = getApp(window.appId)
        if (!appConfig) return null
        
        const AppComponent = appConfig.component

        return (
          <OSWindow
            key={window.id}
            id={window.id}
            title={window.title}
            isOpen={!window.minimized}
            isActive={activeWindowId === window.id}
            onClose={() => closeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            onMinimize={() => toggleMinimize(window.id)}
            initialSize={{ width: window.width, height: window.height }}
            icon={<div className="w-4 h-4 mr-2" />} // TODO: Render icon
          >
            <AppComponent 
              windowId={window.id}
              file={window.file}
              onClose={() => closeWindow(window.id)}
              isFocused={activeWindowId === window.id}
              launchApp={launchApp}
            />
          </OSWindow>
        )
      })}

      {contextMenu.isOpen && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isOpen={contextMenu.isOpen}
          onRefresh={handleRefresh}
          onProperties={handleProperties}
          onClose={closeContextMenu}
        />
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-[#c0c0c0] border-t-2 border-white flex items-center px-1 z-50">
        <div className="relative">
          <button 
            ref={startButtonRef}
            onClick={(e) => {
              e.stopPropagation()
              setIsStartMenuOpen(!isStartMenuOpen)
            }}
            className={cn(
              "flex items-center gap-1 px-2 py-1 shadow-[2px_2px_0px_0px_#000_inset,-2px_-2px_0px_0px_#fff_inset] active:shadow-[1px_1px_0px_0px_#000_inset] font-bold mr-2 border-2 border-t-white border-l-white border-b-black border-r-black",
              isStartMenuOpen ? "bg-[#e0e0e0] border-t-black border-l-black border-b-white border-r-white" : "bg-[#c0c0c0]"
            )}
          >
            <span className="text-xl">❖</span>
            Start
          </button>
          
          <StartMenu 
            isOpen={isStartMenuOpen} 
            onClose={() => setIsStartMenuOpen(false)}
            onLaunch={(appId) => {
              launchApp(appId)
              setIsStartMenuOpen(false)
            }}
            onShutdown={() => setShowShutdown(true)}
          />
        </div>

        <div className="flex-1 flex gap-1 overflow-hidden px-2">
          {windows.map(window => (
            <button
              key={window.id}
              onClick={() => {
                if (window.minimized) {
                  toggleMinimize(window.id)
                  focusWindow(window.id)
                } else if (activeWindowId === window.id) {
                  toggleMinimize(window.id)
                } else {
                  focusWindow(window.id)
                }
              }}
              className={cn(
                "flex items-center gap-2 px-2 py-1 min-w-[120px] max-w-[200px] text-sm truncate border-2",
                activeWindowId === window.id && !window.minimized
                  ? "bg-[#e0e0e0] border-t-black border-l-black border-b-white border-r-white font-bold bg-[url('/noise.png')] bg-opacity-10" // Depressed
                  : "bg-[#c0c0c0] border-t-white border-l-white border-b-black border-r-black" // Raised
              )}
            >
              {/* TODO: Add App Icon here */}
              <span className="truncate">{window.title}</span>
            </button>
          ))}
        </div>

        <div className="bg-[#c0c0c0] border-2 border-t-gray-600 border-l-gray-600 border-b-white border-r-white px-3 py-1 text-sm font-mono">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}
