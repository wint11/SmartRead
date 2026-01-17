'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

const chapterSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(10, "内容至少10个字"),
  novelId: z.string().min(1, "作品ID不能为空"),
  status: z.enum(['DRAFT', 'PENDING']),
  isVip: z.boolean().optional(),
})

export type ChapterFormState = {
  error?: string | {
    title?: string[]
    content?: string[]
    novelId?: string[]
    status?: string[]
  } | null
  success?: boolean
}

export async function saveChapter(prevState: ChapterFormState, formData: FormData): Promise<ChapterFormState> {
  const session = await auth()
  if (!session?.user?.id) return { error: "未登录" }

  const rawData = {
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    content: formData.get('content'),
    novelId: formData.get('novelId'),
    status: formData.get('action') === 'publish' ? 'PENDING' : 'DRAFT',
    isVip: formData.get('isVip') === 'on',
  }

  const validated = chapterSchema.safeParse(rawData)
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { id, title, content, novelId, status, isVip } = validated.data

  // Verify ownership
  const novel = await prisma.novel.findFirst({
    where: { id: novelId, uploaderId: session.user.id }
  })

  if (!novel) return { error: "无权操作此作品" }

  try {
    if (id) {
      // Update existing chapter (Draft or otherwise)
      // Ensure the chapter belongs to the novel (which we verified ownership of)
      const existing = await prisma.chapter.findUnique({ where: { id } })
      if (!existing || existing.novelId !== novelId) {
        return { error: "章节不存在或不属于该作品" }
      }

      await prisma.chapter.update({
        where: { id },
        data: {
          title,
          content,
          status,
          isVip,
        }
      })
    } else {
      // Create new
      const lastChapter = await prisma.chapter.findFirst({
        where: { novelId },
        orderBy: { order: 'desc' }
      })
      const order = (lastChapter?.order ?? 0) + 1

      await prisma.chapter.create({
        data: {
          title,
          content,
          order,
          novelId,
          status,
          isVip,
        }
      })
    }
    
    revalidatePath('/author/chapters/publish')
    revalidatePath('/author/drafts')
    revalidatePath('/author/chapters/edit')
    revalidatePath('/author/chapters/review')
    
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "保存失败" }
  }
}
