export interface SkillNode {
  id: string
  title: string
  description: string
  category: 'beginner' | 'web' | 'system' | 'crypto' | 'deep'
  requiredFlagIds: number[]
  position: { x: number; y: number } // For visual layout (optional/simplified)
  icon?: string
}

export const SKILL_TREE: SkillNode[] = [
  // Beginner (Linux)
  {
    id: 'linux_nav',
    title: 'Navigator',
    description: 'Mastery of basic file system navigation (cd, ls, pwd).',
    category: 'beginner',
    requiredFlagIds: [103],
    position: { x: 1, y: 1 }
  },
  {
    id: 'linux_manip',
    title: 'Manipulator',
    description: 'Ability to create, move, copy, and delete files.',
    category: 'beginner',
    requiredFlagIds: [106, 107, 108, 109, 110],
    position: { x: 1, y: 2 }
  },
  {
    id: 'linux_id',
    title: 'Identity',
    description: 'Understanding user identity in the terminal.',
    category: 'beginner',
    requiredFlagIds: [102],
    position: { x: 1, y: 3 }
  },
  {
    id: 'linux_net',
    title: 'Communicator',
    description: 'Basic network connectivity checks.',
    category: 'beginner',
    requiredFlagIds: [105],
    position: { x: 1, y: 4 }
  },

  // Web
  {
    id: 'web_inspect',
    title: 'Inspector',
    description: 'Analyzing HTML source and hidden DOM elements.',
    category: 'web',
    requiredFlagIds: [1, 4],
    position: { x: 2, y: 1 }
  },
  {
    id: 'web_headers',
    title: 'Header Hacker',
    description: 'Manipulating and inspecting HTTP headers.',
    category: 'web',
    requiredFlagIds: [2, 14],
    position: { x: 2, y: 2 }
  },
  {
    id: 'web_storage',
    title: 'Storage Hunter',
    description: 'Extracting secrets from Cookies and LocalStorage.',
    category: 'web',
    requiredFlagIds: [3, 9],
    position: { x: 2, y: 3 }
  },
  {
    id: 'web_api',
    title: 'API Whisperer',
    description: 'Interacting with APIs and manipulating methods.',
    category: 'web',
    requiredFlagIds: [10],
    position: { x: 2, y: 4 }
  },
  {
    id: 'web_sqli',
    title: 'SQL Injector',
    description: 'Bypassing authentication via SQL Injection.',
    category: 'web',
    requiredFlagIds: [7],
    position: { x: 2, y: 5 }
  },
  {
    id: 'web_auth',
    title: 'Token Master',
    description: 'Exploiting JWT and authentication mechanisms.',
    category: 'web',
    requiredFlagIds: [23],
    position: { x: 2, y: 6 }
  },

  // System
  {
    id: 'sys_recon',
    title: 'Investigator',
    description: 'Gathering system info via logs and environment.',
    category: 'system',
    requiredFlagIds: [15, 16], // 15=grep, 16=env
    position: { x: 3, y: 1 }
  },
  {
    id: 'sys_priv',
    title: 'Privilege Escalator',
    description: 'Abusing sudo permissions.',
    category: 'system',
    requiredFlagIds: [18],
    position: { x: 3, y: 2 }
  },
  {
    id: 'sys_path',
    title: 'Pathfinder',
    description: 'Exploiting Path Traversal vulnerabilities.',
    category: 'system',
    requiredFlagIds: [20],
    position: { x: 3, y: 3 }
  },
  {
    id: 'sys_bin',
    title: 'Binary Analyst',
    description: 'Analyzing binary files (hexdump, strings).',
    category: 'system',
    requiredFlagIds: [25, 60], // 25=hexdump, 60=strings
    position: { x: 3, y: 4 }
  },
  {
    id: 'sys_bof',
    title: 'Overflow Artist',
    description: 'Performing basic Buffer Overflows.',
    category: 'system',
    requiredFlagIds: [11],
    position: { x: 3, y: 5 }
  },

  // Crypto
  {
    id: 'crypto_decode',
    title: 'Decoder',
    description: 'Decoding common formats like Base64.',
    category: 'crypto',
    requiredFlagIds: [17],
    position: { x: 4, y: 1 }
  },
  {
    id: 'crypto_cipher',
    title: 'Cipher Solver',
    description: 'Breaking classic ciphers (ROT13, etc).',
    category: 'crypto',
    requiredFlagIds: [6],
    position: { x: 4, y: 2 }
  },

  // Deep
  {
    id: 'deep_process',
    title: 'Process Hunter',
    description: 'Identifying hidden and malicious processes.',
    category: 'deep',
    requiredFlagIds: [202],
    position: { x: 5, y: 1 }
  },
  {
    id: 'deep_net',
    title: 'Port Scanner',
    description: 'Analyzing active network connections.',
    category: 'deep',
    requiredFlagIds: [203],
    position: { x: 5, y: 2 }
  },
  {
    id: 'deep_key',
    title: 'Key Master',
    description: 'Managing SSH keys and SSL decryption.',
    category: 'deep',
    requiredFlagIds: [207, 212],
    position: { x: 5, y: 3 }
  },
  {
    id: 'deep_crack',
    title: 'Password Cracker',
    description: 'Cracking shadow file hashes.',
    category: 'deep',
    requiredFlagIds: [201],
    position: { x: 5, y: 4 }
  },
  {
    id: 'deep_forensics',
    title: 'Forensics Expert',
    description: 'Analyzing memory dumps and packet captures.',
    category: 'deep',
    requiredFlagIds: [210, 211],
    position: { x: 5, y: 5 }
  },
  {
    id: 'deep_exploit',
    title: 'Exploit Dev',
    description: 'Advanced exploitation (Container escape, ROP).',
    category: 'deep',
    requiredFlagIds: [213, 214],
    position: { x: 5, y: 6 }
  }
]
