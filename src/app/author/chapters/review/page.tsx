import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { submitForReview, withdrawReview } from "./actions"

export default async function ReviewStatusPage() {
  const session = await auth()
  const uploaderId = session?.user?.id
  if (!uploaderId) redirect("/login")

  const works = await prisma.novel.findMany({
    where: { uploaderId },
    include: {
      reviewLogs: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      chapters: {
        where: {
          OR: [
            { status: { in: ['DRAFT', 'PENDING'] } },
            { isModified: true }
          ]
        },
        select: { id: true, title: true, status: true, isModified: true }
      }
    }
  })

  // Filter works that have pending changes or are in PENDING status
  // Also show works that were REJECTED recently so author can see feedback
  const worksWithChanges = works.filter(work => 
    work.status === 'PENDING' || 
    work.status === 'REJECTED' ||
    work.chapters.length > 0 ||
    work.pendingCoverUrl || 
    work.changeLog 
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">作品审核</h1>
      <p className="text-muted-foreground">
        只要作品有任何修改（包括章节增删改、封面修改等），都需要在此提交完整审核。
      </p>

      {worksWithChanges.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            暂无需要提交审核的作品
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {worksWithChanges.map(work => (
            <WorkReviewCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  )
}

function WorkReviewCard({ work }: { work: any }) {
  const pendingChapters = work.chapters.filter((c: any) => c.status === 'PENDING')
  const draftChapters = work.chapters.filter((c: any) => c.status === 'DRAFT')
  const latestReview = work.reviewLogs?.[0]
  
  return (
    <Card className={work.status === 'REJECTED' ? 'border-red-500' : ''}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
             {work.title}
             {work.status === 'REJECTED' && <Badge variant="destructive">审核未通过</Badge>}
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant={work.status === 'PENDING' ? 'secondary' : 'outline'}>
              {work.status === 'PENDING' ? '审核中' : '待提交'}
            </Badge>
          </div>
        </div>
        <form action={submitForReview}>
            <input type="hidden" name="novelId" value={work.id} />
            <Button disabled={work.status === 'PENDING'}>
                {work.status === 'PENDING' ? '等待审核' : work.status === 'REJECTED' ? '重新提交' : '提交审核'}
            </Button>
        </form>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {/* Feedback Display */}
            {latestReview && (work.status === 'REJECTED' || latestReview.action === 'REJECT') && (
                <div className="bg-red-50 p-4 rounded-md text-sm text-red-800 border border-red-200">
                    <p className="font-bold mb-1">审核反馈 ({new Date(latestReview.createdAt).toLocaleString()}):</p>
                    <p>{latestReview.feedback}</p>
                </div>
            )}

            {/* Summary of changes */}
            <div className="text-sm space-y-2">
                <p className="font-medium">修改内容概览：</p>
                <ul className="list-disc list-inside text-muted-foreground">
                    {draftChapters.length > 0 && (
                        <li>{draftChapters.length} 个章节待发布/修改</li>
                    )}
                    {work.pendingCoverUrl && (
                        <li>封面已修改</li>
                    )}
                    {/* Add more checks here */}
                </ul>
            </div>

            {(pendingChapters.length > 0 || draftChapters.length > 0) && (
                <div className="border rounded-md p-4">
                    <h4 className="text-sm font-medium mb-2">章节详情</h4>
                    <div className="space-y-1">
                        {work.chapters.map((c: any) => (
                            <div key={c.id} className="flex justify-between text-sm">
                                <span>{c.title}</span>
                                <Badge variant="outline" className="text-xs">
                                    {c.status === 'PENDING' ? '审核中' : '待提交'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  )
}
