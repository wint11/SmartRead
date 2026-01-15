
export interface Challenge {
    id: number;
    title: string;
    description: string;
    hint: string;
    points: number;
    category?: 'web' | 'system' | 'crypto' | 'misc' | 'deep';
}

export const BEGINNER_TASKS: Challenge[] = [
    { id: 101, title: "Start Your Journey", description: "Read the content of the 'README' file to get started.", hint: "Use the 'cat' command.", points: 10, category: 'system' },
    { id: 102, title: "Who Are You?", description: "Identify the current logged-in user.", hint: "Use the 'whoami' command.", points: 10, category: 'system' },
    { id: 103, title: "Location Confirmed", description: "Find out your current working directory.", hint: "Use the 'pwd' command.", points: 10, category: 'system' },
    { id: 104, title: "Echo Chamber", description: "Print 'Hello World' to the terminal.", hint: "Use the 'echo' command.", points: 10, category: 'system' },
    { id: 105, title: "Connectivity Check", description: "Test network connectivity to an external IP.", hint: "Use the 'ping' command (e.g., ping 8.8.8.8).", points: 10, category: 'system' },
    { id: 106, title: "Builder", description: "Create a new directory named 'workspace'.", hint: "Use the 'mkdir' command.", points: 10, category: 'system' },
    { id: 107, title: "Creator", description: "Create a new empty file named 'notes.txt'.", hint: "Use the 'touch' command.", points: 10, category: 'system' },
    { id: 108, title: "Cleaner", description: "Remove the 'notes.txt' file you just created.", hint: "Use the 'rm' command.", points: 10, category: 'system' },
    { id: 109, title: "Duplicator", description: "Make a copy of the 'README' file named 'README.bak'.", hint: "Use the 'cp' command.", points: 10, category: 'system' },
    { id: 110, title: "Organizer", description: "Rename 'README.bak' to 'backup.txt'.", hint: "Use the 'mv' command.", points: 10, category: 'system' },
];

