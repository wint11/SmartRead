export const SYSTEM_FLAGS = {
  11: "flag{buffer_overflow_crash_dump_9900}", // Buffer Overflow
  12: "flag{dotfiles_reveal_secrets_1122}", // Hidden Dotfile
  15: "flag{grep_is_your_friend_5522}", // Grep/Log Analysis
  16: "flag{env_vars_are_public_secrets_9988}", // Environment Variable
  18: "flag{sudo_make_me_a_sandwich_7777}", // Sudo/Permissions
  19: "flag{dns_records_reveal_topology_4433}", // DNS/Nslookup
  20: "flag{path_traversal_expert_0011}", // Path Traversal
  22: "flag{deep_web_layer_root_access_granted_0011}", // Deep Layer Root
  60: "flag{strings_command_reveals_all_4455}", // Firmware Strings
} as const

export const SYSTEM_HINTS = {
  11: "Try to overflow the buffer.",
  12: "Check for hidden files with -a.",
  15: "Use grep to search logs.",
  16: "Check environment variables.",
  17: "Check sudo permissions.",
  18: "Check sudo permissions.",
  19: "Check DNS records.",
  20: "Path traversal in cat command.",
  22: "Hack into the internal server.",
  60: "Use the strings command on the binary.",
} as const