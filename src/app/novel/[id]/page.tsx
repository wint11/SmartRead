import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Calendar, Eye, Star, Heart } from "lucide-react"
import { Chapter } from "@prisma/client"

interface NovelDetailPageProps {
  params: Promise<{
    id: string
  }>
}

import { AddToBookshelf } from "@/components/add-to-bookshelf"

export default async function NovelDetailPage({ params }: NovelDetailPageProps) {
  const { id } = await params
  const novel = await prisma.novel.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!novel) {
    notFound()
  }

  const firstChapter = novel.chapters[0]

  return (
    <div className="min-h-screen">
      {/* Background Header */}
      <div className="relative h-[300px] w-full overflow-hidden bg-muted/30">
        <div className="absolute inset-0">
          <Image
            src={novel.coverUrl || "/placeholder.png"}
            alt={novel.title}
            fill
            className="object-cover opacity-20 blur-3xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>

      <div className="container mx-auto relative -mt-32 pb-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* Left Column: Cover & Actions */}
          <div className="space-y-6">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-border/20">
              <Image
                src={novel.coverUrl || "/placeholder.png"}
                alt={novel.title}
                fill
                className="object-cover transition-transform hover:scale-105 duration-500"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>
            <div className="flex flex-col gap-3">
              {firstChapter && (
                <Button asChild className="w-full text-lg h-12 shadow-lg" size="lg">
                  <Link href={`/novel/${novel.id}/chapter/${firstChapter.id}`}>
                    <BookOpen className="mr-2 h-5 w-5" />
                    开始阅读
                  </Link>
                </Button>
              )}
              <AddToBookshelf novel={{ id: novel.id, title: novel.title, author: novel.author, coverUrl: novel.coverUrl }} />
            </div>
          </div>

          {/* Right Column: Info & Chapters */}
          <div className="flex flex-col gap-8 pt-8 lg:pt-32">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default" className="text-sm shadow-sm">
                  {novel.category}
                </Badge>
                <Badge variant={novel.status === "COMPLETED" ? "secondary" : "outline"} className="text-sm backdrop-blur-sm">
                  {novel.status === "COMPLETED" ? "已完结" : "连载中"}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl drop-shadow-sm">
                {novel.title}
              </h1>
              
              <p className="text-xl font-medium text-muted-foreground">
                {novel.author}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                  <Eye className="h-4 w-4" />
                  <span>{novel.views > 10000 ? `${(novel.views / 10000).toFixed(1)}万` : novel.views} 阅读</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{novel.rating} 评分</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1">
                  <Calendar className="h-4 w-4" />
                  <span>更新于 {novel.updatedAt.toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Synopsis */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold">简介</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {novel.description}
              </p>
            </div>

            <Separator />

            {/* Chapters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">章节目录 ({novel.chapters.length})</h3>
              </div>
              <ScrollArea className="h-[500px] rounded-lg border bg-muted/30 p-4">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {novel.chapters.map((chapter: Chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/novel/${novel.id}/chapter/${chapter.id}`}
                      className="flex items-center justify-between rounded-md border bg-background p-3 text-sm transition-all hover:border-primary hover:shadow-sm"
                    >
                      <span className="truncate font-medium">
                        {chapter.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
