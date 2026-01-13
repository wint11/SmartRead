import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { WorkActions } from "./work-actions"

export default async function MyWorksPage() {
  const session = await auth()
  if (!session) redirect("/login")
  if (!session.user?.id) redirect("/login")
  
  const articles = await prisma.novel.findMany({
    where: { uploaderId: session.user.id },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-bold tracking-tight">作品管理</h1>
         <Button asChild>
            <Link href="/author/works/create"><PlusCircle className="mr-2 h-4 w-4"/> 发布新作品</Link>
         </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>阅读量</TableHead>
              <TableHead>评分</TableHead>
              <TableHead>章节管理</TableHead>
              <TableHead>更多操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell><Badge variant="outline">{article.type}</Badge></TableCell>
                <TableCell>
                    <Badge variant={
                        article.status === 'PUBLISHED' ? 'default' : 
                        article.status === 'PENDING_DELETION' ? 'destructive' : 'secondary'
                    }>
                        {article.status === 'PENDING_DELETION' ? '申请删除中' : article.status}
                    </Badge>
                </TableCell>
                <TableCell>{article.views}</TableCell>
                <TableCell>{article.rating}</TableCell>
                <TableCell>
                    {article.serializationStatus !== 'COMPLETED' ? (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/author/chapters/publish?novelId=${article.id}`}>新增章节</Link>
                        </Button>
                    ) : (
                        <span className="text-muted-foreground text-sm">已完结</span>
                    )}
                </TableCell>
                <TableCell>
                    <WorkActions novel={article} />
                </TableCell>
              </TableRow>
            ))}
             {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">您还没有发布任何作品</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
