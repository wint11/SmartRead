'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { verifyFlag, getFileContent } from "../actions"
import { toast } from "sonner"
import { INITIAL_FILE_SYSTEM, FileSystemNode, DirectoryNode, FileNode } from "../data/filesystem"
import { BEGINNER_TASKS, STANDARD_TASKS, ROOT_TASKS, Challenge } from "../data/challenges"
import { executeCommand } from "../commands"
import { CommandContext, normalizePath, findNode, hasPermission } from "../commands/types"
import { useBombMechanic, BombState } from "../gameplay/bomb"
import { useBootMechanic } from "../gameplay/boot"

export type TerminalLine = {
  type: 'input' | 'output'
  content: string
}

export { type BombState }

export function useCtfGame() {
  const [history, setHistory] = useState<TerminalLine[]>([])
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  
  // Game State
  const [isDeepLayer, setIsDeepLayer] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [solvedFlags, setSolvedFlags] = useState<number[]>([])
  const [commandNotFoundCount, setCommandNotFoundCount] = useState(0)
  
  // Gameplay Mechanics
  const { bombState, setBombState, resetBomb } = useBombMechanic()
  
  // FileSystem State
  const [fileSystem, setFileSystem] = useState<DirectoryNode>(INITIAL_FILE_SYSTEM)
  const [currentPath, setCurrentPath] = useState('/home/ctf')
  const [currentUser, setCurrentUser] = useState('ctf')
  const [sudoFailCount, setSudoFailCount] = useState(0)

  // Load saved state
  const [isInitialized, setIsInitialized] = useState(false)
  useEffect(() => {
    if (isInitialized) return
    
    const saved = localStorage.getItem('ctf_solved')
    if (saved) setSolvedFlags(JSON.parse(saved))
    
    setIsInitialized(true)
  }, [])

  // Bomb Timer Logic moved to useBombMechanic

  // Level Progression Guidance
  useEffect(() => {
      if (!isInitialized) return;

      const beginnerDone = BEGINNER_TASKS.every(t => solvedFlags.includes(t.id));
      if (currentUser === 'root' && !history.some(h => h.content.includes('ROOT ACCESS GRANTED'))) {
          addToHistory('output', '----------------------------------------');
          addToHistory('output', '*** ROOT ACCESS GRANTED ***');
          addToHistory('output', 'You have elevated privileges. Deep system layers exposed.');
          addToHistory('output', 'New elite missions unlocked. Type "guide" to view.');
          addToHistory('output', 'Flag: flag{deep_web_layer_root_access_granted_0011}');
          addToHistory('output', '----------------------------------------');
      }
      
      // Check for Beginner Completion
      const isBeginnerComplete = BEGINNER_TASKS.every(task => solvedFlags.includes(task.id));
      const hasShownCompletion = history.some(h => h.content.includes('BEGINNER TRAINING COMPLETED'));
      
      if (isBeginnerComplete && !hasShownCompletion && currentUser !== 'root') {
          addToHistory('output', '----------------------------------------');
          addToHistory('output', '*** BEGINNER TRAINING COMPLETED ***');
          addToHistory('output', 'You have mastered the basics. Standard security protocols are now active.');
          addToHistory('output', 'New challenges unlocked. Type "guide" to continue.');
          addToHistory('output', '----------------------------------------');
      }

  }, [currentUser, solvedFlags, history])

  const addToHistory = (type: 'input' | 'output', content: string) => {
    setHistory(prev => [...prev, { type, content }])
  }

  // Boot Mechanic
  const handleBootComplete = useCallback(() => {
      setHistory([
          { type: 'output', content: '-------------------------------------------------------'},
          { type: 'output', content: 'Welcome, Agent. Your mission is to audit this system.'},
          { type: 'output', content: 'Start by exploring the file system.'},
          { type: 'output', content: 'Type "help" for available commands or "guide" for tasks.'},
          { type: 'output', content: '-------------------------------------------------------'}
      ])
  }, [])

  const { isBooting } = useBootMechanic(addToHistory, handleBootComplete)

  const clearHistory = () => {
    setHistory([]);
  }

  const resetGame = () => {
      setHistory([])
      setCommandNotFoundCount(0)
      resetBomb()
      addToHistory('output', "System recovered. Safe mode active.")
  }

  const processCommand = async (command: string, args: string[]) => {
    // Note: commandNotFoundCount is handled in executeCommand (reset on success, increment on fail)

    // Handle file execution (./script.sh)
    if (command.startsWith('./') || command.startsWith('/')) {
        const node = findNode(fileSystem, normalizePath(command, currentPath));
        if (node && node.type === 'file') {
            if (hasPermission(node, currentUser, 'execute')) {
                if (node.content.includes('nc -e /bin/sh')) {
                    addToHistory('output', "Connection received from 192.168.1.5:4444");
                    addToHistory('output', "flag{reverse_shell_connected_success}");
                } else {
                    // Generic script execution simulation
                    const lines = node.content.split('\n');
                    const outputLines = lines.filter(l => !l.startsWith('#') && !l.startsWith('import'));
                    outputLines.forEach(l => addToHistory('output', l));
                }
                return;
            } else {
                addToHistory('output', `bash: ${command}: Permission denied`);
                return;
            }
        }
    }

    const context: CommandContext = {
        fileSystem,
        setFileSystem,
        currentPath,
        setCurrentPath,
        currentUser,
        setCurrentUser,
        addToHistory,
        solvedFlags,
        setSolvedFlags,
        bombState,
        setBombState,
        sudoFailCount,
        setSudoFailCount,
        setIsDeepLayer,
        setIsFlipped,
        setCommandNotFoundCount,
        activeTool,
        setActiveTool,
        resetGame,
        clearHistory
    };

    await executeCommand(command, args, context);
  }

  // Konami Code State
  const [konamiIndex, setKonamiIndex] = useState(0)
  // Support both standard and legacy key names, plus lowercase for letters
  const KONAMI_SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Konami Code Logic
    const key = e.key.toLowerCase()
    
    // Ignore modifier keys to prevent accidental resets
    if (['shift', 'control', 'alt', 'meta'].includes(key)) return

    if (key === KONAMI_SEQUENCE[konamiIndex]) {
        const nextIndex = konamiIndex + 1
        setKonamiIndex(nextIndex)
        if (nextIndex === KONAMI_SEQUENCE.length) {
            addToHistory('output', "CHEAT CODE ACTIVATED")
            addToHistory('output', "flag{konami_code_power_up_3344}")
            setKonamiIndex(0)
        }
    } else {
        // Only reset if it's not the start of a new sequence
        if (key === KONAMI_SEQUENCE[0]) {
            setKonamiIndex(1)
        } else {
            setKonamiIndex(0)
        }
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault()
        const inputHistory = history.filter(h => h.type === 'input')
        if (inputHistory.length === 0) return

        const newIndex = historyIndex === -1 ? inputHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(inputHistory[newIndex].content)
        return
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        const inputHistory = history.filter(h => h.type === 'input')
        if (inputHistory.length === 0 || historyIndex === -1) return

        if (historyIndex === inputHistory.length - 1) {
            setHistoryIndex(-1)
            setInput('')
        } else {
            const newIndex = Math.min(inputHistory.length - 1, historyIndex + 1)
            setHistoryIndex(newIndex)
            setInput(inputHistory[newIndex].content)
        }
        return
    }

    if (e.key === 'Tab') {
        e.preventDefault();
        
        if (!input) return;
        
        const parts = input.trim().split(' ');
        const lastPart = parts[parts.length - 1];
        
        if (parts.length === 1) {
            // Autocomplete command
            const commands = ['help', 'status', 'submit', 'clear', 'ls', 'cd', 'cat', 'pwd', 'whoami', 'mkdir', 'touch', 'rm', 'cp', 'mv', 'echo', 'grep', 'ssh', 'strings', 'chmod', 'openssl', 'unzip', 'exit', 'vi', 'vim', 'nano', 'sudo', 'guide'];
            const matches = commands.filter(c => c.startsWith(lastPart));
            if (matches.length === 1) {
                setInput(matches[0] + ' ');
            }
        } else {
            // Autocomplete path
            let parentPath = currentPath;
            let partialName = lastPart;
            
            if (lastPart.includes('/')) {
                const lastSlash = lastPart.lastIndexOf('/');
                const dirPart = lastPart.substring(0, lastSlash);
                partialName = lastPart.substring(lastSlash + 1);
                parentPath = normalizePath(dirPart, currentPath);
            }
            
            const parentNode = findNode(fileSystem, parentPath);
            if (parentNode && parentNode.type === 'directory') {
                const candidates = Object.keys(parentNode.children).filter(name => name.startsWith(partialName));
                
                if (candidates.length === 1) {
                    const completion = candidates[0];
                    const newPath = lastPart.includes('/') 
                        ? lastPart.substring(0, lastPart.lastIndexOf('/') + 1) + completion 
                        : completion;
                    
                    // Add trailing slash if directory
                    const candidateNode = parentNode.children[completion];
                    const suffix = candidateNode.type === 'directory' ? '/' : ' ';
                    
                    const newInput = parts.slice(0, -1).join(' ') + ' ' + newPath + suffix;
                    setInput(newInput);
                }
            }
        }
        return;
    }

    if (e.key === 'Enter') {
      if (!input.trim()) return
      
      const cmdLine = input.trim()
      addToHistory('input', cmdLine)
      setInput('')
      setHistoryIndex(-1) // Reset history index on new command
      setIsProcessing(true)

      if (activeTool) {
          // Handle tool input (admin_login, ssh_password, etc.)
          if (activeTool === 'admin_login') {
              if (cmdLine === "' OR '1'='1") {
                  addToHistory('output', "Login Successful! Welcome admin.")
                  addToHistory('output', "flag{sql_injection_classic_bypass_3311}")
              } else {
                  addToHistory('output', "Login Failed.")
              }
              setActiveTool(null)
          } else if (activeTool === 'overflow_test') {
              if (cmdLine.length > 32) {
                  addToHistory('output', "Segmentation fault (core dumped)")
                  addToHistory('output', "flag{buffer_overflow_crash_dump_9900}")
              } else {
                  addToHistory('output', "Program exited normally.")
              }
              setActiveTool(null)
          }
      } else {
          const [cmd, ...args] = cmdLine.split(' ')
          await processCommand(cmd, args)
      }
      
      setIsProcessing(false)
    } else if (e.key === 'c' && e.ctrlKey) {
        addToHistory('input', '^C')
        setInput('')
        if (activeTool) setActiveTool(null)
    }
  }

  return {
    history,
    input,
    setInput,
    handleKeyDown,
    isProcessing: isProcessing || isBooting,
    activeTool,
    isDeepLayer,
    isFlipped,
    solvedFlags,
    commandNotFoundCount,
    bombState,
    resetGame,
    isInitialized,
    currentPath,
    currentUser
  }
}
