# SmartRead CTF - Complete Walkthrough / Solutions (保姆级通关教程)

Welcome to the SmartRead CTF Challenge! This guide provides step-by-step instructions to find every single flag in the game. 

**Total Flags:** 43
**Structure:**
1.  **Beginner Phase**: Learn the basics.
2.  **Web Phase**: Explore client-side vulnerabilities.
3.  **System Phase**: Master the terminal.
4.  **Deep Layer**: Root access and advanced exploitation.

---

## 🟢 Phase 1: Beginner (Tutorial)
*Goal: Get familiar with the CLI interface.*

1.  **Welcome Flag**
    - Command: `cat WELCOME.txt`
    - Flag: `flag{welcome_recruit_start_here}`

2.  **Help Command**
    - Command: `help`
    - Flag: `flag{first_command_success_101}`

3.  **Directory Listing**
    - Command: `ls`
    - Flag: `flag{directory_explorer_202}`

4.  **Read Guide**
    - Command: `cat guide.txt`
    - Flag: `flag{file_reader_303}`

5.  **Check Status**
    - Command: `status`
    - Flag: `flag{system_status_ok_404}`
    - *Note: After this, you will see a congratulatory message!*

---

## 🔵 Phase 2: Web & Client-Side
*Goal: Use Browser DevTools (F12) to find hidden secrets.*

6.  **HTML Comment**
    - Action: Right-click page -> "View Page Source" (or F12 -> Elements). Look for a comment near the top `<body>`.
    - Flag: `flag{welcome_to_smartread_ctf_2026}`

7.  **Network Header**
    - Action: Open DevTools (F12) -> **Network** tab. Refresh the page. Click the request named `hint` (or similar). Check **Response Headers**.
    - Look for `X-CTF-Flag`.
    - Flag: `flag{header_is_key_7733}`

8.  **Cookies**
    - Action: DevTools (F12) -> **Application** tab -> **Cookies**.
    - Find `ctf_session_token`. It's Base64 encoded. Decode it (or just submit the flag inside).
    - Flag: `flag{cookie_monster_loves_flags}`

9.  **Hidden DOM Element**
    - Action: DevTools (F12) -> **Elements** tab. Press `Ctrl+F` and search for `hidden-flag` or `display: none`.
    - Flag: `flag{hidden_in_plain_sight_9988}`

10. **Console Log**
    - Action: DevTools (F12) -> **Console** tab. Look for a log message.
    - Flag: `flag{console_log_master_3344}`

11. **Robots.txt**
    - Command: `cat robots.txt`
    - Flag: `flag{robots_keep_secrets_safe_4455}`

12. **Local Storage**
    - Action: DevTools (F12) -> **Application** tab -> **Local Storage**.
    - Key: `debug_token`.
    - Flag: `flag{local_storage_is_not_secret_5566}`

13. **API Upload (POST Request)**
    - Command: `curl -X POST -d "upload=secret" /api/ctf/upload`
    - Flag: `flag{post_requests_are_fun_7788}`

14. **User Agent Spoofing**
    - Command: `curl -A "SmartRead-Agent" http://internal.portal`
    - Flag: `flag{user_agent_spoofing_is_easy_1199}`

15. **JWT Token (Authorization Header)**
    - Command: `curl -H "Authorization: Bearer admin" /api/secure`
    - Flag: `flag{jwt_token_spoofing_master_7744}`

16. **SQL Injection (Login)**
    - Command: `./admin_login`
    - Prompt "Enter username": `' OR '1'='1`
    - Flag: `flag{sql_injection_master_8822}`

17. **Hidden Leaderboard Message**
    - Action: Click the small **`?`** icon in the UI (Leaderboard section). Look at the top ranker's message.
    - Flag: `flag{leaderboard_hunter_rank_1_8899}`

---

## 🟠 Phase 3: System & Terminal
*Goal: Explore the virtual file system and use tools.*

18. **Hidden Files (.env)**
    - Command: `ls -a` then `cat .env`
    - Flag: `flag{dotfiles_reveal_secrets_1122}`

19. **Log Analysis (grep)**
    - Command: `grep flag access.log`
    - Flag: `flag{grep_is_your_friend_5522}`

