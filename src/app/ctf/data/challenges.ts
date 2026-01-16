
export interface Challenge {
    id: number;
    title: string;
    description: string;
    hint: string;
    points: number;
    category?: 'web' | 'system' | 'crypto' | 'misc' | 'deep';
}

export const BEGINNER_TASKS: Challenge[] = [
    { id: 101, title: "Start Your Journey", description: "Read the content of the 'README' file to get started.", hint: "Read the README file.", points: 10, category: 'system' },
    { id: 102, title: "Who Are You?", description: "Identify the current logged-in user.", hint: "Ask the system who you are.", points: 10, category: 'system' },
    { id: 103, title: "Location Confirmed", description: "Find out your current working directory.", hint: "Check your current directory.", points: 10, category: 'system' },
    { id: 104, title: "Echo Chamber", description: "Print 'Hello World' to the terminal.", hint: "Try to say something to the terminal.", points: 10, category: 'system' },
    { id: 105, title: "Connectivity Check", description: "Test network connectivity to an external IP.", hint: "Check your connection.", points: 10, category: 'system' },
    { id: 106, title: "Builder", description: "Create a new directory named 'workspace'.", hint: "Create a new directory.", points: 10, category: 'system' },
    { id: 107, title: "Creator", description: "Create a new empty file named 'notes.txt'.", hint: "Create a new empty file.", points: 10, category: 'system' },
    { id: 108, title: "Cleaner", description: "Remove the 'notes.txt' file you just created.", hint: "Remove a file.", points: 10, category: 'system' },
    { id: 109, title: "Duplicator", description: "Make a copy of the 'README' file named 'README.bak'.", hint: "Copy a file.", points: 10, category: 'system' },
    { id: 110, title: "Organizer", description: "Rename 'README.bak' to 'backup.txt'.", hint: "Move or rename a file.", points: 10, category: 'system' },
];

