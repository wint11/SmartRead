
export type FileType = 'file' | 'directory';

export interface FileNode {
  type: 'file';
  content: string;
  permissions: string;
  owner: string;
  group: string;
  size?: number;
  id?: string; // ID for secure content fetching
}

export interface DirectoryNode {
  type: 'directory';
  children: Record<string, FileNode | DirectoryNode>;
  permissions: string;
  owner: string;
  group: string;
}

export type FileSystemNode = FileNode | DirectoryNode;

const createFile = (content: string, permissions = 'rw-r--r--', owner = 'ctf', group = 'ctf', id?: string): FileNode => ({
  type: 'file',
  content,
  permissions,
  owner,
  group,
  size: content.length,
  id
});

const createDir = (children: Record<string, FileSystemNode> = {}, permissions = 'rwxr-xr-x', owner = 'root', group = 'root'): DirectoryNode => ({
  type: 'directory',
  children,
  permissions,
  owner,
  group
});

export const INITIAL_FILE_SYSTEM: DirectoryNode = createDir({
  'bin': createDir({
    'bash': createFile('BINARY_CONTENT', 'rwxr-xr-x', 'root', 'root'),
    'ls': createFile('BINARY_CONTENT', 'rwxr-xr-x', 'root', 'root'),
    'cat': createFile('BINARY_CONTENT', 'rwxr-xr-x', 'root', 'root'),
    'pwd': createFile('BINARY_CONTENT', 'rwxr-xr-x', 'root', 'root'),
    'whoami': createFile('BINARY_CONTENT', 'rwxr-xr-x', 'root', 'root'),
    'grep': createFile('BINARY_CONTENT', 'rwxr-xr-x', 'root', 'root'),
    'ssh': createFile('BINARY_CONTENT', 'rwxr-xr-x', 'root', 'root'),
    'strings': createFile('BINARY_CONTENT', 'rwxr-xr-x', 'root', 'root'),
  }),
  'etc': createDir({
    'crontab': createFile(
        "# /etc/crontab: system-wide crontab\n* * * * * root /var/backups/script.sh\n# Flag: flag{cron_job_persistence_script}",
        'rw-r--r--', 'root', 'root'
    ),
    'passwd': createFile(
      'root:x:0:0:root:/root:/bin/bash\nctf:x:1000:1000:CTF User:/home/ctf:/bin/bash\n# Flag: flag{path_traversal_expert_0011}', 
      'rw-r--r--', 'root', 'root'
    ),
    'shadow': createFile(
      'root:$6$rounds=5000$saltsalt$hashhashhash...:18200:0:99999:7:::\n# Password hash is salted. Good luck cracking it.', 
      'r--------', 'root', 'root'
    ),
    'hosts': createFile('127.0.0.1 localhost\n192.168.1.5 internal.server', 'rw-r--r--', 'root', 'root'),
    'hostname': createFile('smartread-ctf', 'rw-r--r--', 'root', 'root'),
  }),
  'home': createDir({
    'ctf': createDir({
      'README': createFile(
        "Welcome to SmartRead CTF v2.0 (Hardened Edition)!\n\nSecurity policies have been updated. Plain text secrets are no longer allowed.\nYour goal is to penetrate the system and retrieve flags.\n\nStart by exploring the system. Good luck.\n\nType 'help' for available commands.\n\nFlag: flag{start_your_journey_123}"
      ),
      'todo.md': createFile(
        "# Tasks\n- [x] Secure SSH access (disabled password auth)\n- [x] Encrypt sensitive files\n- [ ] Clean up system logs (URGENT: logs contain debug info)\n- [ ] Patch SQL injection vulnerability in admin portal\n- [ ] Remove debug symbols from firmware.bin"
      ),
      'strange_code.txt': createFile(
        "[SECURE CONTENT]", 'rw-r--r--', 'ctf', 'ctf', 'strange_code_txt'
      ),
      'servers.txt': createFile(
        "Network Configuration:\n\nDNS: 10.0.0.5\nGateway: 10.0.0.1\n\nSSH Access:\nHost: 192.168.1.5 (root)\nAuth: Public Key Only (Password Disabled)\nKey Location: Check secure backups"
      ),
      'id_rsa.enc': createFile(
        "U2FsdGVkX1+... (Encrypted with AES-256)\nHint: The password is the name of the company (lowercase)."
      ),
      'secrets.txt.b64': createFile(
        "ZmxhZ3tiYXNlNjRfZW5jb2RpbmdfaXNfbm90X2VuY3J5cHRpb25fMjIxMX0=", 'rw-r--r--', 'ctf', 'ctf'
      ),
      'backup.zip.b64': createFile(
        "[SECURE CONTENT]", 'rw-r--r--', 'ctf', 'ctf', 'backup_zip_b64'
      ),
      'firmware.bin': createFile(
        "[SECURE CONTENT]", 'rwxr-xr-x', 'ctf', 'ctf', 'firmware_bin'
      ),
      'suspicious_image.jpg': createFile(
        "[BINARY DATA]... (Try inspecting metadata or strings)"
      ),
    }, 'rwxr-xr-x', 'ctf', 'ctf')
  }),
  'var': createDir({
    'log': createDir({
      'access.log': createFile(
        "[SECURE CONTENT]", 'rw-r-----', 'root', 'adm', 'access_log'
      ),
      'syslog': createFile('', 'rw-r-----', 'root', 'adm'),
      'memory.dmp': createFile(
        "[SECURE CONTENT]", 'r--------', 'root', 'root', 'memory_dmp'
      ),
    }),
    'www': createDir({
      'html': createDir({
        'index.html': createFile('<html>...</html>'),
        'robots.txt': createFile("User-agent: *\nDisallow: /hidden_directory/\n# Don't look here.\n# Flag: flag{robots_keep_secrets_safe_4455}"),
        '.env': createFile("DB_HOST=localhost\nDB_USER=admin\nDB_PASS=*******\n# API_KEY moved to secure vault\n# Flag: flag{dotfiles_reveal_secrets_1122}"),
        'js': createDir({
           'legacy_script.js': createFile(
             "[SECURE CONTENT]", 'rw-r--r--', 'root', 'root', 'legacy_script_js'
           )
        })
      })
    })
  }),
  'tmp': createDir({
    'backdoor.sh': createFile(
      "#!/bin/bash\n# Backdoor Script v1.0\necho 'Initializing root access...'",
      'rw-r--r--', 'root', 'root'
    )
  }, 'rwxrwxrwt'), // Sticky bit simulated
  'root': createDir({
    'root_flag.txt': createFile(
      "Permission Denied: Readable only by root.", 
      'r--------', 'root', 'root'
    ),
    'plan.txt': createFile("Confidential: Project X launch date set for 2025.", 'r--------', 'root', 'root'),
    '.ssh': createDir({
      'authorized_keys': createFile("ssh-rsa AAAAB3Nza... user@admin-pc\n# Flag: flag{ssh_authorized_keys_backdoor}", 'rw-------', 'root', 'root')
    }),
    '.bash_history': createFile(
      "[SECURE CONTENT]", 'rw-------', 'root', 'root', 'bash_history'
    )
  }, 'rwx------', 'root', 'root'),
  'usr': createDir({
    'local': createDir({
      'bin': createDir({
        'token_gen': createFile(
          "[SECURE CONTENT]", 'rwxr-xr-x', 'root', 'root', 'token_gen'
        )
      })
    })
  })
});
