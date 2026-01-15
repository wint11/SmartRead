"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  const pathname = usePathname()

  // Paths where footer should be hidden
  // - /admin: Admin dashboard
  // - /profile: User center
  // - /novel/[id]: Book detail page (starts with /novel/)
  // - /novel/[id]/chapter/[id]: Reading page (starts with /novel/)
  // - /author: Author dashboard
  // - /login: Login page
  const shouldHide = pathname?.startsWith("/admin") || 
                     pathname?.startsWith("/profile") || 
                     pathname?.startsWith("/novel/") ||
                     pathname?.startsWith("/author") ||
                     pathname?.startsWith("/ctf") ||
                     pathname?.startsWith("/hidden_directory") ||
                     pathname === "/login"

  if (shouldHide) {
    return null
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto py-12 md:py-16 px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-lg font-bold tracking-tight">现代小说平台</h4>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              致力于为读者提供最优质的在线阅读体验，海量热门小说免费畅读。
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">热门分类</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/browse?category=玄幻" className="hover:text-primary transition-colors">玄幻奇幻</Link></li>
              <li><Link href="/browse?category=都市" className="hover:text-primary transition-colors">都市言情</Link></li>
              <li><Link href="/browse?category=仙侠" className="hover:text-primary transition-colors">武侠仙侠</Link></li>
              <li><Link href="/browse?category=科幻" className="hover:text-primary transition-colors">科幻灵异</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">平台服务</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/rank" className="hover:text-primary transition-colors">排行榜</Link></li>
              <li><Link href="/bookshelf" className="hover:text-primary transition-colors">我的书架</Link></li>
              <li><Link href="/author" className="hover:text-primary transition-colors">作者专区</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">帮助中心</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">关于我们</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">平台简介</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">联系方式</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">用户协议</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">隐私政策</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 现代小说平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
