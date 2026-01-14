import { CommandHandler, normalizePath, findNode } from "./types"
import { getFileContent } from "../actions"

export const ping: CommandHandler = (args, { addToHistory }) => {
    if (args.length === 0) {
        addToHistory('output', "usage: ping <host>");
    } else {
        addToHistory('output', `PING ${args[0]} (${args[0]}) 56(84) bytes of data.`);
        addToHistory('output', `64 bytes from ${args[0]}: icmp_seq=1 ttl=64 time=0.045 ms`);
        addToHistory('output', `64 bytes from ${args[0]}: icmp_seq=2 ttl=64 time=0.038 ms`);
        addToHistory('output', `64 bytes from ${args[0]}: icmp_seq=3 ttl=64 time=0.042 ms`);
        addToHistory('output', `--- ${args[0]} ping statistics ---`);
        addToHistory('output', `3 packets transmitted, 3 received, 0% packet loss, time 2045ms`);
        addToHistory('output', "[Beginner] Network active! Flag: flag{ping_pong_latency_low}");
    }
}

export const whoami: CommandHandler = (args, { currentUser, addToHistory }) => {
    addToHistory('output', currentUser);
    addToHistory('output', "[Beginner] Identity verified. Flag: flag{who_am_i_root_wannabe}");
}

export const env: CommandHandler = (args, { currentPath, currentUser, addToHistory }) => {
    addToHistory('output', `SHELL=/bin/bash
PWD=${currentPath}
LOGNAME=${currentUser}
HOME=${currentUser === 'root' ? '/root' : '/home/ctf'}
LANG=en_US.UTF-8
TERM=xterm-256color
FLAG=flag{env_vars_are_public_secrets_9988}
`)
}

export const ssh: CommandHandler = (args, { fileSystem, currentPath, addToHistory, setIsDeepLayer, setIsFlipped, setCurrentUser, setCurrentPath }) => {
    const host = args.find(a => a.includes('@') || a.match(/^\d+\.\d+\.\d+\.\d+$/))
    const keyFile = args.indexOf('-i') !== -1 ? args[args.indexOf('-i') + 1] : null
    
    if (host === 'root@192.168.1.5' || host === '192.168.1.5') {
        // Check if key file exists and is valid
        let hasKey = false;
        if (keyFile) {
            const keyNode = findNode(fileSystem, normalizePath(keyFile, currentPath));
            // Check if it's the decrypted key
            if (keyNode && keyNode.type === 'file' && keyNode.content.includes('BEGIN RSA PRIVATE KEY')) {
                hasKey = true;
            }
        }

        if (hasKey) {
            addToHistory('output', "Authenticated with public key.")
            addToHistory('output', "Welcome to SmartRead Internal Root Shell.")
            addToHistory('output', "Initializing 3D Secure Environment...")
            setTimeout(() => {
               setIsDeepLayer(true)
               setIsFlipped(true)
               setCurrentUser('root')
               setCurrentPath('/root')
            }, 1000)
        } else {
            if (keyFile) {
               addToHistory('output', `Load key "${keyFile}": invalid format`)
               addToHistory('output', `root@192.168.1.5: Permission denied (publickey).`)
            } else {
               addToHistory('output', `root@192.168.1.5: Permission denied (publickey).`)
               addToHistory('output', `Hint: Password authentication is disabled. Please use a private key (-i).`)
            }
        }
    } else {
        addToHistory('output', `ssh: connect to host ${host || ''}: Connection refused`)
    }
}

export const exit: CommandHandler = (args, { currentUser, setIsFlipped, setIsDeepLayer, setCurrentUser, setCurrentPath, addToHistory }) => {
    if (currentUser === 'root') {
        setIsFlipped(false)
        setTimeout(() => {
            setIsDeepLayer(false)
            setCurrentUser('ctf')
            setCurrentPath('/home/ctf')
            addToHistory('output', "logout")
            addToHistory('output', "Connection to 192.168.1.5 closed.")
        }, 600)
    } else {
        addToHistory('output', "logout")
    }
}

