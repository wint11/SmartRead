"use client"

import { useState } from "react"
import { FileSystemNode, initialFileSystem } from "../../components/file-system"
import { Folder, FileText, ArrowLeft, Gamepad2, HardDrive, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppProps } from "../types"

export function FileExplorerApp({ file, launchApp }: AppProps) {
  // Start from the provided file (folder) or root
  const initialNode = file || initialFileSystem[0]
  
  const [currentPath, setCurrentPath] = useState<FileSystemNode[]>([initialNode])
  const currentNode = currentPath[currentPath.length - 1]
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
        {currentNode.children?.map(node => (
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
        
        {(!currentNode.children || currentNode.children.length === 0) && (
          <div className="col-span-full text-center text-gray-400 text-sm mt-8">
            This folder is empty.
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <div className="border-t border-gray-300 p-1 bg-gray-100 text-xs text-gray-600">
        {currentNode.children?.length || 0} object(s)
      </div>
    </div>
  )
}
