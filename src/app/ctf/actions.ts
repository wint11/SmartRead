'use server'

import { cookies } from 'next/headers'
import { FLAGS } from '@/lib/ctf/flags'
import { SECURE_FILES } from '@/lib/ctf/secure-data'

export async function verifyFlag(inputFlag: string) {
  const normalizedFlag = inputFlag.trim()
  
  // Find if the input flag matches any of our known flags
  // We compare against the values in the FLAGS object
  const foundId = Object.entries(FLAGS).find(([_, value]) => value === normalizedFlag)?.[0]

  if (foundId) {
    return {
      success: true,
      id: parseInt(foundId),
      message: "Correct! Flag captured."
    }
  }

  return {
    success: false,
    message: "Incorrect flag."
  }
}

export async function getFileContent(fileId: string) {
  if (SECURE_FILES[fileId]) {
    return SECURE_FILES[fileId];
  }
  return "Error: File content not found or corrupted.";
}

export async function checkSqlInjection(input: string) {
  // Simulate a vulnerable SQL query check
  // Classic simple injection: ' OR '1'='1
  const normalizedInput = input.replace(/\s+/g, '').toLowerCase();
  if (normalizedInput.includes("'or'1'='1") || normalizedInput.includes('"or"1"="1')) {
    return {
      success: true,
      message: "SQL Injection Successful! Database dumped...",
      flag: FLAGS[7]
    }
  }
  
  return {
    success: false,
    message: "Invalid credentials."
  }
}

export async function setCtfCookie() {
  const cookieStore = await cookies()
  // Flag 3: Cookie (Base64 encoded)
  // flag{cookie_monster_loves_flags} -> ZmxhZ3tjb29raWVfbW9uc3Rlcl9sb3Zlc19mbGFnc30=
  cookieStore.set('ctf_session_token', 'ZmxhZ3tjb29raWVfbW9uc3Rlcl9sb3Zlc19mbGFnc30=', {
    httpOnly: false, // Allow JS access for easier discovery or just dev tools
    path: '/ctf',
    maxAge: 3600
  })
}

// Mock Leaderboard Data
const MOCK_LEADERBOARD = [
  { name: "Unknown_X", score: 9999, rank: 1, message: "Catch me if you can. " + FLAGS[21] },
  { name: "ZeroCool", score: 8500, rank: 2 },
  { name: "AcidBurn", score: 8200, rank: 3 },
  { name: "CerealKiller", score: 7800, rank: 4 },
  { name: "LordNikon", score: 7500, rank: 5 },
  { name: "PhantomPhreak", score: 7200, rank: 6 },
  { name: "CrashOverride", score: 6900, rank: 7 },
  { name: "Neo", score: 6000, rank: 8 },
  { name: "Trinity", score: 5500, rank: 9 },
  { name: "Morpheus", score: 5000, rank: 10 },
]

export async function getLeaderboard(userSolvedCount: number) {
  // Calculate user score (100 pts per flag)
  const userScore = userSolvedCount * 100
  
  // Insert user into leaderboard
  const newLeaderboard = [...MOCK_LEADERBOARD, { name: "YOU", score: userScore, rank: 0, isUser: true }]
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
    
  return newLeaderboard
}