export const sudo: CommandHandler = async (args, { currentUser, sudoFailCount, setSudoFailCount, addToHistory }) => {
    if (args.length === 0) {
       addToHistory('output', "usage: sudo -h | -K | -k | -V")
    } else if (args.includes('-l')) {
       addToHistory('output', `User ctf may run the following commands on smartread:
 (ALL) NOPASSWD: /usr/bin/cat /var/root/flag.txt`)
    } else if (args[0] === 'cat' && args[1] === '/var/root/flag.txt') {
        // Special case bypass
       const flag = await getFileContent('sudo_flag');
       addToHistory('output', flag)
    } else {
       addToHistory('output', `[sudo] password for ${currentUser}: `)
       addToHistory('output', `Sorry, try again.`)
       
       const newFailCount = sudoFailCount + 1
       setSudoFailCount(newFailCount)
       if (newFailCount >= 3) {
          addToHistory('output', "sudo: 3 incorrect password attempts")
          addToHistory('output', "This incident will be reported.")
          const flag = await getFileContent('sudo_incident');
          addToHistory('output', flag)
          setSudoFailCount(0)
       }
    }
}

export const reboot: CommandHandler = (args, { addToHistory }) => {
    addToHistory('output', "Rebooting system...");
    addToHistory('output', "Broadcast message from root@smartread:");
    addToHistory('output', "The system is going down for reboot NOW!");
    addToHistory('output', "flag{have_you_tried_turning_it_off_and_on_again}");
}

export const nslookup: CommandHandler = (args, { addToHistory }) => {
    if (args.length === 0) {
        addToHistory('output', "usage: nslookup <host>")
    } else {
        const host = args[0]
        addToHistory('output', `Server:         10.0.0.5`)
        addToHistory('output', `Address:        10.0.0.5#53`)
        addToHistory('output', "")
        
        if (host === 'internal.db' || host === 'db.internal') {
             addToHistory('output', `Name:   internal.db`)
             addToHistory('output', `Address: 192.168.1.10`)
             addToHistory('output', `TXT:    "flag{dns_records_reveal_topology_4433}"`)
        } else {
             addToHistory('output', `** server can't find ${host}: NXDOMAIN`)
        }
    }
}

export const ps: CommandHandler = (args, { addToHistory, isDeepLayer }) => {
    addToHistory('output', "  PID TTY          TIME CMD")
    addToHistory('output', "    1 ?        00:00:01 systemd")
    addToHistory('output', "  445 pts/0    00:00:00 bash")
    addToHistory('output', "  446 pts/0    00:00:00 ps")
    
    if (isDeepLayer) {
        addToHistory('output', " 1337 ?        00:10:00 ./xmrig -o stratum+tcp://monero.pool:3333")
        addToHistory('output', " [HIDDEN] flag{hidden_process_mining_monero}")
    }
}

export const lsmod: CommandHandler = (args, { addToHistory }) => {
    addToHistory('output', "Module                  Size  Used by")
    addToHistory('output', "nf_conntrack           131072  1 ipt_MASQUERADE")
    addToHistory('output', "br_netfilter           24576  0")
    addToHistory('output', "overlay               114688  0")
    addToHistory('output', "rootkit_mod            16384  0 [permanent] flag{kernel_module_rootkit_detected}")
}

export const docker: CommandHandler = (args, { addToHistory }) => {
    if (args.includes('ps') || args.includes('images')) {
        addToHistory('output', "CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS     NAMES")
        addToHistory('output', "a1b2c3d4e5f6   vulnerable:v1  \"/bin/sh -c 'start.sh'\"   2 hours ago      Up 2 hours      80/tcp    webapp")
        addToHistory('output', "")
        addToHistory('output', "Error: Container escape vulnerability detected in 'vulnerable:v1'.")
        addToHistory('output', "Exploit: flag{docker_container_escape_host}")
    } else {
        addToHistory('output', "docker: 'docker' is not a docker command.")
    }
}
