'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link
        href="/"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/" ? "text-foreground font-bold" : "text-foreground/60"
        )}
      >
        首页
      </Link>
      <Link
        href="/browse"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/browse" ? "text-foreground font-bold" : "text-foreground/60"
        )}
      >
        文库
      </Link>
      <Link
        href="/bookshelf"
        className={cn(
          "transition-colors hover:text-foreground/80",
          pathname === "/bookshelf" ? "text-foreground font-bold" : "text-foreground/60"
        )}
      >
        书架
      </Link>
    </nav>
  )
}
