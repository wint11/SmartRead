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
    - Command: `cat README` (Alias for 101)
    - Flag: `flag{start_your_journey_123}`

2.  **Who Am I**
    - Command: `whoami`
    - Flag: `flag{who_am_i_root_wannabe}`

3.  **Location Confirmed**
    - Command: `pwd`
    - Flag: `flag{location_confirmed_home}`

4.  **Echo Chamber**
    - Command: `echo <any_string>` (e.g. `echo hello`)
    - Flag: `flag{echo_echo_echo_111}`

5.  **Connectivity Check**
    - Command: `ping <host>` (e.g. `ping 8.8.8.8`)
    - Flag: `flag{ping_pong_latency_low}`

6.  **Builder**
    - Command: `mkdir <dir>` (e.g. `mkdir test`)
    - Flag: `flag{mkdir_creator_2233}`

7.  **Creator**
    - Command: `touch <file>` (e.g. `touch newfile`)
    - Flag: `flag{touch_artist_4455}`

8.  **Cleaner**
    - Command: `rm <file>` (e.g. `rm newfile`)
    - Flag: `flag{rm_cleaner_6677}`

9.  **Duplicator**
    - Command: `cp <src> <dest>` (e.g. `cp README README.bak`)
    - Flag: `flag{cp_duplicator_8899}`

10. **Organizer**
    - Command: `mv <src> <dest>` (e.g. `mv README.bak old_readme`)
    - Flag: `flag{mv_shifter_0011}`

---

## 🔵 Phase 2: Web & Client-Side
*Goal: Use Browser DevTools (F12) to find hidden secrets.*

11. **HTML Comment**
    - Action: Right-click page -> "View Page Source" (or F12 -> Elements). Look for a comment near the top `<body>`.
    - Flag: `flag{welcome_to_smartread_ctf_2026}`

12. **Network Header**
    - Action: Open DevTools (F12) -> **Network** tab. Refresh the page. Click the request named `hint` (or similar). Check **Response Headers**.
    - Look for `X-CTF-Flag`.
    - Flag: `flag{header_is_key_7733}`

13. **Cookies**
    - Action: DevTools (F12) -> **Application** tab -> **Cookies**.
    - Find `ctf_session_token`. It's Base64 encoded. Decode it (or just submit the flag inside).
    - Flag: `flag{cookie_monster_loves_flags}`

14. **Hidden DOM Element**
    - Action: DevTools (F12) -> **Elements** tab. Press `Ctrl+F` and search for `hidden-flag` or `display: none`.
    - Flag: `flag{hidden_in_plain_sight_9988}`

15. **Console Log**
    - Action: DevTools (F12) -> **Console** tab. Look for a log message.
    - Flag: `flag{console_log_master_3344}`

16. **Robots.txt**
    - Command: `cat /var/www/html/robots.txt` (or just `cat robots.txt` if in html dir)
    - Flag: `flag{robots_keep_secrets_safe_4455}`

17. **Local Storage**
    - Action: DevTools (F12) -> **Application** tab -> **Local Storage**.
    - Key: `debug_token`.
    - Flag: `flag{local_storage_is_not_secret_5566}`

18. **API Upload (POST Request)**
    - Command: `curl -X POST -d "upload=secret" /api/ctf/upload`
    - Flag: `flag{post_requests_are_fun_7788}`

19. **User Agent Spoofing**
    - Command: `curl -A "SmartRead-Agent" http://internal.portal`
    - Flag: `flag{user_agent_spoofing_is_easy_1199}`

20. **JWT Token (Authorization Header)**
    - Command: `curl -H "Authorization: Bearer admin" /api/secure`
    - Flag: `flag{jwt_token_spoofing_master_7744}`

21. **SQL Injection (Login)**
    - Command: `./admin_login`
    - Prompt "Enter username": `' OR '1'='1`
    - Flag: `flag{sql_injection_master_8822}`

22. **Hidden Leaderboard Message**
    - Action: Click the small **`?`** icon in the UI (Leaderboard section). Look at the top ranker's message.
    - Flag: `flag{leaderboard_hunter_rank_1_8899}`

---

## 🟠 Phase 3: System & Terminal
*Goal: Explore the virtual file system and use tools.*

23. **Hidden Files (.env)**
    - Command: `ls -a` then `cat .env` (Check file existence first)
    - Flag: `flag{dotfiles_reveal_secrets_1122}`

24. **Log Analysis (grep)**
    - Command: `grep flag access.log` (Check file existence)
    - Flag: `flag{grep_is_your_friend_5522}`

25. **Environment Variables**
    - Command: `env` (or `printenv`)
    - Flag: `flag{env_vars_are_public_secrets_9988}`

26. **Sudo Privileges**
    - Command: `sudo -l`
    - Command: `sudo cat /var/root/flag.txt`
    - Flag: `flag{sudo_make_me_a_sandwich_7777}`

27. **DNS Lookup**
    - Command: `nslookup internal.db` (or `db.internal`)
    - Flag: `flag{dns_records_reveal_topology_4433}`

