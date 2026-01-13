"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Star, Trash2, BookOpen } from "lucide-react"

interface Novel {
  id: string
  title: string
  author: string
  coverUrl: string | null
  category: string
  views: number
  rating: number
}

export default function BookshelfPage() {
  const [novels, setNovels] = React.useState<Novel[]>([])
  const [loading, setLoading] = React.useState(true)
  const [ids, setIds] = React.useState<string[]>([])

  React.useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("bookshelf") || "[]") as string[]
    setIds(storedIds)

    if (storedIds.length > 0) {
      fetch('/api/novels/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: storedIds })
      })
      .then(res => res.json())
      .then(data => {
        setNovels(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const removeFromShelf = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newIds = ids.filter(i => i !== id)
    setIds(newIds)
    setNovels(novels.filter(n => n.id !== id))
    localStorage.setItem("bookshelf", JSON.stringify(newIds))
  }

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">加载书架中...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">我的书架</h1>
          <p className="text-muted-foreground">
            共收藏 {novels.length} 本小说
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/browse">去书库找书</Link>
        </Button>
      </div>

      {novels.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">书架空空如也</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            快去发现一些好书添加到这里吧
          </p>
          <Button asChild>
            <Link href="/">去首页看看</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {novels.map((novel) => (
            <Link key={novel.id} href={`/novel/${novel.id}`} className="group block h-full">
              <Card className="h-full overflow-hidden border-0 bg-transparent shadow-none transition-all hover:scale-[1.02]">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-md transition-shadow group-hover:shadow-xl">
                  <Image
                    src={novel.coverUrl || "/placeholder.png"}
                    alt={novel.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  
                  <button
                    onClick={(e) => removeFromShelf(novel.id, e)}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                    title="移出书架"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                     <span className="flex items-center gap-1">
                       <Eye className="h-3 w-3" />
                       {novel.views > 10000 ? `${(novel.views / 10000).toFixed(1)}万` : novel.views}
                     </span>
                     <span className="flex items-center gap-1">
                       <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                       {novel.rating}
                     </span>
                  </div>
                </div>
                <CardContent className="p-3 pt-4">
                  <h3 className="line-clamp-1 font-bold tracking-tight group-hover:text-primary">
                    {novel.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between gap-2">
                     <p className="line-clamp-1 text-sm text-muted-foreground">
                      {novel.author}
                    </p>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal">
                      {novel.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
