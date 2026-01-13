import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  PenTool, 
  LayoutDashboard, 
  PlusCircle, 
  BookOpen, 
  FileEdit, 
  CheckSquare, 
  FileText 
} from "lucide-react"

export default async function AuthorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")
  
  const role = session.user?.role ?? ""
  if (!['AUTHOR', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
    redirect("/")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/20 hidden md:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/author" className="font-bold text-lg">创作者中心</Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/author"><LayoutDashboard className="mr-2 h-4 w-4"/> 概览</Link>
          </Button>
          
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground mt-4">
            作品管理
          </div>
          
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/author/works/create"><PlusCircle className="mr-2 h-4 w-4"/> 创建新作品</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/author/chapters/publish"><BookOpen className="mr-2 h-4 w-4"/> 发布新章节</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/author/chapters/edit"><FileEdit className="mr-2 h-4 w-4"/> 编辑已有章节</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/author/chapters/review"><CheckSquare className="mr-2 h-4 w-4"/> 提交审核</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/author/drafts"><FileText className="mr-2 h-4 w-4"/> 草稿箱</Link>
          </Button>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="h-full p-8">
           {children}
        </div>
      </main>
    </div>
  )
}
