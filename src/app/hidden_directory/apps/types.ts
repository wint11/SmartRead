import { FileSystemNode } from "../components/file-system"

export interface AppProps {
  windowId: string
  file?: FileSystemNode
  onClose: () => void
  isFocused: boolean
  launchApp: (appId: string, file?: FileSystemNode) => void
}

export interface AppConfig {
  id: string
  name: string
  icon: string // Lucide icon name or path
  component: React.ComponentType<AppProps>
  defaultWidth?: number
  defaultHeight?: number
  resizable?: boolean
}
