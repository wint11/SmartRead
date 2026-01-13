import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Edit, FileText } from "lucide-react"

export default async function DraftsPage() {
  const session = await auth()
  const uploaderId = session?.user?.id
  if (!uploaderId) redirect("/login")

  const drafts = await prisma.chapter.findMany({
    where: { 
      novel: { uploaderId },
      status: { in: ['DRAFT', 'REJECTED'] }
    },
    orderBy: { updatedAt: 'desc' },
    include: { novel: { select: { id: true, title: true } } }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">草稿箱</h1>
      <p className="text-muted-foreground">
        这里保存了您所有未发布的草稿以及需要修改的章节。
      </p>

      {drafts.length === 0 ? (
        <Card>
          <CardContent className="py-20 flex flex-col items-center justify-center text-muted-foreground space-y-4">
            <FileText className="h-12 w-12 opacity-20" />
            <p>暂无草稿</p>
            <Button asChild variant="outline">
                <Link href="/author/chapters/publish">去写新章节</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>章节标题</TableHead>
                <TableHead>所属作品</TableHead>
                <TableHead>最后修改时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drafts.map((draft) => (
                <TableRow key={draft.id}>
                  <TableCell className="font-medium">{draft.title}</TableCell>
                  <TableCell>{draft.novel.title}</TableCell>
                  <TableCell>{new Date(draft.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={draft.status === 'REJECTED' ? 'destructive' : 'outline'}>
                      {draft.status === 'REJECTED' ? '被退回' : '草稿'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/author/chapters/publish?novelId=${draft.novel.id}&draftId=${draft.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        继续编辑
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
