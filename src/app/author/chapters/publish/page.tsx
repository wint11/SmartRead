import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { PublishForm } from "./publish-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkSelector } from "../work-selector"

export default async function PublishChapterPage({ searchParams }: { searchParams: Promise<{ novelId?: string, draftId?: string }> }) {
  const session = await auth()
  const uploaderId = session?.user?.id
  if (!uploaderId) redirect("/login")

  const { novelId, draftId } = await searchParams

  const works = await prisma.novel.findMany({
    where: { uploaderId },
    select: { id: true, title: true }
  })

  let selectedWork = null
  let existingChapters: any[] = []
  let drafts: any[] = []

  if (novelId) {
    selectedWork = await prisma.novel.findUnique({
      where: { id: novelId, uploaderId },
    })

    if (selectedWork) {
      existingChapters = await prisma.chapter.findMany({
        where: { novelId, status: { in: ['PUBLISHED', 'PENDING'] } },
        orderBy: { order: 'asc' },
        select: { id: true, title: true, order: true, status: true }
      })

      drafts = await prisma.chapter.findMany({
        where: { novelId, status: 'DRAFT' },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, title: true, content: true, updatedAt: true }
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">发布新章节</h1>
        <WorkSelector works={works} selectedId={novelId} />
      </div>

      {novelId && !selectedWork && (
        <div className="text-red-500">找不到该作品或无权访问</div>
      )}

      {selectedWork && novelId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>已发布章节 ({existingChapters.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-[500px] overflow-y-auto space-y-2">
                  {existingChapters.length === 0 ? (
                    <p className="text-muted-foreground text-sm">暂无已发布章节</p>
                  ) : (
                    existingChapters.map(chapter => (
                      <div key={chapter.id} className="p-2 border rounded text-sm flex justify-between">
                        <span>{chapter.title}</span>
                        <span className="text-xs text-muted-foreground">{chapter.status === 'PENDING' ? '审核中' : '已发布'}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <PublishForm novelId={novelId} drafts={drafts} initialDraftId={draftId} />
          </div>
        </div>
      )}

      {!novelId && (
        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
          请先选择一个作品以发布章节
        </div>
      )}
    </div>
  )
}