28. **Path Traversal**
    - Command: `cat ../../../etc/passwd` (Simulated)
    - Flag: `flag{path_traversal_expert_0011}`

29. **Konami Code**
    - Action: Focus on the terminal input and press keys:
      **Up, Up, Down, Down, Left, Right, Left, Right, B, A**
      (Use Arrow keys).
    - Flag: `flag{konami_code_power_up_3344}`

30. **Reverse Engineering (JS)**
    - Command: `cat legacy_script.js` (Check file existence)
    - Flag: `flag{reverse_engineering_obfuscated_js_9922}`

31. **Hex Dump Analysis**
    - Command: `hexdump firmware.bin` (Check file existence)
    - Flag: `flag{hex_dump_master_binary_analyst_5511}`

32. **Buffer Overflow (Basic)**
    - Command: `./overflow_test`
    - Prompt "Enter data buffer": Type more than 32 characters (e.g., `AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`)
    - Flag: `flag{buffer_overflow_crash_dump_9900}`

33. **Strings Command**
    - Command: `strings <file>` (e.g. `strings firmware.bin` or similar binary)
    - Flag: `flag{strings_command_reveals_all_4455}`

34. **Base64 Decode**
    - Command: `base64 -d <file>` (Look for b64 extension) or decode a known string.
    - Flag: `flag{base64_encoding_is_not_encryption_2211}`

35. **ROT13**
    - Action: Decrypt a ROT13 string found in a file (maybe `notes.txt` or `message.txt`?).
    - Flag: `flag{ebg13_vf_gbb_rnfl_5566}` (Decodes to: `flag{rot13_is_too_easy_5566}`)

---

## 🔴 Phase 4: Deep Layer (Root Access)
*Goal: Infiltrate the internal network and gain root access.*

**Entry Point:**
- **Step 1: Decrypt the Private Key**
  - Command: `openssl id_rsa.enc -k smartread`
  - Note: The password `smartread` is found in the hint of `id_rsa.enc` or related files.
  - Result: This creates a decrypted `id_rsa` file.
- **Step 2: Connect via SSH**
  - Command: `ssh -i id_rsa root@192.168.1.5`
- **Effect**: Interface flips to 3D "Deep Mode".
- Flag: `flag{deep_web_layer_root_access_granted_0011}` (Appears in output)

**Deep Layer Tools & Flags:**

36. **Hidden Process**
    - Command: `ps` (Requires Deep Layer / Root)
    - Flag: `flag{hidden_process_mining_monero}`

37. **Network Backdoor**
    - Command: `netstat` (Requires Deep Layer / Root)
    - Flag: `flag{netstat_port_1337_backdoor}`

38. **Execute Script**
    - Command: `chmod +x /tmp/backdoor.sh`
    - Command: `./tmp/backdoor.sh`
    - Flag: `flag{chmod_777_script_execution}`

39. **Decrypt SSL Key**
    - Command: `openssl id_rsa.enc -k smartread`
    - Flag: `flag{decrypt_ssl_private_key}` (Result is decrypted file content or success message)
    - Note: Decrypted content might contain another flag.

40. **XOR Decryption**
    - Command: `decrypt cipher.bin 0x55`
    - Flag: `flag{reverse_engineering_xor_cipher}`

41. **Kernel Module**
    - Command: `lsmod`
    - Flag: `flag{kernel_module_rootkit_detected}`

42. **Password Cracking (Shadow File)**
    - Command: `john /etc/shadow`
    - Flag: `flag{shadow_file_cracked_root_password}`

43. **Cron Jobs**
    - Command: `cat /etc/crontab`
    - Flag: `flag{cron_job_persistence_script}`

44. **Memory Dump Strings**
    - Command: `strings memory.dmp`
    - Flag: `flag{memory_dump_password_plain}`

45. **Network Capture Analysis**
    - Command: `tcpdump -r capture.pcap`
    - Flag: `flag{tcpdump_packet_capture_creds}`

46. **SSH Keys**
    - Command: `cat /root/.ssh/authorized_keys`
    - Flag: `flag{ssh_authorized_keys_backdoor}`

47. **Docker Escape**
    - Command: `docker ps` (or `docker images`)
    - Flag: `flag{docker_container_escape_host}`

48. **Advanced Buffer Overflow**
    - Command: `./vuln_server`
    - Flag: `flag{buffer_overflow_return_to_libc}`

49. **Binary Strings**
    - Command: `strings /usr/local/bin/token_gen`
    - Flag: `flag{binary_strings_hardcoded_key}`

50. **Steganography**
    - Command: `stegsolve suspicious.jpg`
    - Flag: `flag{steganography_image_hidden_text}`

