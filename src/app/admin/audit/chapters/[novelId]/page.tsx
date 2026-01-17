import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { approveChapters, rejectChapters } from "../actions"

export default async function ChapterAuditDetailPage({ params }: { params: Promise<{ novelId: string }> }) {
  const session = await auth()
  const role = session?.user?.role ?? ""
  if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) redirect("/")

  const { novelId } = await params
  const novel = await prisma.novel.findUnique({
    where: { id: novelId },
    include: { 
        chapters: {
            where: { status: 'PENDING' },
            orderBy: { order: 'asc' }
        },
        uploader: true
    }
  })

  if (!novel) return <div>未找到该作品</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">审核新章节</h1>
      </div>

      {/* Novel Basic Info */}
      <Card>
        <CardHeader>
            <CardTitle>作品信息: {novel.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div>作者: {novel.author}</div>
                <div>上传者: {novel.uploader?.name}</div>
                <div>待审核章节: {novel.chapters.length} 章</div>
            </div>
        </CardContent>
      </Card>

      {/* Chapters List */}
      <Card>
        <CardHeader>
            <CardTitle>章节内容 ({novel.chapters.length})</CardTitle>
        </CardHeader>
        <CardContent>
            {novel.chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">没有待审核的章节</div>
            ) : (
                <Accordion type="single" collapsible className="w-full">
                    {novel.chapters.map((chapter) => (
                        <AccordionItem key={chapter.id} value={chapter.id}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-4">
                                    <span>{chapter.title}</span>
                                    <Badge variant="outline">第 {chapter.order} 章</Badge>
                                    {(chapter as any).isVip && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200">VIP</Badge>}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="p-4 bg-muted/30 rounded-md whitespace-pre-wrap font-serif leading-relaxed">
                                    {chapter.content}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </CardContent>
      </Card>

      {/* Action Form */}
      {novel.chapters.length > 0 && (
          <Card>
            <CardHeader>
                <CardTitle>审核操作</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <input type="hidden" name="novelId" value={novel.id} />
                    <div className="space-y-2">
                        <Label htmlFor="feedback">反馈/修改意见（作者可见）</Label>
                        <Textarea 
                            id="feedback" 
                            name="feedback" 
                            placeholder="请输入审核意见，如拒绝请务必说明原因..." 
                            required 
                        />
                    </div>
                    <div className="flex gap-4 pt-2">
                        <Button formAction={approveChapters} className="flex-1 bg-green-600 hover:bg-green-700">
                            全部通过
                        </Button>
                        <Button formAction={rejectChapters} variant="destructive" className="flex-1">
                            全部拒绝
                        </Button>
                    </div>
                </form>
            </CardContent>
          </Card>
      )}
    </div>
  )
}
