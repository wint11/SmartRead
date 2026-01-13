'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { logAudit } from '@/lib/audit'

const workSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100, "标题过长"),
  type: z.enum(["NOVEL", "PAPER", "AUTOBIOGRAPHY", "ARTICLE"]),
  category: z.string().min(1, "分类不能为空").max(50),
  description: z.string().min(10, "简介至少10个字").max(500),
  coverUrl: z.string().url("请输入有效的图片URL").optional().or(z.literal("")),
})

export type FormState = {
  error?: string | {
    title?: string[]
    type?: string[]
    category?: string[]
    description?: string[]
    coverUrl?: string[]
  } | null
}

export async function createWork(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "未登录" }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true }
  })

  if (user?.status === 'BANNED') {
    return { error: "账户已被封禁，无法发布作品" }
  }

  const rawData = {
    title: formData.get('title'),
    type: formData.get('type'),
    category: formData.get('category'),
    description: formData.get('description'),
    coverUrl: formData.get('coverUrl'),
  }

  const validatedFields = workSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { title, type, category, description, coverUrl } = validatedFields.data

  try {
    const novel = await prisma.novel.create({
      data: {
        title,
        type,
        category,
        description,
        coverUrl: coverUrl || null,
        author: session.user.name || "Unknown",
        uploaderId: session.user.id,
        status: "PENDING", // Initial status pending review
      }
    })

    await logAudit("CREATE_WORK", `Novel:${novel.id}`, `Created work: ${title} (${type})`, session.user.id)
  } catch (error) {
    console.error("Failed to create work:", error)
    return { error: "数据库错误" }
  }

  redirect('/author/works')
}
