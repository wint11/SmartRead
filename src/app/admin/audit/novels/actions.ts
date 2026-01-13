'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function approveNovel(formData: FormData) {
  const session = await auth()
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session?.user?.role ?? "")) return

  const novelId = formData.get('novelId') as string
  const feedback = formData.get('feedback') as string

  if (!novelId) return

  await prisma.$transaction(async (tx) => {
    // 1. Update Novel Status
    await tx.novel.update({
      where: { id: novelId },
      data: { 
        status: 'PUBLISHED',
        lastApprovedAt: new Date()
      }
    })

    // 2. Log Review
    await tx.reviewLog.create({
      data: {
        novelId,
        reviewerId: session!.user!.id!,
        action: 'APPROVE',
        feedback
      }
    })
  })

  revalidatePath('/admin/audit/novels')
  revalidatePath(`/admin/audit/novels/${novelId}`)
  redirect('/admin/audit/novels')
}

export async function rejectNovel(formData: FormData) {
  const session = await auth()
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session?.user?.role ?? "")) return

  const novelId = formData.get('novelId') as string
  const feedback = formData.get('feedback') as string

  if (!novelId) return

  await prisma.$transaction(async (tx) => {
    // 1. Update Novel Status
    await tx.novel.update({
      where: { id: novelId },
      data: { status: 'REJECTED' }
    })

    // 2. Log Review
    await tx.reviewLog.create({
      data: {
        novelId,
        reviewerId: session!.user!.id!,
        action: 'REJECT',
        feedback
      }
    })
  })

  revalidatePath('/admin/audit/novels')
  revalidatePath(`/admin/audit/novels/${novelId}`)
  redirect('/admin/audit/novels')
}
