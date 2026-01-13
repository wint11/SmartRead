import { prisma } from "@/lib/prisma"
import { NovelCard } from "@/components/novel-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Flame, Sparkles } from "lucide-react"
import { Novel } from "@prisma/client"

export default async function Home() {
  const [featuredNovel, popularNovels, newNovels] = await Promise.all([
    prisma.novel.findFirst({
      orderBy: { views: 'desc' },
      include: { chapters: { take: 1, orderBy: { order: 'asc' } } }
    }),
    prisma.novel.findMany({
      orderBy: { views: 'desc' },
      take: 6,
    }),
    prisma.novel.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 6,
    })
  ])

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Hero Section */}
      {featuredNovel && (
        <section className="relative w-full overflow-hidden bg-muted/40 py-12 md:py-20 lg:py-24">
          <div className="absolute inset-0 z-0">
             <Image
              src={featuredNovel.coverUrl || "/placeholder.png"}
              alt="Background"
              fill
              className="object-cover opacity-10 blur-3xl"
              priority
            />
          </div>
          <div className="container mx-auto relative z-10 grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-flex w-fit items-center rounded-full border bg-background px-3 py-1 text-sm font-medium text-primary shadow-sm">
                <Flame className="mr-2 h-4 w-4 fill-orange-500 text-orange-500" />
                本周精选
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  {featuredNovel.title}
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl line-clamp-3">
                  {featuredNovel.description}
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Button size="lg" className="h-12 px-8 text-base" asChild>
                  <Link href={`/novel/${featuredNovel.id}`}>
                    <BookOpen className="mr-2 h-5 w-5" />
                    立即阅读
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                  <Link href={`/novel/${featuredNovel.id}`}>
                    查看详情
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
               <div className="relative aspect-[2/3] w-[260px] rotate-3 rounded-lg shadow-2xl transition-transform hover:rotate-0 md:w-[320px]">
                <Image
                  src={featuredNovel.coverUrl || "/placeholder.png"}
                  alt={featuredNovel.title}
                  fill
                  className="rounded-lg object-cover shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto space-y-12">
        {/* Popular Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold tracking-tight">热门推荐</h2>
            </div>
            <Link href="/browse?sort=popular" className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
              查看全部
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {popularNovels.map((novel: Novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-bold tracking-tight">最新收录</h2>
            </div>
             <Link href="/browse?sort=newest" className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
              查看全部
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {newNovels.map((novel: Novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
