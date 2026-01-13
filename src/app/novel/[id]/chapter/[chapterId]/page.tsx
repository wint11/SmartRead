import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ReaderView } from "@/components/reader-view"
import { Metadata } from "next"

interface ChapterPageProps {
  params: Promise<{
    id: string
    chapterId: string
  }>
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { chapterId } = await params
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { novel: true },
  })

  if (!chapter) {
    return { title: "Chapter Not Found" }
  }

  return {
    title: `${chapter.title} - ${chapter.novel.title}`,
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { id: novelId, chapterId } = await params

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      novel: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })

  if (!chapter) {
    notFound()
  }

  // Find prev/next chapters based on order
  const [prevChapter, nextChapter] = await Promise.all([
    prisma.chapter.findFirst({
      where: {
        novelId,
        order: chapter.order - 1,
      },
      select: { id: true },
    }),
    prisma.chapter.findFirst({
      where: {
        novelId,
        order: chapter.order + 1,
      },
      select: { id: true },
    }),
  ])

  return (
    <ReaderView 
      chapter={chapter}
      prevChapterId={prevChapter?.id}
      nextChapterId={nextChapter?.id}
    />
  )
}
