export const DEEP_FLAGS = {
  201: "flag{shadow_file_cracked_root_password}", // 1. Shadow file crack
  202: "flag{hidden_process_mining_monero}", // 2. Hidden process (ps)
  203: "flag{netstat_port_1337_backdoor}", // 3. Netstat backdoor
  204: "flag{binary_strings_hardcoded_key}", // 4. Strings on binary
  205: "flag{chmod_777_script_execution}", // 5. Chmod execute
  206: "flag{steganography_image_hidden_text}", // 6. Steganography
  207: "flag{decrypt_ssl_private_key}", // 7. SSL Key Decrypt
  208: "flag{kernel_module_rootkit_detected}", // 8. Kernel Module
  209: "flag{cron_job_persistence_script}", // 9. Cron job
  210: "flag{memory_dump_password_plain}", // 10. Memory Dump
  211: "flag{tcpdump_packet_capture_creds}", // 11. Network Capture
  212: "flag{ssh_authorized_keys_backdoor}", // 12. SSH Keys
  213: "flag{docker_container_escape_host}", // 13. Docker Escape
  214: "flag{buffer_overflow_return_to_libc}", // 14. Advanced BOF
  215: "flag{reverse_engineering_xor_cipher}", // 15. Reverse Eng
  304: "flag{history_file_reveals_actions}", // History Lesson
} as const

export const DEEP_HINTS = {
  201: "Hash cracking is essential.",
  202: "Check running processes.",
  203: "Listen to the right port.",
  204: "Strings are visible in binaries.",
  205: "Permissions matter.",
  206: "Images hide secrets.",
  207: "Private keys can be decrypted.",
  208: "Check loaded modules.",
  209: "Scheduled tasks run automatically.",
  210: "RAM holds secrets.",
  211: "Analyze network traffic.",
  212: "Who can SSH in?",
  213: "Break out of the container.",
  214: "Control the instruction pointer.",
  215: "XOR is reversible.",
} as const