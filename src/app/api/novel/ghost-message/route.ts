
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    const { content, type = "user" } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const newMessage = await prisma.ghostMessage.create({
      data: {
        content,
        type,
        author: session?.user?.name || "ANONYMOUS",
      },
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error("Ghost message error:", error)
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 })
  }
}
