import { CommandHandler } from "./types"

export const curl: CommandHandler = (args, { addToHistory }) => {
    if (args.length === 0) {
        addToHistory('output', "curl: try 'curl --help' for more information")
        return
    }

    // Flag 18: POST Request
    // curl -X POST -d "upload=secret" /api/ctf/upload
    if (args.includes('-X') && args.includes('POST') && args.includes('/api/ctf/upload')) {
        addToHistory('output', "HTTP/1.1 200 OK")
        addToHistory('output', "Content-Type: application/json")
        addToHistory('output', "")
        addToHistory('output', '{"success": true, "flag": "flag{post_requests_are_fun_7788}"}')
        return
    }

    // Flag 19: User Agent
    // curl -A "SmartRead-Agent" http://internal.portal
    if (args.includes('-A') && args.includes('"SmartRead-Agent"')) { // Note: args splitting might keep quotes? command parser splits by space.
        // The simple split in use-ctf-game.ts might not handle quotes correctly. 
        // Let's check for the keyword SmartRead-Agent loosely.
    }
    // Re-evaluating argument parsing: use-ctf-game.ts does `cmdLine.split(' ')`. 
    // So `curl -A "SmartRead-Agent"` becomes `['curl', '-A', '"SmartRead-Agent"']`.
    
    if (args.includes('-A') && args.some(a => a.includes('SmartRead-Agent'))) {
        addToHistory('output', "HTTP/1.1 200 OK")
        addToHistory('output', "Server: Internal-Portal/1.0")
        addToHistory('output', "")
        addToHistory('output', "Welcome, authorized agent.")
        addToHistory('output', "flag{user_agent_spoofing_is_easy_1199}")
        return
    }

    // Flag 20: JWT Token
    // curl -H "Authorization: Bearer admin" /api/secure
    // Robust parsing: join args to handle quote splitting issues
    const argsStr = args.join(' ')
    const hasAuthHeader = args.includes('-H') && 
                         argsStr.includes('Authorization') && 
                         argsStr.includes('admin')
    
    if (hasAuthHeader && argsStr.includes('/api/secure')) {
        addToHistory('output', "HTTP/1.1 200 OK")
        addToHistory('output', "Content-Type: application/json")
        addToHistory('output', "")
        addToHistory('output', '{"data": "sensitive", "flag": "flag{jwt_token_spoofing_master_7744}"}')
        return
    }

    // Default response
    const url = args.find(a => a.startsWith('http') || a.startsWith('/'))
    if (url) {
        addToHistory('output', `curl: (6) Could not resolve host: ${url}`)
    } else {
        addToHistory('output', "curl: no URL specified!")
    }
}

export const netstat: CommandHandler = (args, { addToHistory, isDeepLayer }) => {
    addToHistory('output', "Active Internet connections (w/o servers)")
    addToHistory('output', "Proto Recv-Q Send-Q Local Address           Foreign Address         State")
    addToHistory('output', "tcp        0      0 localhost:3000          0.0.0.0:*               LISTEN")
    addToHistory('output', "tcp        0      0 192.168.1.5:22          10.0.0.1:54322          ESTABLISHED")
    
    if (isDeepLayer || args.includes('-an')) {
         addToHistory('output', "tcp        0      0 0.0.0.0:1337            0.0.0.0:*               LISTEN      # Backdoor?")
         addToHistory('output', "flag{netstat_port_1337_backdoor}")
    }
}

export const tcpdump: CommandHandler = (args, { addToHistory }) => {
    if (args.includes('-r') && args.some(a => a.includes('capture.pcap'))) {
        addToHistory('output', "reading from file capture.pcap, link-type EN10MB (Ethernet)")
        addToHistory('output', "14:22:01.112233 IP 192.168.1.5.80 > 10.0.0.1.54322: Flags [P.], seq 1:100, ack 1, win 501, length 99")
        addToHistory('output', "    0x0000:  4500 0054 1a2b 4000 4006 e3c4 c0a8 0105")
        addToHistory('output', "    0x0010:  0a00 0001 0050 d432 0000 0001 0000 0001")
        addToHistory('output', "    0x0020:  5018 01f5 6a0f 0000 666c 6167 7b74 6370") // flag{tcp
        addToHistory('output', "    0x0030:  6475 6d70 5f70 6163 6b65 745f 6361 7074") // dump_packet_capt
        addToHistory('output', "    0x0040:  7572 655f 6372 6564 737d 0a0d           ") // ure_creds}..
        addToHistory('output', "")
        addToHistory('output', "Packet contains plaintext flag: flag{tcpdump_packet_capture_creds}")
    } else {
        addToHistory('output', "tcpdump: verbose output suppressed, use -v or -vv for full protocol decode")
        addToHistory('output', "listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes")
    }
}
