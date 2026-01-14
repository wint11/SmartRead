import { useState, useRef, useEffect, useCallback } from 'react'
import { verifyFlag, checkSqlInjection, setCtfCookie } from '../actions'
import { VIRTUAL_FILES, DEEP_FILES } from '../data/filesystem'
import { toast } from 'sonner'

export type HistoryItem = {
  type: 'input' | 'output'
  content: string
}

export const useCtfGame = () => {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', content: "SmartRead CTF System v1.0.0" },
    { type: 'output', content: "Type 'help' for available commands." },
    { type: 'output', content: "Tip: Start by reading the README file using 'cat README'" }
  ])
  const [solvedFlags, setSolvedFlags] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [isDeepLayer, setIsDeepLayer] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [input, setInput] = useState("")
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [sudoFailCount, setSudoFailCount] = useState(0)
  
  // Konami Code Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

  // Load solved flags and initialize Web Flags
  useEffect(() => {
    // Load progress
    const saved = localStorage.getItem('ctf_solved')
    if (saved) {
      setSolvedFlags(JSON.parse(saved))
    }

    // Initialize Web Flags
    // Flag 3: Cookie
    setCtfCookie()
    
    // Flag 5: Console Log
    console.log("%cSTOP!", "color: red; font-size: 30px; font-weight: bold;")
    console.log("%cThis is a browser feature intended for developers.", "font-size: 18px;")
    console.log("%cBut since you are here... flag{console_log_master_3344}", "color: green; font-size: 14px; font-weight: bold;")
    
    // Flag 9: LocalStorage
    localStorage.setItem('debug_config', 'flag{local_storage_is_not_secret_5566}')
    
  }, [])

  const addToHistory = useCallback((type: 'input' | 'output', content: string) => {
    setHistory(prev => [...prev, { type, content }])
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Konami Code Logic
    if (e.key === KONAMI_CODE[konamiIndex]) {
      const nextIndex = konamiIndex + 1
      if (nextIndex === KONAMI_CODE.length) {
        addToHistory('output', "CHEAT CODE ACTIVATED! 30 LIVES GRANTED!")
        addToHistory('output', "flag{konami_code_power_up_3344}")
        setKonamiIndex(0)
      } else {
        setKonamiIndex(nextIndex)
      }
    } else {
      setKonamiIndex(0)
    }

    if (e.key === 'Enter') {
      handleCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const commands = ['help', 'status', 'submit', 'clear', 'ls', 'cat', 'whoami', 'pwd', 'echo', 'ping', 'grep', 'env', 'base64', 'hexdump', 'sudo', 'nslookup', 'curl', 'ssh', 'exit']
      const parts = input.split(' ')
      const lastPart = parts[parts.length - 1]
      
      if (parts.length === 1) {
         const match = commands.find(c => c.startsWith(lastPart))
         if (match) setInput(match)
      } else {
         // File completion
         const fileNames = [...Object.keys(VIRTUAL_FILES), ...Object.keys(DEEP_FILES)]
         const match = fileNames.find(f => f.startsWith(lastPart))
         if (match) {
            parts[parts.length - 1] = match
            setInput(parts.join(' '))
         }
      }
    }
  }

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim()
    if (!trimmedCmd) return

    addToHistory('input', trimmedCmd)
    setCommandHistory(prev => [...prev, trimmedCmd])
    setHistoryIndex(-1)
    setIsProcessing(true)

    // Interactive tools
    if (activeTool) {
      await handleInteractiveTool(trimmedCmd)
      setIsProcessing(false)
      return
    }

    const parts = trimmedCmd.split(/\s+/)
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)

    try {
      await processCommand(command, args)
    } catch (error) {
      addToHistory('output', `Error executing command: ${error}`)
    }

    setIsProcessing(false)
  }

  const handleInteractiveTool = async (input: string) => {
    if (activeTool === 'admin_login') {
      const sqlResult = await checkSqlInjection(input)
      if (sqlResult.success) {
        addToHistory('output', `[ACCESS GRANTED] Welcome Admin.`)
        addToHistory('output', `Dumping database... Found flag: ${sqlResult.flag}`)
      } else {
        addToHistory('output', `[ACCESS DENIED] Invalid credentials.`)
      }
      setActiveTool(null)
    } else if (activeTool === 'overflow_test') {
      if (input.length > 32) {
        addToHistory('output', "Segmentation fault (core dumped)")
        addToHistory('output', "Memory Dump:")
        addToHistory('output', "0x004005a0: 48 65 6c 6c 6f 20 57 6f 72 6c 64 00 00 00 00 00  |Hello World.....|")
        addToHistory('output', "0x004005b0: 66 6c 61 67 7b 62 75 66 66 65 72 5f 6f 76 65 72  |flag{buffer_over|")
        addToHistory('output', "0x004005c0: 66 6c 6f 77 5f 63 72 61 73 68 5f 64 75 6d 70 5f  |flow_crash_dump_|")
        addToHistory('output', "0x004005d0: 39 39 30 30 7d 00 00 00 00 00 00 00 00 00 00 00  |9900}...........|")
        addToHistory('output', "Analysis: Stack smashed. Secret leaked.")
      } else {
        addToHistory('output', "Buffer filled successfully. No crash.")
      }
      setActiveTool(null)
    } else if (activeTool === 'ssh_password') {
      if (input === 'toor_4_smartread') {
        addToHistory('output', "Access Granted.")
        addToHistory('output', "flag{deep_web_layer_root_access_granted_0011}")
        addToHistory('output', "Welcome to SmartRead Internal Root Shell.")
        addToHistory('output', "Type 'help' for root commands.")
        addToHistory('output', "Initializing 3D Secure Environment...")
        setTimeout(() => {
          setIsDeepLayer(true)
          setIsFlipped(true)
        }, 1000)
      } else {
        addToHistory('output', "Access Denied.")
      }
      setActiveTool(null)
    }
  }

  const processCommand = async (command: string, args: string[]) => {
    switch (command) {
      case 'help':
        addToHistory('output', `Available commands:
help          Show this help message
status        Check your progress
submit <flag> Submit a flag to verify
clear         Clear terminal screen
ls            List files
cat <file>    Read file content
whoami        Show current user
pwd           Print working directory
echo <str>    Display a line of text
ping <host>   Send ICMP ECHO_REQUEST
grep <str>    Search for string in file
env           Print environment variables
base64        Decode/Encode base64 strings
hexdump <fil> Dump file in hex
sudo          Execute a command as another user
nslookup      Query internet name servers
curl <url>    Transfer data from or to a server
ssh <host>    Connect to remote server
`)
        break

      case 'status':
        // Total now includes 5 beginner + 12 web + 11 system + 15 deep + 7 misc_extra = 50 flags
        const total = 50
        const progress = Math.round((solvedFlags.length / total) * 100)
        
        // Check for beginner flags (IDs 101-105)
        const beginnerFlags = [101, 102, 103, 104, 105]
        const completedBeginner = beginnerFlags.filter(id => solvedFlags.includes(id))
        const isBeginnerComplete = completedBeginner.length === beginnerFlags.length

        addToHistory('output', `Progress: [${'#'.repeat(Math.floor(progress/5))}${' '.repeat(20 - Math.floor(progress/5))}] ${progress}%
Flags Captured: ${solvedFlags.length}/${total}
Beginner Tasks: ${completedBeginner.length}/${beginnerFlags.length}
Solved IDs: ${solvedFlags.join(', ') || 'None'}
`)
        
        if (isBeginnerComplete && solvedFlags.length < 10) {
             addToHistory('output', `[SYSTEM MESSAGE]
Congratulations, Recruit! 
You have successfully completed all beginner training modules.
You are now ready for the real challenge.

Type 'help' to see all available tools for your mission.
Your next objective: Infiltrate the system deeper. 
Good luck.
`)
        }
        break

      case 'clear':
        setHistory([])
        break

      case 'whoami':
        addToHistory('output', "ctf-user")
        addToHistory('output', "[Beginner] Nice! You found a flag: flag{who_am_i_root_wannabe}")
        break

      case 'pwd':
        addToHistory('output', "/home/ctf")
        addToHistory('output', "[Beginner] You found a flag: flag{location_confirmed_home}")
        break

      case 'echo':
        if (args.length > 0) {
           addToHistory('output', args.join(' '))
           addToHistory('output', "[Beginner] Echo works! Flag: flag{echo_echo_echo_111}")
        } else {
           addToHistory('output', "")
        }
        break

      case 'ping':
        if (args.length > 0) {
           const host = args[0]
           addToHistory('output', `PING ${host} (127.0.0.1): 56 data bytes`)
           addToHistory('output', `64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.045 ms`)
           addToHistory('output', `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.052 ms`)
           addToHistory('output', `64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.048 ms`)
           addToHistory('output', `--- ${host} ping statistics ---`)
           addToHistory('output', `3 packets transmitted, 3 packets received, 0.0% packet loss`)
           addToHistory('output', "[Beginner] Network active. Flag: flag{ping_pong_latency_low}")
        } else {
           addToHistory('output', "Usage: ping <host>")
        }
        break

      case 'ls':
        if (isDeepLayer) {
           let fileList = 'files:\n'
           Object.keys(DEEP_FILES).forEach(f => fileList += `  ${f}\n`)
           addToHistory('output', fileList)
        } else {
           let fileList = `files:
  README
  note.txt
  strange_code.txt
  access.log
  secret.msg
  servers.txt
  admin_login
  overflow_test
`
           if (args.includes('-a')) {
             fileList += "  .env\n"
           }
           addToHistory('output', fileList)
        }
        break


      case 'submit':
        if (args.length === 0) {
          addToHistory('output', "Usage: submit <flag>")
          addToHistory('output', "Example: submit flag{welcome_to_smartread_ctf_2026}")
        } else {
          const flag = args.join(' ')
          const result = await verifyFlag(flag)
          if (result.success) {
            addToHistory('output', `[SUCCESS] ${result.message}`)
            if (result.id && !solvedFlags.includes(result.id)) {
              const newSolved = [...solvedFlags, result.id].sort((a,b) => a-b)
              setSolvedFlags(newSolved)
              localStorage.setItem('ctf_solved', JSON.stringify(newSolved))
              toast.success(`Flag ${result.id} Captured!`)
            }
          } else {
            addToHistory('output', `[ERROR] ${result.message}`)
          }
        }
        break

      case 'ssh':
         if (args.length > 0 && (args[0] === 'root@192.168.1.5' || args[0] === '192.168.1.5')) {
             addToHistory('output', "root@192.168.1.5's password:")
             setActiveTool('ssh_password')
             return
         } else {
             addToHistory('output', `ssh: connect to host ${args[0] || ''}: Connection refused`)
         }
         break

      case 'exit':
         if (isDeepLayer) {
             setIsFlipped(false)
             setTimeout(() => {
                 setIsDeepLayer(false)
                 addToHistory('output', "logout")
                 addToHistory('output', "Connection to 192.168.1.5 closed.")
             }, 600)
         }
         break

      case 'grep':
        if (args.length < 2) {
           addToHistory('output', "Usage: grep <pattern> <file>")
        } else {
           const pattern = args[0]
           const fileName = args[1]
           if (VIRTUAL_FILES[fileName]) {
              const lines = VIRTUAL_FILES[fileName].split('\n')
              const matches = lines.filter(line => line.includes(pattern))
              if (matches.length > 0) {
                 matches.forEach(m => addToHistory('output', m))
              } else {
                 // no output on no match
              }
           } else {
              addToHistory('output', `grep: ${fileName}: No such file or directory`)
           }
        }
        break

      case 'env':
      case 'printenv':
         addToHistory('output', `SHELL=/bin/bash
PWD=/home/ctf
LOGNAME=ctf
HOME=/home/ctf
LANG=en_US.UTF-8
TERM=xterm-256color
CTF_FLAG=flag{env_vars_are_public_secrets_9988}
`)
         break

      case 'base64':
         if (args.includes('-d') && args.length >= 2) {
            const fileName = args[args.indexOf('-d') + 1]
            if (VIRTUAL_FILES[fileName]) {
               try {
                  const decoded = atob(VIRTUAL_FILES[fileName])
                  addToHistory('output', decoded)
               } catch (e) {
                  addToHistory('output', "base64: invalid input")
               }
            } else {
               addToHistory('output', `base64: ${fileName}: No such file or directory`)
            }
         } else if (args.length > 0 && !args[0].startsWith('-')) {
            addToHistory('output', btoa(args[0]))
         } else {
            addToHistory('output', "Usage: base64 -d <file> OR base64 <string>")
         }
         break

      case 'sudo':
         if (args.length === 0) {
            addToHistory('output', "usage: sudo -h | -K | -k | -V")
         } else if (args.includes('-l')) {
            addToHistory('output', `User ctf may run the following commands on smartread:
  (ALL) NOPASSWD: /usr/bin/cat /var/root/flag.txt`)
         } else if (args[0] === 'cat' && args[1] === '/var/root/flag.txt') {
            addToHistory('output', "flag{sudo_make_me_a_sandwich_7777}")
         } else {
            addToHistory('output', `[sudo] password for ctf: `)
            addToHistory('output', `Sorry, try again.`)
            
            // Sudo fail logic
            const newFailCount = sudoFailCount + 1
            setSudoFailCount(newFailCount)
            if (newFailCount >= 3) {
               addToHistory('output', "sudo: 3 incorrect password attempts")
               addToHistory('output', "This incident will be reported.")
               addToHistory('output', "flag{sudo_incident_reported_santa_claus}")
               setSudoFailCount(0)
            }
         }
         break

      // --- New Easter Egg Commands ---
      case 'rm':
         if (args.includes('-rf') && args.includes('/')) {
             addToHistory('output', "rm: it is dangerous to operate recursively on /")
             addToHistory('output', "rm: use --no-preserve-root to override this failsafe")
             addToHistory('output', "Just kidding. Here's a flag for your destructive tendencies:")
             addToHistory('output', "flag{dont_try_this_at_home_rm_rf}")
         } else {
             addToHistory('output', "rm: missing operand")
         }
         break

      case 'vi':
      case 'vim':
         addToHistory('output', "Entering Vi Improved...")
         addToHistory('output', "Type :q! to exit.")
         addToHistory('output', "Wait, you actually know how to exit?")
         addToHistory('output', "flag{vi_exit_is_hard_colon_q_bang}")
         break

      case 'matrix':
         addToHistory('output', "Wake up, Neo...")
         addToHistory('output', "The Matrix has you...")
         addToHistory('output', "Follow the white rabbit.")
         addToHistory('output', "flag{follow_the_white_rabbit_matrix}")
         break

      case 'answer':
      case '42':
         addToHistory('output', "The Answer to the Ultimate Question of Life, the Universe, and Everything is 42.")
         addToHistory('output', "flag{answer_to_life_universe_everything_42}")
         break

      case 'brew':
      case 'coffee':
      case 'tea':
         addToHistory('output', "HTTP 418 I'm a teapot")
         addToHistory('output', "flag{http_418_im_a_teapot}")
         break
      
      case 'reboot':
         addToHistory('output', "Rebooting system...")
         setTimeout(() => {
             addToHistory('output', "System rebooted successfully.")
             addToHistory('output', "flag{have_you_tried_turning_it_off_and_on_again}")
         }, 1000)
         break

      case 'nslookup':
         if (args.length === 0) {
            addToHistory('output', "Usage: nslookup <domain>")
         } else {
            const domain = args[0]
            addToHistory('output', `Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
Name:	${domain}
Address: 192.168.1.5
`)
            if (domain === 'internal.db' || domain === 'db.internal') {
               addToHistory('output', `\n${domain}	text = "flag{dns_records_reveal_topology_4433}"`)
            }
         }
         break

      case 'admin_login':
      case './admin_login':
        addToHistory('output', "SQL Injection Tool v1.0")
        addToHistory('output', "Enter username:")
        setActiveTool('admin_login')
        return

      case './overflow_test':
         addToHistory('output', "Buffer Overflow Test Tool v0.1")
         addToHistory('output', "Enter data buffer:")
         setActiveTool('overflow_test')
         return

      case 'hexdump':
          if (args.length === 0) {
              addToHistory('output', "Usage: hexdump <file>")
          } else {
              const fileName = args[0]
              if (fileName === 'firmware.bin') {
                  addToHistory('output', "0000000 48 65 61 64 65 72 00 00 00 00 00 00 00 00 00 00  |Header..........|")
                  addToHistory('output', "0000010 66 6c 61 67 7b 68 65 78 5f 64 75 6d 70 5f 6d 61  |flag{hex_dump_ma|")
                  addToHistory('output', "0000020 73 74 65 72 5f 62 69 6e 61 72 79 5f 61 6e 61 6c  |ster_binary_anal|")
                  addToHistory('output', "0000030 79 73 74 5f 35 35 31 31 7d 00 00 00 00 00 00 00  |yst_5511}.......|")
              } else if (VIRTUAL_FILES[fileName] || DEEP_FILES[fileName]) {
                  const content = VIRTUAL_FILES[fileName] || DEEP_FILES[fileName]
                  let hex = ''
                  for (let i = 0; i < Math.min(content.length, 48); i++) {
                      hex += content.charCodeAt(i).toString(16).padStart(2, '0') + ' '
                  }
                  addToHistory('output', hex)
              } else {
                  addToHistory('output', `hexdump: ${fileName}: No such file or directory`)
              }
          }
          break

      case 'curl':
           if (args.length === 0) {
             addToHistory('output', "curl: try 'curl --help' or 'curl --manual' for more information")
           } else {
             // Parse arguments manually
             let method = 'GET'
             let url = ''
             let userAgent = ''
             let data = ''
             
             for (let i = 0; i < args.length; i++) {
                if (args[i] === '-X' && args[i+1]) {
                    method = args[i+1]
                    i++
                 } else if (args[i] === '-A' && args[i+1]) {
                    userAgent = args[i+1].replace(/^'|'$/g, '').replace(/^"|"$/g, '')
                    i++
                 } else if (args[i] === '-H' && args[i+1]) {
                     // Check for Authorization header
                     const header = args[i+1].replace(/^'|'$/g, '').replace(/^"|"$/g, '')
                     if (header.includes('Authorization:') && header.includes('Bearer') && !header.includes('guest')) {
                         // Simple check: just needs to be non-guest
                         addToHistory('output', "JWT Token Accepted.")
                         addToHistory('output', "flag{jwt_token_spoofing_master_7744}")
                         return
                     }
                     i++
                 } else if (args[i] === '-d' && args[i+1]) {
                   const rest = args.slice(i+1).join(' ')
                   data = rest.replace(/^'|'$/g, '')
                   i = args.length 
                } else if (args[i].startsWith('http') || args[i].startsWith('/')) {
                   url = args[i]
                }
             }

             if (url === '/api/ctf/upload' && method === 'POST') {
                 if (data.includes('upload') && data.includes('secret')) {
                    try {
                       const res = await fetch('/api/ctf/upload', {
                          method: 'POST',
                          headers: {'Content-Type': 'application/json'},
                          body: data
                       })
                       const json = await res.json()
                       addToHistory('output', JSON.stringify(json, null, 2))
                    } catch (e) {
                       addToHistory('output', `curl: (7) Failed to connect to host`)
                    }
                 } else {
                     addToHistory('output', "Upload failed: Missing required fields.")
                 }
             } else if (url === 'http://internal.portal' && userAgent === 'SmartRead-Agent') {
                 addToHistory('output', "Access Granted. flag{user_agent_spoofing_is_easy_1199}")
             } else {
                 addToHistory('output', `curl: (6) Could not resolve host: ${url}`)
             }
           }
           break

      // --- Deep Layer Commands ---
      case 'ps':
         if (!isDeepLayer) {
            addToHistory('output', "ps: command not found")
         } else {
            addToHistory('output', "PID TTY          TIME CMD")
            addToHistory('output', "  1 ?        00:00:01 systemd")
            addToHistory('output', " 22 ?        00:00:00 sshd")
            addToHistory('output', " 33 pts/0    00:00:00 bash")
            addToHistory('output', "1337 ?       00:10:00 mining_bot --config /etc/miner.conf # flag{hidden_process_mining_monero}")
         }
         break
      
      case 'netstat':
         if (!isDeepLayer) {
            addToHistory('output', "netstat: command not found")
         } else {
            addToHistory('output', "Active Internet connections (servers and established)")
            addToHistory('output', "Proto Recv-Q Send-Q Local Address           Foreign Address         State")
            addToHistory('output', "tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN")
            addToHistory('output', "tcp        0      0 127.0.0.1:1337          0.0.0.0:*               LISTEN  # flag{netstat_port_1337_backdoor}")
         }
         break


      case 'chmod':
         if (!isDeepLayer) {
            addToHistory('output', "chmod: command not found")
         } else if (args.length < 2) {
            addToHistory('output', "Usage: chmod <mode> <file>")
         } else {
             if (args[0] === '+x' || args[0] === '777') {
                 if (args[1] === 'backdoor.sh') {
                     addToHistory('output', "backdoor.sh is now executable.")
                     // Automatically run it for user convenience or make them run it
                     addToHistory('output', "To run: ./backdoor.sh")
                 } else {
                     addToHistory('output', `changed mode of ${args[1]}`)
                 }
             }
         }
         break
      
      case './backdoor.sh':
          if (isDeepLayer) {
               addToHistory('output', "Executing backdoor...")
               addToHistory('output', "flag{chmod_777_script_execution}")
          } else {
              addToHistory('output', "backdoor.sh: command not found")
          }
          break

      case 'decrypt':
          if (!isDeepLayer) {
             addToHistory('output', "decrypt: command not found")
          } else if (args.length === 0) {
              addToHistory('output', "Usage: decrypt <file> <key>")
          } else {
              if (args[0] === 'ssl.key') {
                  addToHistory('output', "Decrypting ssl.key...")
                  addToHistory('output', "Success! Key content: flag{decrypt_ssl_private_key}")
              } else if (args[0] === 'cipher.bin' && args[1] === '0x55') {
                   addToHistory('output', "Decrypting cipher.bin with key 0x55...")
                   addToHistory('output', "Success! Content: flag{reverse_engineering_xor_cipher}")
              } else {
                  addToHistory('output', "Decryption failed: Invalid file or key.")
              }
          }
          break

      case 'insmod':
         if (!isDeepLayer) {
            addToHistory('output', "insmod: command not found")
         } else {
             addToHistory('output', "insmod: ERROR: could not insert module: Operation not permitted")
             addToHistory('output', "Hint: Check loaded modules with lsmod")
         }
         break
         
      case 'lsmod':
         if (!isDeepLayer) {
             addToHistory('output', "lsmod: command not found")
         } else {
             addToHistory('output', "Module                  Size  Used by")
             addToHistory('output', "iptables                16384  0")
             addToHistory('output', "rootkit_v2              8192   1  # flag{kernel_module_rootkit_detected}")
         }
         break
         
      case 'john': // Shadow cracker
         if (!isDeepLayer) {
             addToHistory('output', "john: command not found")
         } else if (args[0] === 'shadow') {
             addToHistory('output', "Loaded 2 password hashes with 2 different salts (sha512crypt)")
             addToHistory('output', "proceeding with wordlist: /usr/share/wordlists/rockyou.txt")
             addToHistory('output', "password123      (root)")
             addToHistory('output', "flag{shadow_file_cracked_root_password}  (ctf)")
         } else {
             addToHistory('output', "Usage: john shadow")
         }
         break

      case 'cat':
         if (args.length === 0) {
            addToHistory('output', "Usage: cat <filename>")
         } else {
            const fileName = args[0]
            if (isDeepLayer) {
                // Deep Layer specific files
                if (fileName === '/etc/crontab') {
                    addToHistory('output', "SHELL=/bin/bash\nPATH=/sbin:/bin:/usr/sbin:/usr/bin\n* * * * * root /var/backups/backup.sh # flag{cron_job_persistence_script}")
                    return
                } else if (fileName === '/root/.ssh/authorized_keys') {
                     addToHistory('output', "ssh-rsa AAAAB3NzaC1yc2E... malicious_key@hacker_pc # flag{ssh_authorized_keys_backdoor}")
                     return
                }
            }

            // Normal layer files and shared logic
            if (fileName === 'README') {
              // ... (existing README content)
              addToHistory('output', VIRTUAL_FILES['README'])
            } else if (fileName === 'guide.txt') {
               addToHistory('output', "Guide: ... [content] ...")
               addToHistory('output', "You found a flag: flag{file_reader_303}")
            } else if (fileName === '.env') {
               addToHistory('output', VIRTUAL_FILES['.env'])
            } else if (fileName === 'robots.txt') {
               addToHistory('output', "User-agent: *\nDisallow: /admin\nDisallow: /private\n# flag{robots_keep_secrets_safe_4455}")
            } else if (fileName === 'strange_code.txt') {
               addToHistory('output', VIRTUAL_FILES['strange_code.txt'])
            } else if (fileName === 'legacy_script.js') {
               addToHistory('output', "// TODO: Remove this old code\nfunction validate() { \n  // ... obfuscated ... \n  return 'flag{reverse_engineering_obfuscated_js_9922}';\n}")
            } else if (fileName.includes('passwd') && (fileName.includes('../') || fileName.startsWith('/etc/'))) {
                addToHistory('output', `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
ctf:x:1000:1000:ctf:/home/ctf:/bin/bash
flag_user:x:1001:1001:flag{path_traversal_expert_0011}:/home/flag_user:/bin/false`)
            } else if (isDeepLayer && DEEP_FILES[fileName]) {
                 // Simple cat for deep files not handled specially
                 addToHistory('output', DEEP_FILES[fileName])
            } else if (VIRTUAL_FILES[fileName]) {
                 addToHistory('output', VIRTUAL_FILES[fileName])
            } else {
                 addToHistory('output', `cat: ${fileName}: No such file or directory`)
            }
         }
         break
         
      case 'tcpdump':
         if(!isDeepLayer) {
             addToHistory('output', "tcpdump: command not found")
         } else if (args.includes('-r') && args.includes('capture.pcap')) {
             addToHistory('output', "reading from file capture.pcap, link-type EN10MB (Ethernet)")
             addToHistory('output', "10:00:01.453 IP 192.168.1.10.5432 > 192.168.1.5.80: Flags [P.], seq 1:15, ack 1, win 512, length 14: USER=admin&PASS=flag{tcpdump_packet_capture_creds}")
         } else {
             addToHistory('output', "Usage: tcpdump -r <file>")
         }
         break

      case 'stegsolve':
          if(!isDeepLayer) {
              addToHistory('output', "stegsolve: command not found")
          } else if (args[0] === 'suspicious.jpg') {
              addToHistory('output', "Analyzing image...")
              addToHistory('output', "LSB extraction detected text: flag{steganography_image_hidden_text}")
          } else {
              addToHistory('output', "Usage: stegsolve <image_file>")
          }
          break

      case 'docker':
          if(!isDeepLayer) {
              addToHistory('output', "docker: command not found")
          } else if (args[0] === 'images' || args[0] === 'ps') {
              addToHistory('output', "CONTAINER ID   IMAGE          COMMAND")
              addToHistory('output', "a1b2c3d4e5f6   vulnerable-app  /bin/sh -c '...'")
              addToHistory('output', "# Container breakout exploit available. flag{docker_container_escape_host}")
          } else {
              addToHistory('output', "Usage: docker [ps|images]")
          }
          break
          
      case './vuln_server':
          if(!isDeepLayer) {
              addToHistory('output', "vuln_server: command not found")
          } else {
              addToHistory('output', "Starting server...")
              addToHistory('output', "[ALARM] Buffer Overflow Detected! Return address overwritten.")
              addToHistory('output', "Jumping to shellcode... flag{buffer_overflow_return_to_libc}")
          }
          break
          
       case 'strings':
          if (!isDeepLayer) {
             addToHistory('output', "strings: command not found")
          } else if (args.length === 0) {
             addToHistory('output', "Usage: strings <file>")
          } else {
             const fileName = args[0]
             if (fileName === 'memory.dmp') {
                 addToHistory('output', "...A lot of garbage data...")
                 addToHistory('output', "USER_PASSWORD=flag{memory_dump_password_plain}")
                 addToHistory('output', "...More garbage data...")
             } else if (DEEP_FILES[fileName] && fileName === 'token_gen') {
                 addToHistory('output', "GLIBC_2.2.5")
                 addToHistory('output', "flag{binary_strings_hardcoded_key}")
                 addToHistory('output', "Usage: %s <key>")
             } else if (DEEP_FILES[fileName]) {
                  // Simulate strings output
                  addToHistory('output', DEEP_FILES[fileName].replace(/[^\x20-\x7E]/g, ''))
             } else {
                 addToHistory('output', `strings: ${fileName}: No such file`)
             }
          }
          break

      default:
        addToHistory('output', `${command}: command not found`)
    }
  }

  return {
    history,
    input,
    setInput,
    handleKeyDown,
    handleCommand,
    isProcessing,
    activeTool,
    isDeepLayer,
    isFlipped,
    solvedFlags
  }
}