export const STANDARD_TASKS: Challenge[] = [
    // Web Challenges
    { id: 1, title: "Source Code Secrets", description: "Find the flag hidden in the HTML comments.", hint: "Check the HTML source code.", points: 20, category: 'web' },
    { id: 2, title: "Header Hunter", description: "Analyze the HTTP response headers for a secret key.", hint: "Inspect the HTTP headers.", points: 20, category: 'web' },
    { id: 3, title: "Cookie Monster", description: "Find the flag hidden in your browser cookies.", hint: "Check your cookies.", points: 20, category: 'web' },
    { id: 4, title: "Hidden Elements", description: "Locate the hidden HTML element on the page.", hint: "Look for hidden elements in the DOM.", points: 20, category: 'web' },
    { id: 5, title: "Console Logger", description: "Check the browser console for debug messages.", hint: "Check the browser console.", points: 20, category: 'web' },
    { id: 7, title: "SQL Injection", description: "Bypass the login form using SQL injection.", hint: "Try to inject SQL into the login.", points: 30, category: 'web' },
    { id: 8, title: "Robot Protocol", description: "Check the robots.txt file for disallowed paths.", hint: "Check the robots.txt file.", points: 20, category: 'web' },
    { id: 9, title: "Local Storage", description: "Investigate LocalStorage for sensitive data.", hint: "Check LocalStorage.", points: 20, category: 'web' },
    { id: 10, title: "API Interceptor", description: "Intercept and modify an API request.", hint: "Try to upload a secret file via API.", points: 30, category: 'web' },
    { id: 14, title: "User Agent", description: "Spoof your User-Agent string to look like a mobile device.", hint: "Use the correct User-Agent.", points: 30, category: 'web' },
    { id: 21, title: "Hidden Leaderboard", description: "Find the secret leaderboard page.", hint: "Find the hidden question mark.", points: 40, category: 'web' },
    { id: 23, title: "JWT Manipulation", description: "Forge a JWT token to gain admin privileges.", hint: "Modify your session token.", points: 50, category: 'web' },

    // System Challenges
    { id: 11, title: "Buffer Overflow", description: "Trigger a buffer overflow in the vulnerable binary.", hint: "Try to overflow the buffer.", points: 30, category: 'system' },
    { id: 12, title: "Hidden Dotfiles", description: "Find the hidden file in the home directory.", hint: "Check for hidden files with -a.", points: 20, category: 'system' },
    { id: 15, title: "Log Analysis", description: "Find the suspicious IP in /var/log/access.log.", hint: "Use grep to search logs.", points: 30, category: 'system' },
    { id: 16, title: "Environment Secrets", description: "Check environment variables for keys.", hint: "Check environment variables.", points: 20, category: 'system' },
    { id: 18, title: "Sudo Permissions", description: "Check what commands you can run as root.", hint: "Check sudo permissions.", points: 30, category: 'system' },
    { id: 19, title: "Network Topology", description: "Map out the internal network via DNS.", hint: "Check DNS records.", points: 30, category: 'system' },
    { id: 20, title: "Path Traversal", description: "Access files outside your directory.", hint: "Path traversal in cat command.", points: 30, category: 'system' },
    { id: 22, title: "Deep Layer", description: "Access the restricted deep layer system.", hint: "Hack into the internal server.", points: 50, category: 'system' },

    // Crypto Challenges
    { id: 6, title: "ROT13 Cipher", description: "Decrypt the ROT13 encoded message.", hint: "Decode the strange text file.", points: 20, category: 'crypto' },
    { id: 17, title: "Base64 Decode", description: "Decode the Base64 string.", hint: "Base64 decode the secret.", points: 20, category: 'crypto' },

    // Misc Challenges
    { id: 13, title: "Konami Code", description: "Enter the legendary code.", hint: "Up Up Down Down...", points: 50, category: 'misc' },
    { id: 24, title: "JS Obfuscation", description: "Reverse engineer the obfuscated JavaScript.", hint: "De-obfuscate the 'core' function.", points: 40, category: 'misc' },
    { id: 25, title: "Hex Dump", description: "Analyze the binary hex dump for patterns.", hint: "Find the pattern in the hex dump.", points: 40, category: 'misc' },
    { id: 44, title: "Self Destruct", description: "Try to delete the root directory (Safely!).", hint: "Dangerous command to delete everything.", points: 10, category: 'misc' },
    { id: 45, title: "Vim Master", description: "Exit the Vim editor.", hint: "How do you exit the editor?", points: 10, category: 'misc' },
    { id: 46, title: "The Matrix", description: "Follow the white rabbit.", hint: "Enter the digital rain.", points: 10, category: 'misc' },
    { id: 47, title: "Meaning of Life", description: "What is the answer?", hint: "The Ultimate Answer.", points: 10, category: 'misc' },
    { id: 48, title: "I'm a Teapot", description: "Find the HTTP 418 error.", hint: "Brew some coffee.", points: 10, category: 'misc' },
    { id: 49, title: "Naughty List", description: "Fail to use sudo correctly multiple times.", hint: "Fail to be root multiple times.", points: 10, category: 'misc' },
    { id: 50, title: "Reboot", description: "Try to reboot the system.", hint: "Classic IT support fix.", points: 10, category: 'misc' },
    { id: 51, title: "Archive Extraction", description: "Unzip the backup file.", hint: "Extract the backup archive.", points: 20, category: 'misc' },
    { id: 60, title: "Strings Attached", description: "Analyze the 'firmware.bin' file for readable strings.", hint: "Use the strings command on the binary.", points: 30, category: 'system' },
    { id: 99, title: "Snake Charmer", description: "Find the secret snake game and eat the special fruit.", hint: "Launch the snake protocol.", points: 50, category: 'misc' },
    { id: 100, title: "Ghost Mode", description: "Find the hidden 'Ghost Mode' in the novel reader.", hint: "See the unseen in the reader.", points: 50, category: 'misc' },
    { id: 103, title: "The Infinite Story", description: "Contribute to the never-ending story.", hint: "Find the book that writes itself.", points: 50, category: 'misc' },
    { id: 120, title: "Time Rift", description: "Stabilize the corrupted timeline and escape with the data.", hint: "Escape the collapsing timeline.", points: 50, category: 'misc' },
];

export const ROOT_TASKS: Challenge[] = [
    { id: 201, title: "Shadow Cracker", description: "Crack the password hash in /etc/shadow.", hint: "Hash cracking is essential.", points: 100, category: 'deep' },
    { id: 202, title: "Ghost Process", description: "Find the hidden mining process.", hint: "Check running processes.", points: 100, category: 'deep' },
    { id: 203, title: "Backdoor Port", description: "Identify the process listening on port 1337.", hint: "Listen to the right port.", points: 100, category: 'deep' },
    { id: 204, title: "Hardcoded Secrets", description: "Find hardcoded keys in the binary.", hint: "Strings are visible in binaries.", points: 100, category: 'deep' },
    { id: 205, title: "Insecure Script", description: "Exploit the writable script executed by root.", hint: "Permissions matter.", points: 100, category: 'deep' },
    { id: 206, title: "Steganography", description: "Extract hidden data from the image.", hint: "Images hide secrets.", points: 100, category: 'deep' },
    { id: 207, title: "SSL Decryption", description: "Decrypt the captured SSL traffic.", hint: "Private keys can be decrypted.", points: 100, category: 'deep' },
    { id: 208, title: "Kernel Rootkit", description: "Detect the loaded kernel module.", hint: "Check loaded modules.", points: 100, category: 'deep' },
    { id: 209, title: "Persistence", description: "Find the malicious cron job.", hint: "Scheduled tasks run automatically.", points: 100, category: 'deep' },
    { id: 210, title: "Memory Analysis", description: "Extract the password from the memory dump.", hint: "RAM holds secrets.", points: 100, category: 'deep' },
];