20. **Environment Variables**
    - Command: `env` (or `printenv`)
    - Flag: `flag{env_vars_are_public_secrets_9988}`

21. **Sudo Privileges**
    - Command: `sudo -l`
    - Command: `sudo cat /var/root/flag.txt`
    - Flag: `flag{sudo_make_me_a_sandwich_7777}`

22. **DNS Lookup**
    - Command: `nslookup internal.db`
    - Flag: `flag{dns_records_reveal_topology_4433}`

23. **Path Traversal**
    - Command: `cat ../../../etc/passwd`
    - Flag: `flag{path_traversal_expert_0011}`

24. **Konami Code**
    - Action: Focus on the terminal input and press keys:
      **Up, Up, Down, Down, Left, Right, Left, Right, B, A**
      (Use Arrow keys).
    - Flag: `flag{konami_code_power_up_3344}`

25. **Reverse Engineering (JS)**
    - Command: `cat legacy_script.js`
    - Flag: `flag{reverse_engineering_obfuscated_js_9922}`

26. **Hex Dump Analysis**
    - Command: `hexdump firmware.bin`
    - Flag: `flag{hex_dump_master_binary_analyst_5511}`

27. **Buffer Overflow (Basic)**
    - Command: `./overflow_test`
    - Prompt "Enter data buffer": Type more than 32 characters (e.g., `AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
    - Flag: `flag{buffer_overflow_crash_dump_9900}`

---

## 🔴 Phase 4: Deep Layer (Root Access)
*Goal: Infiltrate the internal network and gain root access.*

**Entry Point:**
- Command: `ssh root@192.168.1.5`
- Password: `toor_4_smartread`
- **Effect**: Interface flips to 3D "Deep Mode".
- Flag: `flag{deep_web_layer_root_access_granted_0011}` (Appears in output)

**Deep Layer Tools & Flags:**

28. **Hidden Process**
    - Command: `ps`
    - Flag: `flag{hidden_process_mining_monero}`

29. **Network Backdoor**
    - Command: `netstat`
    - Flag: `flag{netstat_port_1337_backdoor}`

30. **Execute Script**
    - Command: `chmod +x backdoor.sh`
    - Command: `./backdoor.sh`
    - Flag: `flag{chmod_777_script_execution}`

31. **Decrypt SSL Key**
    - Command: `decrypt ssl.key`
    - Flag: `flag{decrypt_ssl_private_key}`

32. **XOR Decryption**
    - Command: `decrypt cipher.bin 0x55`
    - Flag: `flag{reverse_engineering_xor_cipher}`

33. **Kernel Module**
    - Command: `lsmod`
    - Flag: `flag{kernel_module_rootkit_detected}`

34. **Password Cracking (Shadow File)**
    - Command: `john shadow`
    - Flag: `flag{shadow_file_cracked_root_password}`

35. **Cron Jobs**
    - Command: `cat /etc/crontab`
    - Flag: `flag{cron_job_persistence_script}`

36. **Memory Dump Strings**
    - Command: `strings memory.dmp`
    - Flag: `flag{memory_dump_password_plain}`

37. **Network Capture Analysis**
    - Command: `tcpdump -r capture.pcap`
    - Flag: `flag{tcpdump_packet_capture_creds}`

38. **SSH Keys**
    - Command: `cat /root/.ssh/authorized_keys`
    - Flag: `flag{ssh_authorized_keys_backdoor}`

39. **Docker Escape**
    - Command: `docker ps` (or `docker images`)
    - Flag: `flag{docker_container_escape_host}`

40. **Advanced Buffer Overflow**
    - Command: `./vuln_server`
    - Flag: `flag{buffer_overflow_return_to_libc}`

41. **Binary Strings**
    - Command: `strings token_gen`
    - Flag: `flag{binary_strings_hardcoded_key}`

42. **Steganography**
    - Command: `stegsolve suspicious.jpg`
    - Flag: `flag{steganography_image_hidden_text}`

43. **Logout**
    - Command: `exit`
    - Effect: Returns to normal layer.

---
**Good Luck, Hacker!**
