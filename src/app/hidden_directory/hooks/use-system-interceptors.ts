"use client"

import { useEffect, useState, useCallback } from "react"

interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
}

export function useSystemInterceptors() {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0
  })

  // Prevent default browser context menu and show custom one
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      setContextMenu({
        isOpen: true,
        x: e.clientX,
        y: e.clientY
      })
    }

    const handleClick = () => {
      setContextMenu(prev => ({ ...prev, isOpen: false }))
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Intercept keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault()
        return
      }

      // Block Ctrl+Shift+I/J/C (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
        e.preventDefault()
        return
      }

      // Block Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault()
        return
      }
      
      // Block F5 and Ctrl+R (Refresh) - Optional, but enhances immersion
      if (e.key === 'F5' || (e.ctrlKey && (e.key === 'R' || e.key === 'r'))) {
        e.preventDefault()
        // Maybe trigger a fake reboot later?
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    contextMenu,
    closeContextMenu: () => setContextMenu(prev => ({ ...prev, isOpen: false }))
  }
}
