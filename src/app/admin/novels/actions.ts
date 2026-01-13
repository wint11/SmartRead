'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleNovelStatus(novelId: string, currentStatus: string) {
  const session = await auth()
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session?.user?.role ?? "")) return

  const newStatus = currentStatus === 'PUBLISHED' ? 'TAKEDOWN' : 'PUBLISHED'

  await prisma.novel.update({
    where: { id: novelId },
    data: { status: newStatus }
  })

  revalidatePath('/admin/novels')
}

export async function toggleRecommended(novelId: string, currentRecommended: boolean) {
  const session = await auth()
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session?.user?.role ?? "")) return

  await prisma.novel.update({
    where: { id: novelId },
    data: { isRecommended: !currentRecommended }
  })

  revalidatePath('/admin/novels')
}
