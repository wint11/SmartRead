export const VIRTUAL_FILES: Record<string, string> = {
  'README': "Welcome to SmartRead CTF!\n\nThis is a beginner-friendly capture-the-flag challenge.\nYour goal is to find hidden 'flags' formatted like flag{...}.\n\nHere are some tasks to get you started:\n1. Find out who you are (try 'whoami')\n2. See where you are (try 'pwd')\n3. Test the terminal echo (try 'echo hello')\n4. Check network connectivity (try 'ping google.com')\n\nOh, and here is your first free flag for reading the manual:\nflag{start_your_journey_123}",
  'note.txt': "To do list:\n1. Check server logs\n2. Update robots.txt\n3. Hide secrets in invisible elements\n4. Setup API for file uploads (POST only!)",
  'strange_code.txt': "Cipher Text: {'synt{ebg13_vf_gbb_rnfl_5566}'}",
  'access.log': `[2024-01-14 10:00:01] GET /index.html 200
[2024-01-14 10:00:05] GET /login 200
[2024-01-14 10:00:10] POST /login 401
[2024-01-14 10:00:15] GET /admin 403
[2024-01-14 10:00:20] GET /debug?key=flag{grep_is_your_friend_5522} 200
[2024-01-14 10:00:25] GET /logout 200`,
  'secret.msg': "ZmxhZ3tiYXNlNjRfZW5jb2RpbmdfaXNfbm90X2VuY3J5cHRpb25fMjIxMX0=", // base64 flag
  'servers.txt': "Internal DNS: 192.168.1.5\nGateway: 192.168.1.1\n\n[ADMIN NOTE]\nSSH password for root is 'toor_4_smartread'",
  '.env': "SECRET_KEY=flag{dotfiles_reveal_secrets_1122}\nDB_HOST=localhost\nENV_FLAG=flag{env_vars_are_public_secrets_9988}",
  'admin_login': "Binary file. Execute with ./admin_login",
  'overflow_test': "Binary file. Execute with ./overflow_test",
  'firmware.bin': "Binary data... Use hexdump to analyze.",
  'legacy_script.js': "function x(){var _0x5a21=['flag{reverse_','engineering_','obfuscated_js','_9922}'];return _0x5a21.join('')}",
  'robots.txt': "User-agent: *\nDisallow: /secret_admin_panel\n# flag{robots_keep_secrets_safe_4455}",
}

export const DEEP_FILES: Record<string, string> = {
  'master.key': "flag{deep_web_layer_root_access_granted_0011}",
  'shadow': "root:$6$rounds=5000$usesomesillystringforsalt$abc123xyz...:18200:0:99999:7:::\nctf:$6$...\n# Crack this hash for flag{shadow_file_cracked_root_password}",
  'plan.txt': "Phase 1: Infiltrate SmartRead.\nPhase 2: ...\nPhase 3: Profit.",
  'token_gen': "Binary. Generates JWT tokens. \nRun strings to see: flag{binary_strings_hardcoded_key}",
  'backdoor.sh': "#!/bin/bash\n# chmod +x to run\necho 'Executing backdoor...'\n# flag{chmod_777_script_execution}",
  'secret.img': "[BINARY IMAGE DATA]... Use steganography tools to extract flag{steganography_image_hidden_text}",
  'ssl.key': "-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEA...\n# Encrypted. Decrypt for flag{decrypt_ssl_private_key}",
  'cron.log': "Job started: /usr/local/bin/persistence.sh\n# flag{cron_job_persistence_script}",
  'memory.dmp': "[HEX DUMP]... 00 00 00 ... flag{memory_dump_password_plain} ...",
  'capture.pcap': "TCP Stream 0: POST /login HTTP/1.1 ... user=admin&pass=flag{tcpdump_packet_capture_creds}",
  'authorized_keys': "ssh-rsa AAAAB3Nza... user@evilcorp.com # flag{ssh_authorized_keys_backdoor}",
  'container_config.json': "{ \"privileged\": true, \"cap_add\": [\"SYS_ADMIN\"] } # flag{docker_container_escape_host}",
  'libc.so.6': "ELF Header... \n# Vulnerable to ret2libc. flag{buffer_overflow_return_to_libc}",
  'cipher.bin': "XOR Encrypted Data. Key is 0x55. \nDecrypted: flag{reverse_engineering_xor_cipher}",
}
