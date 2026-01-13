import { prisma } from "@/lib/prisma"
import { NovelCard } from "@/components/novel-card"
import { Metadata } from "next"
import { Novel, Prisma } from "@prisma/client"
import { Search, BookX, Filter, SortAsc } from "lucide-react"

export const metadata: Metadata = {
  title: "浏览书库 - 现代小说",
}

interface BrowsePageProps {
  searchParams: Promise<{
    sort?: string
    category?: string
  }>
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { sort, category } = await searchParams
  
  const orderBy: Prisma.NovelOrderByWithRelationInput = sort === 'popular' 
    ? { views: 'desc' } 
    : sort === 'newest' 
    ? { updatedAt: 'desc' } 
    : { updatedAt: 'desc' }

  const where: Prisma.NovelWhereInput = {
    status: 'PUBLISHED',
    ...(category ? { category } : {})
  }

  const novels = await prisma.novel.findMany({
    where,
    orderBy,
    take: 50,
  })

  // Get all categories
  const categories = await prisma.novel.groupBy({
    by: ['category'],
  })

  return (
    <div className="container mx-auto py-8 md:py-12">
      <div className="mb-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">书库浏览</h1>
          <p className="text-muted-foreground">共找到 {novels.length} 本小说</p>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>分类筛选</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <a 
                href="/browse" 
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${!category ? 'bg-primary text-primary-foreground font-medium' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}
              >
                全部
              </a>
              {categories.map((c: { category: string }) => (
                <a 
                  key={c.category}
                  href={`/browse?category=${c.category}`}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${category === c.category ? 'bg-primary text-primary-foreground font-medium' : 'bg-muted hover:bg-muted/80 text-muted-foreground'}`}
                >
                  {c.category}
                </a>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Sort Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SortAsc className="h-4 w-4" />
              <span>排序方式</span>
            </div>
            <div className="flex flex-wrap gap-2">
               <a 
                 href={`/browse?${new URLSearchParams({ ...(category ? { category } : {}), sort: 'newest' })}`} 
                 className={`px-4 py-1.5 rounded-full text-sm transition-colors ${sort !== 'popular' ? 'bg-primary/10 text-primary font-medium ring-1 ring-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
               >
                 最新更新
               </a>
               <a 
                 href={`/browse?${new URLSearchParams({ ...(category ? { category } : {}), sort: 'popular' })}`} 
                 className={`px-4 py-1.5 rounded-full text-sm transition-colors ${sort === 'popular' ? 'bg-primary/10 text-primary font-medium ring-1 ring-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
               >
                 最热排行
               </a>
            </div>
          </div>
        </div>
      </div>

      {novels.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {novels.map((novel: Novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <div className="bg-muted/50 p-6 rounded-full mb-4">
            <BookX className="h-12 w-12 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">暂无相关小说</h3>
          <p className="mt-2 text-sm max-w-sm mx-auto">
            抱歉，没有找到符合条件的小说。请尝试切换分类或查看全部小说。
          </p>
          <a href="/browse" className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            查看全部
          </a>
        </div>
      )}
    </div>
  )
}
