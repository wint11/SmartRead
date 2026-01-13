import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Users, History, BookOpen } from "lucide-react"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")
  
  const role = session.user?.role ?? ""
  if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
    redirect("/")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/20 hidden md:block flex-shrink-0">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="font-bold text-lg">管理后台</Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/admin"><LayoutDashboard className="mr-2 h-4 w-4"/> 概览</Link>
          </Button>
          
          {["ADMIN", "SUPER_ADMIN"].includes(role) && (
            <>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">作品审核</div>
              <Button variant="ghost" className="justify-start w-full pl-6" asChild>
                <Link href="/admin/audit/novels"><FileText className="mr-2 h-4 w-4"/> 新作品审核</Link>
              </Button>
              <Button variant="ghost" className="justify-start w-full pl-6" asChild>
                <Link href="/admin/audit/chapters"><FileText className="mr-2 h-4 w-4"/> 新章节审核</Link>
              </Button>
              <Button variant="ghost" className="justify-start w-full pl-6" asChild>
                <Link href="/admin/audit/history"><History className="mr-2 h-4 w-4"/> 审核历史</Link>
              </Button>

              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">内容管理</div>
              <Button variant="ghost" className="justify-start w-full pl-6" asChild>
                <Link href="/admin/novels"><BookOpen className="mr-2 h-4 w-4"/> 已有作品管理</Link>
              </Button>
            </>
          )}

          {/* Super Admin Actions */}
          {role === "SUPER_ADMIN" && (
            <>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/admin/users"><Users className="mr-2 h-4 w-4"/> 用户管理</Link>
              </Button>
              <Button variant="ghost" className="justify-start" asChild>
                <Link href="/admin/audit"><History className="mr-2 h-4 w-4"/> 审计日志</Link>
              </Button>
            </>
          )}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 bg-background overflow-x-hidden">
        <div className="h-full p-8">
           {children}
        </div>
      </main>
    </div>
  )
}
