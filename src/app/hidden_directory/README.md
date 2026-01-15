# Forbidden OS (Hidden Directory)

Welcome to the **Forbidden OS**, a retro Windows 95-style operating system hidden within the SmartRead platform. This directory serves as a playground for users to discover hidden lore, "deleted" manuscripts, and mini-games.

## Architecture

The OS is built as a single-page application (SPA) within Next.js, using a custom window manager and file system.

### Key Components

- **`page.tsx`**: Entry point. Renders the `OSDesktop` component.
- **`components/os-desktop.tsx`**: The main kernel/desktop environment. Manages window state, z-indexing, and the taskbar.
- **`components/file-system.ts`**: Defines the virtual file system structure (JSON-based).
- **`apps/`**: Contains all the "executable" applications.

## How to Add a New App

The system is designed to be extensible. To add a new app (e.g., a new game or tool):

1. **Create the App Component**:
   Create a new folder in `apps/` (e.g., `apps/snake/`) and add an `index.tsx`.
   The component should accept `AppProps`:
   ```typescript
   import { AppProps } from "../types"
   
   export function SnakeApp({ windowId, onClose }: AppProps) {
     return <div>My Game</div>
   }
   ```

2. **Register the App**:
   Open `apps/registry.tsx` and add your app to the `APP_REGISTRY`:
   ```typescript
   'snake': {
     id: 'snake',
     name: 'Snake Game',
     icon: 'gamepad',
     component: SnakeApp,
     defaultWidth: 400,
     defaultHeight: 400
   }
   ```

3. **Add to File System (Optional)**:
   If you want the app to appear as an executable file or shortcut on the desktop or in a folder, edit `components/file-system.ts`:
   ```typescript
   {
     id: 'snake_exe',
     name: 'Snake.exe',
     type: 'app',
     appId: 'snake',
     icon: 'gamepad'
   }
   ```

## Current Apps

- **File Explorer**: Navigates the virtual file system.
- **Notepad**: Views text files.
- **DOOM (Demo)**: A clicker mini-game.
- **Minesweeper**: A fully functional Minesweeper clone.

## Lore & Secrets

The OS is themed around a "forbidden" server where the platform administrators hide deleted content.
- **Flag**: `flag{retro_os_master_8822}`
- **Legacy Flag**: `flag{robots_keep_secrets_safe_4455}`
