import { prisma } from "@/lib/prisma"
import { NovelCard } from "@/components/novel-card"
import { Metadata } from "next"
import { Novel } from "@prisma/client"

export const metadata: Metadata = {
  title: "搜索结果 - 现代小说",
}

interface SearchPageProps {
  searchParams: Promise<{ q: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  
  if (!q) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">请输入搜索关键词</h1>
      </div>
    )
  }

  const novels = await prisma.novel.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { author: { contains: q } },
        { description: { contains: q } },
      ],
    },
    orderBy: { views: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">搜索结果</h1>
        <p className="text-muted-foreground">
          关键词 &quot;{q}&quot; 共找到 {novels.length} 本相关小说
        </p>
      </div>

      {novels.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <p className="text-lg font-medium text-muted-foreground">
            没有找到相关小说，换个关键词试试？
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {novels.map((novel: Novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      )}
    </div>
  )
}
