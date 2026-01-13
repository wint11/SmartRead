import Link from "next/link"
import { BookOpen, User, PenTool, LayoutDashboard, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Suspense } from "react"
import { SearchBar } from "@/components/search-bar"
import { auth, signOut } from "@/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MainNav } from "@/components/main-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export async function Navbar() {
  const session = await auth()
  const userRole = session?.user?.role ?? ""

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="hidden text-lg font-bold sm:inline-block">
            智汇阅读
          </span>
        </Link>
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:block">
            <Suspense fallback={<div className="w-[200px] h-9 bg-muted animate-pulse rounded-md" />}>
              <SearchBar />
            </Suspense>
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>{session.user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                       <User className="mr-2 h-4 w-4" /> 个人中心
                    </Link>
                  </DropdownMenuItem>
                  {['AUTHOR'].includes(userRole) && (
                     <DropdownMenuItem asChild>
                       <Link href="/author" className="cursor-pointer">
                         <PenTool className="mr-2 h-4 w-4" /> 创作者中心
                       </Link>
                     </DropdownMenuItem>
                  )}
                  {['ADMIN', 'SUPER_ADMIN'].includes(userRole) && (
                     <DropdownMenuItem asChild>
                       <Link href="/admin" className="cursor-pointer">
                         <LayoutDashboard className="mr-2 h-4 w-4" /> 管理后台
                       </Link>
                     </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <form action={async () => {
                       "use server"
                       await signOut({ redirectTo: "/" })
                     }} className="w-full">
                       <button className="flex w-full items-center text-red-500">
                         <LogOut className="mr-2 h-4 w-4" /> 退出登录
                       </button>
                     </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link href="/login">登录</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
