import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toggleNovelStatus, toggleRecommended } from "./actions"
import { Star, StarOff, AlertTriangle, CheckCircle } from "lucide-react"

export default async function PublishedNovelsPage() {
  const session = await auth()
  const role = session?.user?.role ?? ""

  if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
    redirect("/")
  }

  const novels = await prisma.novel.findMany({
    where: { 
      status: { in: ['PUBLISHED', 'TAKEDOWN'] }
    },
    orderBy: { updatedAt: 'desc' },
    include: { uploader: true }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">已有作品管理</h1>
        <p className="text-muted-foreground">管理已发布的作品，支持下架和设为推荐</p>
      </div>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>作者</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>首页推荐</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {novels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  暂无已发布作品
                </TableCell>
              </TableRow>
            ) : (
              novels.map((novel) => (
                <TableRow key={novel.id}>
                  <TableCell className="font-medium">{novel.title}</TableCell>
                  <TableCell>{novel.author}</TableCell>
                  <TableCell>
                    <Badge variant={novel.status === 'PUBLISHED' ? 'default' : 'destructive'}>
                      {novel.status === 'PUBLISHED' ? '已发布' : '已下架'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {novel.isRecommended ? (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" /> 推荐中
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(novel.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <form action={toggleRecommended.bind(null, novel.id, novel.isRecommended)}>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={novel.isRecommended ? "text-muted-foreground" : "text-yellow-600"}
                        >
                          {novel.isRecommended ? (
                            <><StarOff className="w-4 h-4 mr-1" /> 取消推荐</>
                          ) : (
                            <><Star className="w-4 h-4 mr-1" /> 设为推荐</>
                          )}
                        </Button>
                      </form>

                      <form action={toggleNovelStatus.bind(null, novel.id, novel.status)}>
                        <Button 
                          size="sm" 
                          variant={novel.status === 'PUBLISHED' ? "destructive" : "default"}
                        >
                          {novel.status === 'PUBLISHED' ? (
                            <><AlertTriangle className="w-4 h-4 mr-1" /> 下架</>
                          ) : (
                            <><CheckCircle className="w-4 h-4 mr-1" /> 上架</>
                          )}
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
