'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { logAudit } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const coverSchema = z.object({
    coverUrl: z.string().url("无效的图片链接")
})

export async function deleteNovel(novelId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const novel = await prisma.novel.findUnique({ where: { id: novelId } })
    if (!novel || novel.uploaderId !== session.user.id) {
        throw new Error("Forbidden")
    }

    await prisma.novel.delete({
        where: { id: novelId }
    })

    await logAudit(
        "DELETE_NOVEL", 
        `Novel:${novelId}`, 
        `User ${session.user.name} deleted ${novel.title}`,
        session.user.id
    )

    revalidatePath('/author/works')
}

export async function toggleNovelCompletion(novelId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const novel = await prisma.novel.findUnique({ where: { id: novelId } })
    if (!novel || novel.uploaderId !== session.user.id) {
        throw new Error("Forbidden")
    }

    // Only allow setting to COMPLETED. Reverting is not allowed per requirements.
    if (novel.serializationStatus === 'COMPLETED') {
        throw new Error("Already completed")
    }

    await prisma.novel.update({
        where: { id: novelId },
        data: { serializationStatus: 'COMPLETED' }
    })

    await logAudit(
        "COMPLETE_NOVEL", 
        `Novel:${novelId}`, 
        `User ${session.user.name} marked ${novel.title} as COMPLETED`,
        session.user.id
    )

    revalidatePath('/author/works')
}

export async function requestCoverUpdate(novelId: string, coverUrl: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const novel = await prisma.novel.findUnique({ where: { id: novelId } })
    if (!novel || novel.uploaderId !== session.user.id) {
        throw new Error("Forbidden")
    }

    const validation = coverSchema.safeParse({ coverUrl })
    if (!validation.success) {
        throw new Error(validation.error.issues[0]?.message ?? "无效的图片链接")
    }

    await prisma.novel.update({
        where: { id: novelId },
        data: { pendingCoverUrl: coverUrl }
    })

    await logAudit(
        "REQUEST_COVER_UPDATE", 
        `Novel:${novelId}`, 
        `User ${session.user.name} requested cover update`,
        session.user.id
    )

    revalidatePath('/author/works')
}
