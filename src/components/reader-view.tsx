"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Home, 
  Settings, 
  Minus, 
  Plus,
  Type
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ReaderViewProps {
  chapter: {
    id: string
    title: string
    content: string
    order: number
    novel: {
      id: string
      title: string
    }
  }
  prevChapterId?: string
  nextChapterId?: string
}

const THEMES = [
  { name: "light", label: "白昼", bg: "bg-white", text: "text-zinc-900" },
  { name: "sepia", label: "护眼", bg: "bg-[#f4ecd8]", text: "text-[#5b4636]" },
  { name: "dark", label: "夜间", bg: "bg-zinc-950", text: "text-zinc-300" },
]

export function ReaderView({ chapter, prevChapterId, nextChapterId }: ReaderViewProps) {
  const { resolvedTheme } = useTheme()
  const [fontSize, setFontSize] = React.useState(18)
  const [theme, setTheme] = React.useState("light")
  const [mounted, setMounted] = React.useState(false)

  // Load settings from localStorage
  React.useEffect(() => {
    setMounted(true)
    const savedSize = localStorage.getItem("reader-font-size")
    const savedTheme = localStorage.getItem("reader-theme")
    
    if (savedSize) setFontSize(parseInt(savedSize))
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (resolvedTheme === 'dark') {
      setTheme('dark')
    }
  }, [resolvedTheme])

  // Save settings
  const updateFontSize = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 14), 32)
    setFontSize(size)
    localStorage.setItem("reader-font-size", size.toString())
  }

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("reader-theme", newTheme)
  }

  const currentTheme = THEMES.find(t => t.name === theme) || THEMES[0]

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className={cn("min-h-screen transition-colors duration-300", currentTheme.bg)}>
      {/* Sticky Header */}
      <div className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors duration-300",
        theme === 'dark' ? "border-zinc-800 bg-zinc-950/90" : "border-zinc-200 bg-white/90",
        "backdrop-blur supports-[backdrop-filter]:bg-opacity-60"
      )}>
        <div className="container flex h-14 max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild title="返回目录" className={currentTheme.text}>
              <Link href={`/novel/${chapter.novel.id}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="hidden flex-col sm:flex">
              <span className={cn("text-xs opacity-70", currentTheme.text)}>{chapter.novel.title}</span>
              <span className={cn("text-sm font-medium line-clamp-1", currentTheme.text)}>{chapter.title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="阅读设置" className={currentTheme.text}>
                  <Type className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>字号大小</DropdownMenuLabel>
                <div className="flex items-center justify-between px-2 py-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => updateFontSize(fontSize - 2)}
                    disabled={fontSize <= 14}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">{fontSize}px</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => updateFontSize(fontSize + 2)}
                    disabled={fontSize >= 32}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>背景主题</DropdownMenuLabel>
                <div className="grid grid-cols-3 gap-2 p-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.name}
                      className={cn(
                        "flex h-8 items-center justify-center rounded-md border text-xs font-medium transition-all",
                        t.bg,
                        t.name === 'dark' ? 'text-white border-zinc-700' : 'text-black border-zinc-200',
                        theme === t.name && "ring-2 ring-primary ring-offset-2"
                      )}
                      onClick={() => updateTheme(t.name)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" asChild title="返回首页" className={currentTheme.text}>
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl py-12 px-4 md:px-6">
        <article className="prose prose-lg mx-auto max-w-none">
          <h1 className={cn(
            "mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl",
            currentTheme.text
          )}>
            {chapter.title}
          </h1>
          
          <div 
            className={cn(
              "whitespace-pre-wrap leading-loose tracking-wide font-sans transition-all duration-300",
              currentTheme.text
            )}
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
          >
            {chapter.content}
          </div>
        </article>

        <div className={cn("my-12 h-px w-full", theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200')} />

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            className={cn("flex-1", theme === 'dark' ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : '')}
            disabled={!prevChapterId}
            asChild={!!prevChapterId}
          >
            {prevChapterId ? (
              <Link href={`/novel/${chapter.novel.id}/chapter/${prevChapterId}`}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                上一章
              </Link>
            ) : (
              <span>上一章</span>
            )}
          </Button>

          <Button
            variant="default"
            size="lg"
            className="flex-1"
            disabled={!nextChapterId}
            asChild={!!nextChapterId}
          >
            {nextChapterId ? (
              <Link href={`/novel/${chapter.novel.id}/chapter/${nextChapterId}`}>
                下一章
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <span>下一章</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
