"use client"

import { AppProps } from "../types"
import { AlertTriangle } from "lucide-react"

export function ImageViewerApp({ file }: AppProps) {
  // If file content is base64, create a data URI
  // Assuming content is base64 encoded image data if not a URL
  let imgSrc = file?.src
  
  if (!imgSrc && file?.content) {
      if (file.content.startsWith('[BINARY DATA]')) {
          // It's a placeholder, can't view as image
          // But we should allow the user to see that it IS binary data
          imgSrc = undefined
      } else if (file.content.startsWith('data:image')) {
          imgSrc = file.content
      } else {
          // It might be a text file masquerading as an image (CTF trick)
          // Or just base64 without prefix?
          // For this CTF, let's show the text content if it's short, or a specific error
          imgSrc = undefined
      }
  }

  if (!imgSrc) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-200 text-gray-500 p-4 text-center">
        <AlertTriangle className="w-12 h-12 mb-2 text-yellow-500" />
        <p className="font-bold">Preview not available</p>
        <p className="text-sm mt-2">The file format is not supported or the file is corrupted.</p>
        {file?.content && (
            <div className="mt-4 p-2 bg-gray-100 border border-gray-300 rounded text-xs font-mono text-left max-w-full overflow-auto max-h-32 whitespace-pre-wrap">
                {file.content.slice(0, 200)}
                {file.content.length > 200 && "..."}
            </div>
        )}
        <p className="text-xs mt-2 text-gray-400">Hint: Try using terminal tools to inspect this file.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-black items-center justify-center overflow-hidden">
      <img 
        src={imgSrc} 
        alt={file?.name || "Image"} 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  )
}