51. **Misc / Easter Eggs**
    - **rm -rf /**: `rm -rf /` -> `flag{dont_try_this_at_home_rm_rf}`
    - **Vi Exit**: `vi` or `vim` -> `flag{vi_exit_is_hard_colon_q_bang}`
    - **Matrix**: `matrix` -> `flag{follow_the_white_rabbit_matrix}`
    - **Answer to Life**: `answer` or `42` -> `flag{answer_to_life_universe_everything_42}`
    - **Teapot**: `brew` or `coffee` -> `flag{http_418_im_a_teapot}`
    - **Sudo Fail**: Fail sudo 3 times -> `flag{sudo_incident_reported_santa_claus}`
    - **Reboot**: `reboot` -> `flag{have_you_tried_turning_it_off_and_on_again}`
    - **Unzip**: `unzip backup.zip` -> `flag{zip_files_are_fun_9988}`
    - **Snake Game**: `snake` -> Win the game -> `flag{snake_charmer_master_8822}`
    - **Ghost Mode**: 
        - Go to any novel reading page (e.g., `/novel/1/chapter/1`).
        - Click the **Chapter Title** 5 times repeatedly.
        - Observe the visual glitch and the hidden flag below the title.
        - Flag: `flag{y0u_h4v3_th3_3y3s_0f_7ru7h}`

52. **Time Rift (Hidden Game)**
    - **Access**: Find the glitchy "[TIME_RIFT_DETECTED]" link in the Reader View.
    - **Goal**: Collect 5 fragments via minigames and escape.
    - Flag: `flag{run_lola_run_404}`

53. **Paywall Illusion (Lord of the Mysteries)**
    - **Access**: Go to `/novel/cmkccv5w2000r102bpmjww5wu` (Lord of the Mysteries).
    - **Goal**: Read the VIP Chapter 2 ("Divination").
    - **Method**: The content is actually loaded but hidden by a CSS blur effect. Use DevTools to remove the `.paywall-blur` class or delete the overlay.
    - Flag: `flag{paywalls_are_just_css_illusions_7733}`

54. **I am a Billionaire (Wallet Manipulation)**
    - **Access**: Go to Profile -> Wallet (`/profile`).
    - **Goal**: Purchase the "Fool's Membership" which costs 1,000,000 coins.
    - **Method**: 
      1. Inspect your Cookies (Application tab -> Cookies).
      2. Find `shop_session`.
      3. It's a base64 encoded JSON + signature. Decode it: `{"balance":10,"role":"guest","userId":1001}`.
      4. Modify the balance to `1000000`.
      5. The signature verification is weak (allows `none` alg or brute-forceable secret).
      6. Re-encode and update the cookie.
    - Flag: `flag{money_makes_the_world_go_round_8888}`

55. **Web Pioneer (Hidden OS)**
    - **Access**: Boot into the Hidden OS (`/hidden_directory`).
    - **Goal**: Open the **Browser** app (Netscape). Navigate to `http://info.cern.ch`.
    - **Method**: Find the hidden red dot in the footer (bottom right corner). Click it to access secret dev notes.
    - Flag: `flag{web_pioneer_tim_bl}`

56. **Internal Breach (Hidden OS)**
    - **Access**: Boot into the Hidden OS (`/hidden_directory`).
    - **Goal**: Open the **Browser** app. Navigate to `http://internal.portal`.
    - **Method**: Log in to the Admin Dashboard.
      - Username: `admin` (Fixed)
      - Password: `' OR '1'='1` (SQL Injection)
    - Flag: `flag{sql_injection_master_class}`

---

## 🛠 Developer Guide: How to Add a New Flag

Want to contribute a new challenge? Follow this 3-step process:

### Step 1: Register the Flag
Edit `src/lib/ctf/flags/misc.ts` (or other category file like `web.ts`, `system.ts`):
```typescript
export const MISC_FLAGS = {
  // ... existing flags
  101: "flag{your_new_unique_flag_here}", // Add your flag with a unique ID
} as const

export const MISC_HINTS = {
  // ... existing hints
  101: "A helpful hint for the user.",
} as const
```

### Step 2: Define the Challenge
Edit `src/app/ctf/data/challenges.ts` to add the task card:
```typescript
export const STANDARD_TASKS: Challenge[] = [
    // ...
    { 
        id: 101, 
        title: "Your Challenge Title", 
        description: "Description of what the user needs to do.", 
        hint: "Short hint displayed on the card.", 
        points: 50, 
        category: 'misc' // 'web' | 'system' | 'crypto' | 'misc' | 'deep'
    },
];
```

### Step 3: Implement the Logic
Depending on the type of challenge, implement the trigger logic:

*   **Terminal Command**: Edit `src/app/ctf/commands/` (e.g., `misc.ts` or create new).
    ```typescript
    if (args[0] === 'your_secret_command') {
        addToHistory('output', "flag{your_new_unique_flag_here}");
    }
    ```
*   **Web Interaction**: Edit the React component (e.g., `ctf-client.tsx` or `reader-view.tsx`).
    ```tsx
    // Example: Click handler
    const handleClick = () => {
        console.log("flag{your_new_unique_flag_here}");
    }
    ```

**Verification**:
1. Run the app.
2. Trigger your challenge.
3. Copy the flag.
4. Run `submit <flag>` in the CTF terminal.
5. Ensure you receive `[SUCCESS]` and points are awarded.

---
**Good Luck, Hacker!**
