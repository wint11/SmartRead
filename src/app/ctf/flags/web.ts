export const WEB_FLAGS = {
  1: "flag{welcome_to_smartread_ctf_2026}", // HTML Comment
  2: "flag{header_is_key_7733}", // Header
  3: "flag{cookie_monster_loves_flags}", // Cookie
  4: "flag{hidden_in_plain_sight_9988}", // Hidden Element
  5: "flag{console_log_master_3344}", // Console Log
  7: "flag{sql_injection_master_8822}", // SQL Injection
  8: "flag{robots_keep_secrets_safe_4455}", // Robots
  9: "flag{local_storage_is_not_secret_5566}", // LocalStorage
  10: "flag{post_requests_are_fun_7788}", // API POST
  14: "flag{user_agent_spoofing_is_easy_1199}", // User Agent
  21: "flag{leaderboard_hunter_rank_1_8899}", // Hidden Leaderboard
  23: "flag{jwt_token_spoofing_master_7744}", // JWT Manipulation
} as const

export const WEB_HINTS = {
  1: "Check the HTML source code.",
  2: "Inspect the HTTP headers.",
  3: "Check your cookies.",
  4: "Look for hidden elements in the DOM.",
  5: "Check the browser console.",
  7: "Try to inject SQL into the login.",
  8: "Check the robots.txt file.",
  9: "Check LocalStorage.",
  10: "Try to upload a secret file via API.",
  14: "Use the correct User-Agent.",
  21: "Find the hidden question mark.",
  23: "Modify your session token.",
} as const
