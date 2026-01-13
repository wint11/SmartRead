import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenTool, LayoutDashboard, PlusCircle } from "lucide-react"

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
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/author/works"><PenTool className="mr-2 h-4 w-4"/> 作品管理</Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link href="/author/works/new"><PlusCircle className="mr-2 h-4 w-4"/> 发布作品</Link>
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
