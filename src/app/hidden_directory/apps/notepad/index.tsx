"use client"

import { AppProps } from "../types"

export function NotepadApp({ file }: AppProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-none border-b p-1 text-xs text-gray-600 bg-gray-50 flex gap-4">
        <span>File</span>
        <span>Edit</span>
        <span>Search</span>
        <span>Help</span>
      </div>
      <textarea 
        className="flex-1 w-full h-full resize-none border-none p-2 font-mono text-sm outline-none selection:bg-blue-200"
        defaultValue={file?.content || ""}
        readOnly={true} // For now, read only
      />
    </div>
  )
}
