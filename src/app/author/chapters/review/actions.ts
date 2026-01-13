'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function submitForReview(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const novelId = formData.get('novelId') as string
  if (!novelId) return

  // Verify ownership
  const novel = await prisma.novel.findUnique({
    where: { id: novelId },
  })

  if (!novel || novel.uploaderId !== session.user.id) {
    return
  }

  // 1. Update Novel Status
  await prisma.novel.update({
    where: { id: novelId },
    data: { 
        status: 'PENDING',
        lastSubmittedAt: new Date()
    }
  })

  // 2. Update All Draft/Modified Chapters to PENDING
  await prisma.chapter.updateMany({
    where: {
      novelId: novelId,
      OR: [
        { status: 'DRAFT' },
        { status: 'REJECTED' },
        // If we had isModified logic fully implemented, we would use it here.
        // For now, assume DRAFT/REJECTED need review.
      ]
    },
    data: { status: 'PENDING' }
  })

  revalidatePath('/author/chapters/review')
  revalidatePath('/author/drafts')
  revalidatePath('/author/works')
}

export async function withdrawReview(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const id = formData.get('id') as string
  if (!id) return

  const chapter = await prisma.chapter.findUnique({
    where: { id },
    include: { novel: true }
  })

  if (!chapter || chapter.novel.uploaderId !== session.user.id) {
    return
  }

  await prisma.chapter.update({
    where: { id },
    data: { status: 'DRAFT' }
  })

  revalidatePath('/author/chapters/review')
  revalidatePath('/author/drafts')
}
