import { AppConfig } from "./types"
import { FileExplorerApp } from "./file-explorer"
import { NotepadApp } from "./notepad"
import { DoomApp } from "./doom"
import { MinesweeperApp } from "./minesweeper"
import { TerminalApp } from "./terminal"
import { BrowserApp } from "./browser"
import { ImageViewerApp } from "./image-viewer"

export const APP_REGISTRY: Record<string, AppConfig> = {
  'explorer': {
    id: 'explorer',
    name: 'File Explorer',
    icon: 'folder',
    component: FileExplorerApp,
    defaultWidth: 600,
    defaultHeight: 400
  },
  'notepad': {
    id: 'notepad',
    name: 'Notepad',
    icon: 'file-text',
    component: NotepadApp,
    defaultWidth: 500,
    defaultHeight: 300
  },
  'doom': {
    id: 'doom',
    name: 'DOOM',
    icon: 'gamepad',
    component: DoomApp,
    defaultWidth: 800,
    defaultHeight: 600
  },
  'minesweeper': {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: 'grid',
    component: MinesweeperApp,
    defaultWidth: 350,
    defaultHeight: 450,
    resizable: false
  },
  'terminal': {
    id: 'terminal',
    name: 'Terminal',
    icon: 'terminal',
    component: TerminalApp,
    defaultWidth: 600,
    defaultHeight: 400
  },
  'browser': {
    id: 'browser',
    name: 'Netscape',
    icon: 'globe',
    component: BrowserApp,
    defaultWidth: 800,
    defaultHeight: 600
  },
  'image-viewer': {
    id: 'image-viewer',
    name: 'Image Viewer',
    icon: 'image',
    component: ImageViewerApp,
    defaultWidth: 500,
    defaultHeight: 500
  }
}

export function getApp(id: string): AppConfig | undefined {
  return APP_REGISTRY[id]
}
