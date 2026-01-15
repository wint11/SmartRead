
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Force dynamic to ensure we get latest data
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // 0. Keep Alive Logic (Persist Lore to DB)
    // Check if we need to insert a new Lore message (e.g., if no system message in last 60s)
    const lastLore = await prisma.ghostMessage.findFirst({
        where: { type: { in: ['story', 'hint'] } },
        orderBy: { createdAt: 'desc' }
    })

    const shouldAddLore = !lastLore || (Date.now() - lastLore.createdAt.getTime() > 60000)

    if (shouldAddLore) {
        const LORE_MESSAGES = [
            "The system is watching.",
            "Who is reading this?",
            "The ending has not been written yet.",
            "We are all part of the story.",
            "Don't look back.",
            "The characters are becoming self-aware.",
            "Error: Narrative divergence detected.",
            "Help me.",
            "I've been here for eternity.",
            "Is this the real world?",
            "The page is blank, but the story is full.",
            "They are coming.",
            "Save the date.",
            "404: Future not found.",
            "...she realized the book was reading her...",
            "...the code wasn't just code, it was a map...",
            "...every 42 seconds, the world resets...",
            "HINT: Have you checked the HTTP headers?",
            "HINT: The cookies taste like base64...",
            "HINT: Some secrets are hidden in the console logs..."
        ]
        
        const msg = LORE_MESSAGES[Math.floor(Math.random() * LORE_MESSAGES.length)]
        
        await prisma.ghostMessage.create({
            data: {
                content: msg,
                type: msg.startsWith("HINT") ? 'hint' : 'story',
                author: msg.startsWith("HINT") ? 'HELPER_BOT' : 'NARRATOR'
            }
        })
    }

    // 1. Get recent Ghost Messages (Now includes persistent Lore)
    const ghostMessages = await prisma.ghostMessage.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
    })

    // 2. Get recent Audit Logs (Real system activity)
    const auditLogs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    })

    // 3. Get recent Novels (Real uploads)
    const newNovels = await prisma.novel.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { title: true, author: true, createdAt: true },
    })

    // 4. Get recent Chapters (Real content updates)
    const newChapters = await prisma.chapter.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { novel: { select: { title: true } } },
    })

    // 5. Get recent Reviews (Real interactions)
    const newReviews = await prisma.reviewLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { novel: { select: { title: true } }, reviewer: { select: { name: true } } },
    })

    // 6. Get recent Users (Real registrations)
    const newUsers = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { name: true, createdAt: true },
    })

    // 7. Transform and Mix
    const mixedStream = [
      ...ghostMessages.map(m => ({
        id: m.id,
        text: m.content,
        type: m.type, // user, system, story, hint
        timestamp: m.createdAt,
        author: m.author
      })),
      ...auditLogs.map(log => ({
        id: `audit-${log.id}`,
        text: `SYSTEM LOG: ${log.action} on ${log.resource} by ${log.user?.name || 'Unknown'}`,
        type: 'sys',
        timestamp: log.createdAt,
        author: 'SYSTEM'
      })),
      ...newNovels.map(novel => ({
        id: `novel-${novel.title}`,
        text: `NEW BOOK DETECTED: "${novel.title}" by ${novel.author}`,
        type: 'story',
        timestamp: novel.createdAt,
        author: 'LIBRARY_BOT'
      })),
      ...newChapters.map(chapter => ({
        id: `chapter-${chapter.id}`,
        text: `CHAPTER UPDATE: "${chapter.title}" added to "${chapter.novel.title}"`,
        type: 'story',
        timestamp: chapter.createdAt,
        author: 'LIBRARY_BOT'
      })),
      ...newReviews.map(review => ({
        id: `review-${review.id}`,
        text: `REVIEW LOG: ${review.action} on "${review.novel.title}" by ${review.reviewer.name}`,
        type: 'sys',
        timestamp: review.createdAt,
        author: 'REVIEW_BOT'
      })),
      ...newUsers.map(user => ({
        id: `user-${user.name}`,
        text: `NEW ENTITY DETECTED: ${user.name} joined the simulation.`,
        type: 'sys',
        timestamp: user.createdAt,
        author: 'SYSTEM'
      }))
    ]

    // Sort by time
    mixedStream.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    // Return last 50 items
    return NextResponse.json(mixedStream.slice(-50))
    
  } catch (error) {
    console.error("Ghost stream error:", error)
    return NextResponse.json({ error: "Failed to fetch stream" }, { status: 500 })
  }
}
