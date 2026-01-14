import { CommandHandler } from "./types"
import { verifyFlag } from "../actions"
import { BEGINNER_TASKS, STANDARD_TASKS, ROOT_TASKS } from "../data/challenges"
import { toast } from "sonner"

export const help: CommandHandler = (args, { addToHistory }) => {
    addToHistory('output', `Available commands:
help          Show this help message
guide         Show current tasks/challenges
status        Check your progress
submit <flag> Submit a flag to verify
clear         Clear terminal screen
ls            List files
cd <dir>      Change directory
cat <file>    Read file content
pwd           Print working directory
whoami        Show current user
mkdir <dir>   Create directory
touch <file>  Create file
rm <file>     Remove file
cp <src> <dst> Copy file
mv <src> <dst> Move file
echo <str>    Display a line of text
grep <str>    Search for string in file
ssh <host>    Connect to remote server
strings <fil> Print printable strings in file
chmod <mode>  Change file mode bits
openssl       OpenSSL command line tool
unzip <file>  List, test and extract compressed files from a ZIP archive
ping <host>   Send ICMP ECHO_REQUEST to network hosts
env           Print environment variables
exit          Logout
`);
}

export const clear: CommandHandler = (args, { clearHistory }) => {
    clearHistory();
}

export const guide: CommandHandler = (args, { currentUser, solvedFlags, addToHistory }) => {
    addToHistory('output', "=== CTF GUIDE ===")
    
    // Determine level based on progress
    const beginnerCompleted = BEGINNER_TASKS.every(t => solvedFlags.includes(t.id))
    const standardCompleted = STANDARD_TASKS.filter(t => solvedFlags.includes(t.id)).length >= 10 // Arbitrary threshold?
    
    let currentTasks = BEGINNER_TASKS
    let levelName = "Beginner (Basic Linux Commands)"
    
    if (beginnerCompleted) {
        currentTasks = STANDARD_TASKS
        levelName = "Standard (Security Challenges)"
    }
    
    if (currentUser === 'root') {
        currentTasks = ROOT_TASKS
        levelName = "Root (Deep System Access)"
    }
    
    addToHistory('output', `Current Level: ${levelName}`)
    addToHistory('output', "Tasks:")
    
    currentTasks.forEach(task => {
        const isSolved = solvedFlags.includes(task.id)
        const status = isSolved ? "[✓]" : "[ ]"
        addToHistory('output', `${status} ${task.title}: ${task.description}`)
        if (!isSolved && task.hint) {
             addToHistory('output', `    Hint: ${task.hint}`)
        }
    })
    
    if (beginnerCompleted && !currentUser.includes('root') && currentTasks === STANDARD_TASKS) {
         addToHistory('output', "\nTip: There are hidden flags everywhere. Check source code, cookies, headers...")
    }
}

export const status: CommandHandler = (args, { solvedFlags, addToHistory }) => {
    addToHistory('output', `Solved Flags: ${solvedFlags.length}`)
    addToHistory('output', `Score: ${solvedFlags.length * 100}`)
    addToHistory('output', `Rank: ${solvedFlags.length > 5 ? 'Script Kiddie' : 'Noob'}`)
}

export const submit: CommandHandler = async (args, { setCommandNotFoundCount, addToHistory, bombState, setBombState, solvedFlags, setSolvedFlags }) => {
    setCommandNotFoundCount(0)
    if (args.length === 0) {
      addToHistory('output', "Usage: submit <flag>")
      addToHistory('output', "Example: submit flag{welcome_to_smartread_ctf_2026}")
    } else {
      const flag = args.join(' ')
      const result = await verifyFlag(flag)
      if (result.success) {
        addToHistory('output', `[SUCCESS] ${result.message}`)
        
        // Handle Bomb Defusal (Logic now partly in submit, but we need to trigger defuse)
        // Since we don't have direct access to `defuseBomb` here (it's in the hook), 
        // we manually update state using the setter provided in context.
        if (bombState.active) {
            setBombState(prev => ({ ...prev, active: false }))
            localStorage.removeItem('ctf_bomb_state')
            addToHistory('output', "[SYSTEM] Threat level reduced. Countermeasures deactivated.")
        }

        if (result.id && !solvedFlags.includes(result.id)) {
          const newSolved = [...solvedFlags, result.id].sort((a,b) => a-b)
          setSolvedFlags(newSolved)
          localStorage.setItem('ctf_solved', JSON.stringify(newSolved))
          toast.success(`Flag ${result.id} Captured!`)
        }
      } else {
        addToHistory('output', `[ERROR] ${result.message}`)
        // Trigger Bomb Logic
        // Same here, we replicate triggerBomb logic or need to expose it in context.
        // For now, replicate logic to keep context simple, or we can add triggerBomb to context.
        // Let's replicate for now to match previous behavior but cleaner.
        
        if (!bombState.active) {
            addToHistory('output', "[WARNING] UNAUTHORIZED ACCESS DETECTED.")
            addToHistory('output', "[WARNING] SELF-DESTRUCT SEQUENCE INITIATED.")
            setBombState({ active: true, timeLeft: 7200, exploded: false }) 
        } else {
            addToHistory('output', "[CRITICAL] INCORRECT CODE. ACCELERATING DETONATION.")
            setBombState(prev => {
                const newTime = Math.max(0, prev.timeLeft - 300)
                if (newTime <= 0) {
                    const newState = { ...prev, timeLeft: 0, exploded: true }
                    localStorage.setItem('ctf_bomb_state', JSON.stringify(newState))
                    return newState
                }
                const updatedState = { ...prev, timeLeft: newTime }
                localStorage.setItem('ctf_bomb_state', JSON.stringify(updatedState))
                return updatedState
            })
        }
      }
    }
}
