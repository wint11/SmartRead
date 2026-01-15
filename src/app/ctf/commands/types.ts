import { Dispatch, SetStateAction } from "react"
import { DirectoryNode, FileSystemNode, FileNode } from "../data/filesystem"
import { TerminalLine, BombState } from "../hooks/use-ctf-game"
import { getFileContent } from "../actions"

export type CommandContext = {
    fileSystem: DirectoryNode
    setFileSystem: Dispatch<SetStateAction<DirectoryNode>>
    currentPath: string
    setCurrentPath: Dispatch<SetStateAction<string>>
    currentUser: string
    setCurrentUser: Dispatch<SetStateAction<string>>
    addToHistory: (type: 'input' | 'output', content: string) => void
    solvedFlags: number[]
    setSolvedFlags: Dispatch<SetStateAction<number[]>>
    bombState: BombState
    setBombState: Dispatch<SetStateAction<BombState>>
    sudoFailCount: number
    setSudoFailCount: Dispatch<SetStateAction<number>>
    setIsDeepLayer: Dispatch<SetStateAction<boolean>>
    setIsFlipped: Dispatch<SetStateAction<boolean>>
    setCommandNotFoundCount: Dispatch<SetStateAction<number>>
    activeTool: string | null
    setActiveTool: Dispatch<SetStateAction<string | null>>
    isSnakeActive: boolean
    setSnakeActive: Dispatch<SetStateAction<boolean>>
    resetGame: () => void
    clearHistory: () => void
}

export type CommandHandler = (args: string[], context: CommandContext) => Promise<void> | void;

// Helper to normalize path (copied from use-ctf-game)
export const normalizePath = (path: string, currentPath: string): string => {
    if (!path) return currentPath;
    
    // Handle absolute path
    let absolutePath = path.startsWith('/') ? path : `${currentPath}/${path}`;
    
    // Handle ~
    if (path.startsWith('~')) {
      absolutePath = path.replace('~', '/home/ctf');
    }
    
    // Normalize . and ..
    const parts = absolutePath.split('/').filter(p => p.length > 0 && p !== '.');
    const stack: string[] = [];
    
    for (const part of parts) {
      if (part === '..') {
        stack.pop();
      } else {
        stack.push(part);
      }
    }
    
    const result = '/' + stack.join('/');
    return result || '/';
}
  
export const findNode = (root: DirectoryNode, absPath: string): FileSystemNode | null => {
    if (absPath === '/') return root;
    
    const parts = absPath.split('/').filter(p => p.length > 0);
    let current: FileSystemNode = root;
    
    for (const part of parts) {
      if (current.type !== 'directory') return null;
      if (!current.children[part]) return null;
      current = current.children[part];
    }
    return current;
}
  
export const hasPermission = (node: FileSystemNode, user: string, op: 'read' | 'write' | 'execute'): boolean => {
    if (user === 'root') return true;
    
    const perms = node.permissions;
    let relevantPerms = '';
  
    if (node.owner === user) {
        relevantPerms = perms.slice(0, 3);
    } else if (node.group === user) {
        relevantPerms = perms.slice(3, 6);
    } else {
        relevantPerms = perms.slice(6, 9);
    }
  
    if (op === 'read') return relevantPerms.includes('r');
    if (op === 'write') return relevantPerms.includes('w');
    if (op === 'execute') return relevantPerms.includes('x') || relevantPerms.includes('s') || relevantPerms.includes('t');
    
    return false;
}
  
export const canDelete = (parent: DirectoryNode, childName: string, user: string): boolean => {
    if (user === 'root') return true;
    if (!hasPermission(parent, user, 'write')) return false;
    
    // Check sticky bit
    const perms = parent.permissions;
    const isSticky = perms.endsWith('t') || perms.endsWith('T');
    if (!isSticky) return true;
    
    const child = parent.children[childName];
    if (!child) return true; 
    
    return child.owner === user || parent.owner === user;
}
  
export const resolveFileContent = async (node: FileNode): Promise<string> => {
    if (node.content === '[SECURE CONTENT]' && node.id) {
        return await getFileContent(node.id);
    }
    return node.content || '';
}
