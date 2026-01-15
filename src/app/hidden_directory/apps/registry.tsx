import { AppConfig } from "./types"
import { FileExplorerApp } from "./file-explorer"
import { NotepadApp } from "./notepad"
import { DoomApp } from "./doom"
import { MinesweeperApp } from "./minesweeper"

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
  }
}

export function getApp(id: string): AppConfig | undefined {
  return APP_REGISTRY[id]
}
