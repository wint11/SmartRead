import { prisma } from "@/lib/prisma"
import { NovelCard } from "@/components/novel-card"
import Link from "next/link"
import { ArrowRight, Flame, Sparkles } from "lucide-react"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { Fragment } from "react"

export default async function Home() {
  const [recommendedNovels, popularNovels, newNovels] = await Promise.all([
    prisma.novel.findMany({
      where: { status: 'PUBLISHED', isRecommended: true },
      take: 5,
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.novel.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 6,
    }),
    prisma.novel.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    })
  ])

  // Fallback: If no manually recommended novels, use the most popular one
  const heroNovels = recommendedNovels.length > 0 
    ? recommendedNovels 
    : (popularNovels.length > 0 ? [popularNovels[0]] : [])

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Hero Section */}
      <HeroCarousel novels={heroNovels} />

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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {popularNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold tracking-tight">最新上架</h2>
            </div>
            <Link href="/browse?sort=latest" className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
              查看全部
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {newNovels.map((novel, index) => (
              <Fragment key={novel.id}>
                <NovelCard 
                  novel={novel} 
                  isGlitchTarget={index === 2} // Target the 3rd book for the glitch effect
                />
              </Fragment>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
