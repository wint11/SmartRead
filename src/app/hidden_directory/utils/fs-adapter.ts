import { DirectoryNode, FileNode } from "@/app/ctf/data/filesystem";
import { FileSystemNode } from "../components/file-system";

/**
 * Converts the CTF Linux-style File System (Recursion Object) 
 * into the Desktop-style File System (Recursive Array with UI metadata)
 */
export function adapterCtfToDesktop(
  ctfNode: DirectoryNode, 
  rootName = "My Computer",
  currentPath = "/"
): FileSystemNode[] {
  
  const convertNode = (name: string, node: DirectoryNode | FileNode, path: string): FileSystemNode => {
    const id = path === "/" ? "root" : path.replace(/\//g, "_");
    
    if (node.type === 'directory') {
      const children: FileSystemNode[] = Object.entries(node.children).map(([childName, childNode]) => {
        const childPath = path === "/" ? `/${childName}` : `${path}/${childName}`;
        return convertNode(childName, childNode, childPath);
      });

      // Special Icons
      let icon = 'folder';
      if (name === 'bin') icon = 'folder'; // Could be different
      
      return {
        id,
        name,
        type: 'folder',
        children,
        icon
      };
    } else {
      // File Mapping
      let type: 'text' | 'image' | 'app' = 'text';
      let appId = undefined;
      let icon = 'file-text';

      if (name.endsWith('.jpg') || name.endsWith('.png')) {
        type = 'image';
        icon = 'image';
      } else if (name.endsWith('.exe') || (path.startsWith('/bin/') && node.permissions.includes('x'))) {
        type = 'app';
        icon = 'hard-drive';
        // Map common binaries to apps
        if (name === 'grep' || name === 'ls') {
            appId = 'terminal';
            icon = 'terminal';
        }
      }

      return {
        id,
        name,
        type,
        content: node.content,
        icon,
        appId
      };
    }
  };

  // Convert root children
  const desktopRoot = Object.entries(ctfNode.children).map(([name, node]) => 
    convertNode(name, node, `/${name}`)
  );

  return desktopRoot;
}

/**
 * Merges the dynamic CTF FS with the static Desktop Shortcuts
 */
export function mergeFileSystems(ctfFS: DirectoryNode, staticDesktop: FileSystemNode[]): FileSystemNode[] {
    // We want the Desktop UI to show the "Desktop" folder contents on the actual desktop wallpaper
    // But the "My Computer" icon should open the root of the CTF FS.
    
    // 1. Convert CTF Root
    const ctfRoot = adapterCtfToDesktop(ctfFS);
    
    // 2. Find /home/ctf/Desktop in CTF FS if it exists (it might not in initial state)
    // For now, we will just use the static desktop definition from OSDesktop, 
    // BUT we will inject "My Computer" which contains the CTF Root.
    
    const myComputer = staticDesktop.find(n => n.id === 'my_computer');
    if (myComputer) {
        // HACK: We replace the type of 'my_computer' to 'folder' temporarily so it can have children?
        // Or we handle 'my_computer' opening specially in OSDesktop to show ctfRoot.
        // Let's modify the static desktop to contain the live data if needed.
        
        // Actually, the FileExplorer logic handles "My Computer" by showing the root.
        // So we just need to provide the ctfRoot when FileExplorer requests root.
    }

    return ctfRoot;
}
