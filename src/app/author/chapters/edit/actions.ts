'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteChapter(chapterId: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "未登录" }

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { novel: true }
  })

  if (!chapter) return { error: "章节不存在" }
  if (chapter.novel.uploaderId !== session.user.id) return { error: "无权操作" }

  try {
    await prisma.chapter.delete({
      where: { id: chapterId }
    })
  } catch (error) {
    console.error("Delete chapter error:", error)
    return { error: "删除失败" }
  }

  revalidatePath('/author/chapters/edit')
  revalidatePath('/author/chapters/review')
  revalidatePath('/author/drafts')
  
  return { success: true }
}
