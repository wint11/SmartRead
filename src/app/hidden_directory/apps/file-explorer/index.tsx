"use client"

import { useState, useMemo } from "react"
import { FileSystemNode, initialFileSystem } from "../../components/file-system"
import { Folder, FileText, ArrowLeft, Gamepad2, HardDrive, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppProps } from "../types"
import { useCTF } from "@/app/ctf/context/game-context"
import { adapterCtfToDesktop } from "../../utils/fs-adapter"

export function FileExplorerApp({ file, launchApp }: AppProps) {
  const { fileSystem: ctfFS } = useCTF()
  
  // Convert live CTF FS to Desktop FS format
  // We memoize this to prevent flickering, but it depends on ctfFS changes
  const liveRoot = useMemo(() => adapterCtfToDesktop(ctfFS), [ctfFS])
  
  // Start from the provided file (folder) or root
  // If file is provided (e.g. shortcut), we try to find it in the new live tree, 
  // otherwise default to root
  const initialNode = file || { id: 'root', name: 'My Computer', type: 'folder', children: liveRoot }
  
  const [currentPath, setCurrentPath] = useState<FileSystemNode[]>([initialNode])
  
  // If we are at root, we use liveRoot. Otherwise use the children of current node.
  // We need to re-find the current node in the live tree to get updates.
  // Ensure we always have a valid current node
  const currentNode = currentPath[currentPath.length - 1] || initialNode
  
  // Helper to find node in tree
  const findNodeInTree = (nodes: FileSystemNode[], id: string): FileSystemNode | undefined => {
      for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
              const found = findNodeInTree(node.children, id);
              if (found) return found;
          }
      }
      return undefined;
  }

  // Get display items
  let displayItems: FileSystemNode[] = []
  if (!currentNode) {
      displayItems = liveRoot
  } else if (currentNode.id === 'root' || currentNode.id === 'my_computer') {
      displayItems = liveRoot
  } else {
      // Try to find the current node in the live tree to get latest children
      // Note: adapter generates IDs based on path, so they should be stable
      const liveNode = findNodeInTree(liveRoot, currentNode.id)
      // If live node not found (deleted?), fallback to empty or stay on current if static
      displayItems = liveNode?.children || currentNode.children || []
  }

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleNavigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1))
      setSelectedId(null)
    }
  }

  const handleOpen = (node: FileSystemNode) => {
    if (node.type === 'folder') {
      setCurrentPath(prev => [...prev, node])
      setSelectedId(null)
    } else if (node.type === 'app') {
       // Launch app directly
       if (node.appId) {
         launchApp(node.appId, node)
       }
    } else {
      // Launch associated app based on type
      if (node.type === 'text') {
        launchApp('notepad', node)
      } else if (node.type === 'image') {
        launchApp('image-viewer', node)
      }
    }
  }

  const getIcon = (node: FileSystemNode) => {
    if (node.icon === 'gamepad') return <Gamepad2 className="w-8 h-8 text-purple-600" />
    if (node.icon === 'recycle-bin') return <div className="w-8 h-8 text-green-700 font-bold border-2 border-green-700 rounded-sm flex items-center justify-center">RB</div>
    if (node.icon === 'computer') return <HardDrive className="w-8 h-8 text-blue-500" />
    
    switch (node.type) {
      case 'folder':
        return <Folder className="w-8 h-8 text-yellow-500 fill-yellow-500" />
      case 'text':
        return <FileText className="w-8 h-8 text-gray-500" />
      case 'app':
        return <HardDrive className="w-8 h-8 text-blue-500" />
      case 'image':
        return <ImageIcon className="w-8 h-8 text-green-500" />
      default:
        return <FileText className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-1 border-b border-gray-300 bg-gray-100">
        <button
          onClick={handleNavigateUp}
          disabled={currentPath.length <= 1}
          className="p-1 hover:bg-gray-200 disabled:opacity-30 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 px-2 py-0.5 bg-white border border-gray-300 text-sm truncate">
          {currentPath.map(n => n.name).join('\\')}
        </div>
      </div>

      {/* File Grid */}
      <div className="flex-1 p-2 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] content-start gap-2 overflow-auto">
        {displayItems.map(node => (
          <div
            key={node.id}
            className={cn(
              "flex flex-col items-center p-2 cursor-pointer border border-transparent hover:bg-blue-50 rounded group",
              selectedId === node.id && "bg-blue-100 border-blue-200"
            )}
            onClick={() => setSelectedId(node.id)}
            onDoubleClick={() => handleOpen(node)}
          >
            {getIcon(node)}
            <span className={cn(
              "text-xs text-center mt-1 break-all line-clamp-2 px-1 rounded",
              selectedId === node.id ? "text-blue-700" : "text-gray-700"
            )}>
              {node.name}
            </span>
          </div>
        ))}
        
        {(displayItems.length === 0) && (
          <div className="col-span-full text-center text-gray-400 text-sm mt-8">
            This folder is empty.
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <div className="border-t border-gray-300 p-1 bg-gray-100 text-xs text-gray-600">
        {displayItems.length} object(s)
      </div>
    </div>
  )
}
