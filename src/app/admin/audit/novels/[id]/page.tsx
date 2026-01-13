import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { approveNovel, rejectNovel } from "../actions"

export default async function NovelAuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const role = session?.user?.role ?? ""
  if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) redirect("/")

  const { id } = await params
  const novel = await prisma.novel.findUnique({
    where: { id },
    include: { uploader: true }
  })

  if (!novel) return <div>未找到该作品</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">审核作品信息</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cover Image */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>封面</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md border">
                 <Image
                   src={novel.coverUrl || "/placeholder.png"}
                   alt={novel.title}
                   fill
                   className="object-cover"
                 />
               </div>
               {novel.pendingCoverUrl && (
                 <div className="mt-4">
                    <p className="text-sm font-medium text-red-500 mb-2">申请修改为：</p>
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md border">
                        <Image
                        src={novel.pendingCoverUrl}
                        alt="New Cover"
                        fill
                        className="object-cover"
                        />
                    </div>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Info & Actions */}
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>标题</Label>
                            <div className="p-2 border rounded-md bg-muted/20">{novel.title}</div>
                        </div>
                        <div>
                            <Label>作者</Label>
                            <div className="p-2 border rounded-md bg-muted/20">{novel.author}</div>
                        </div>
                        <div>
                            <Label>分类</Label>
                            <div className="p-2 border rounded-md bg-muted/20">{novel.category}</div>
                        </div>
                        <div>
                            <Label>提交时间</Label>
                            <div className="p-2 border rounded-md bg-muted/20">
                                {novel.lastSubmittedAt ? new Date(novel.lastSubmittedAt).toLocaleString() : '-'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label>简介</Label>
                        <div className="p-2 border rounded-md bg-muted/20 min-h-[100px] whitespace-pre-wrap">
                            {novel.description}
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                            <Button formAction={approveNovel} className="flex-1 bg-green-600 hover:bg-green-700">
                                通过
                            </Button>
                            <Button formAction={rejectNovel} variant="destructive" className="flex-1">
                                拒绝
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
