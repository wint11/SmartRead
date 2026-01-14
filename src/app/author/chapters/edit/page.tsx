import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { WorkSelector } from "../work-selector"
import { EditChapterClient } from "./edit-client"

export default async function EditChapterPage({ searchParams }: { searchParams: Promise<{ novelId?: string }> }) {
  const session = await auth()
  const uploaderId = session?.user?.id
  if (!uploaderId) redirect("/login")

  const { novelId } = await searchParams

  const works = await prisma.novel.findMany({
    where: { uploaderId },
    select: { id: true, title: true }
  })

  let selectedWork = null
  let chapters: any[] = []

  if (novelId) {
    selectedWork = await prisma.novel.findUnique({
      where: { id: novelId, uploaderId },
    })

    if (selectedWork) {
      // Fetch all chapters (including drafts? User said drafts are in Draft Box. But maybe useful here too?)
      // "Edit Existing Chapter" usually implies non-drafts.
      chapters = await prisma.chapter.findMany({
        where: { novelId, status: { not: 'DRAFT' } }, // Exclude drafts? Or include all?
        // Let's include all except maybe Deleted.
        orderBy: { order: 'asc' }
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">编辑已有章节</h1>
        <WorkSelector works={works} selectedId={novelId} />
      </div>

      {novelId && !selectedWork && (
        <div className="text-red-500">找不到该作品或无权访问</div>
      )}

      {selectedWork && novelId && (
        <EditChapterClient novelId={novelId} chapters={chapters} />
      )}

      {!novelId && (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
          请先选择一个作品以编辑章节
        </div>
      )}
    </div>
  )
}