export const STANDARD_TASKS: Challenge[] = [
    // Web Challenges
    { id: 1, title: "Source Code Secrets", description: "Find the flag hidden in the HTML comments.", hint: "Inspect the page source.", points: 20, category: 'web' },
    { id: 2, title: "Header Hunter", description: "Analyze the HTTP response headers for a secret key.", hint: "Use browser dev tools Network tab.", points: 20, category: 'web' },
    { id: 3, title: "Cookie Monster", description: "Find the flag hidden in your browser cookies.", hint: "Check the Application/Storage tab in dev tools.", points: 20, category: 'web' },
    { id: 4, title: "Hidden Elements", description: "Locate the hidden HTML element on the page.", hint: "Look for 'display: none' in the DOM.", points: 20, category: 'web' },
    { id: 5, title: "Console Logger", description: "Check the browser console for debug messages.", hint: "Open the Console tab in dev tools.", points: 20, category: 'web' },
    { id: 7, title: "SQL Injection", description: "Bypass the login form using SQL injection.", hint: "Try basic payloads like ' OR '1'='1", points: 30, category: 'web' },
    { id: 8, title: "Robot Protocol", description: "Check the robots.txt file for disallowed paths.", hint: "Visit /robots.txt", points: 20, category: 'web' },
    { id: 9, title: "Local Storage", description: "Investigate LocalStorage for sensitive data.", hint: "Check the Application/Storage tab.", points: 20, category: 'web' },
    { id: 10, title: "API Interceptor", description: "Intercept and modify an API request.", hint: "Look for POST requests.", points: 30, category: 'web' },
    { id: 14, title: "User Agent", description: "Spoof your User-Agent string to look like a mobile device.", hint: "Change your browser's User-Agent.", points: 30, category: 'web' },
    { id: 21, title: "Hidden Leaderboard", description: "Find the secret leaderboard page.", hint: "Look for clues in the source code.", points: 40, category: 'web' },
    { id: 23, title: "JWT Manipulation", description: "Forge a JWT token to gain admin privileges.", hint: "Decode the token and change the role.", points: 50, category: 'web' },

    // System Challenges
    { id: 11, title: "Buffer Overflow", description: "Trigger a buffer overflow in the vulnerable binary.", hint: "Input a long string.", points: 30, category: 'system' },
    { id: 12, title: "Hidden Dotfiles", description: "Find the hidden file in the home directory.", hint: "Use 'ls -a'.", points: 20, category: 'system' },
    { id: 15, title: "Log Analysis", description: "Find the suspicious IP in /var/log/access.log.", hint: "Use 'grep' to search.", points: 30, category: 'system' },
    { id: 16, title: "Environment Secrets", description: "Check environment variables for keys.", hint: "Use 'printenv' or 'env'.", points: 20, category: 'system' },
    { id: 18, title: "Sudo Permissions", description: "Check what commands you can run as root.", hint: "Use 'sudo -l'.", points: 30, category: 'system' },
    { id: 19, title: "Network Topology", description: "Map out the internal network via DNS.", hint: "Use 'nslookup'.", points: 30, category: 'system' },
    { id: 20, title: "Path Traversal", description: "Access files outside your directory.", hint: "Use '../' sequences.", points: 30, category: 'system' },
    { id: 22, title: "Deep Layer", description: "Access the restricted deep layer system.", hint: "Requires root access.", points: 50, category: 'system' },

    // Crypto Challenges
    { id: 6, title: "ROT13 Cipher", description: "Decrypt the ROT13 encoded message.", hint: "Shift letters by 13 positions.", points: 20, category: 'crypto' },
    { id: 17, title: "Base64 Decode", description: "Decode the Base64 string.", hint: "Ends with '=' usually.", points: 20, category: 'crypto' },

    // Misc Challenges
    { id: 13, title: "Konami Code", description: "Enter the legendary code.", hint: "Up Up Down Down...", points: 50, category: 'misc' },
    { id: 24, title: "JS Obfuscation", description: "Reverse engineer the obfuscated JavaScript.", hint: "Read the source carefully.", points: 40, category: 'misc' },
    { id: 25, title: "Hex Dump", description: "Analyze the binary hex dump for patterns.", hint: "Look for file headers.", points: 40, category: 'misc' },
    { id: 44, title: "Self Destruct", description: "Try to delete the root directory (Safely!).", hint: "rm -rf / (Simulation only)", points: 10, category: 'misc' },
    { id: 45, title: "Vim Master", description: "Exit the Vim editor.", hint: ":q!", points: 10, category: 'misc' },
    { id: 46, title: "The Matrix", description: "Follow the white rabbit.", hint: "Look for Neo.", points: 10, category: 'misc' },
    { id: 47, title: "Meaning of Life", description: "What is the answer?", hint: "42", points: 10, category: 'misc' },
    { id: 48, title: "I'm a Teapot", description: "Find the HTTP 418 error.", hint: "RFC 2324", points: 10, category: 'misc' },
    { id: 49, title: "Naughty List", description: "Fail to use sudo correctly multiple times.", hint: "Santa is watching.", points: 10, category: 'misc' },
    { id: 50, title: "Reboot", description: "Try to reboot the system.", hint: "Have you tried turning it off and on again?", points: 10, category: 'misc' },
    { id: 51, title: "Archive Extraction", description: "Unzip the backup file.", hint: "Use 'unzip <file>'.", points: 20, category: 'misc' },
    { id: 60, title: "Strings Attached", description: "Analyze the 'firmware.bin' file for readable strings.", hint: "Use 'strings firmware.bin'.", points: 30, category: 'system' },
    { id: 99, title: "Snake Charmer", description: "Find the secret snake game and eat the special fruit.", hint: "Type 'snake' in the terminal.", points: 50, category: 'misc' },
];

export const ROOT_TASKS: Challenge[] = [
    { id: 201, title: "Shadow Cracker", description: "Crack the password hash in /etc/shadow.", hint: "Use a wordlist.", points: 100, category: 'deep' },
    { id: 202, title: "Ghost Process", description: "Find the hidden mining process.", hint: "Check 'ps aux'.", points: 100, category: 'deep' },
    { id: 203, title: "Backdoor Port", description: "Identify the process listening on port 1337.", hint: "Use 'netstat'.", points: 100, category: 'deep' },
    { id: 204, title: "Hardcoded Secrets", description: "Find hardcoded keys in the binary.", hint: "Use 'strings'.", points: 100, category: 'deep' },
    { id: 205, title: "Insecure Script", description: "Exploit the writable script executed by root.", hint: "Check file permissions.", points: 100, category: 'deep' },
    { id: 206, title: "Steganography", description: "Extract hidden data from the image.", hint: "Analyze the bits.", points: 100, category: 'deep' },
    { id: 207, title: "SSL Decryption", description: "Decrypt the captured SSL traffic.", hint: "You need the private key.", points: 100, category: 'deep' },
    { id: 208, title: "Kernel Rootkit", description: "Detect the loaded kernel module.", hint: "Check 'lsmod'.", points: 100, category: 'deep' },
    { id: 209, title: "Persistence", description: "Find the malicious cron job.", hint: "Check /var/spool/cron.", points: 100, category: 'deep' },
    { id: 210, title: "Memory Analysis", description: "Extract the password from the memory dump.", hint: "Search for patterns.", points: 100, category: 'deep' },
];
