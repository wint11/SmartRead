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

  const chapter = await prisma.chapter.findFirst({
    where: { 
      id: chapterId,
      status: 'PUBLISHED',
      novel: {
        status: 'PUBLISHED'
      }
    },
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
    // CTF Hook: Lord of the Mysteries
    if (novelId === 'novel-lotm') {
      const chapters = [
        { id: 'chapter-1', title: 'Chapter 1: Crimson', order: 1, content: "Pain. Pain. Pain.\n\nHis head hurt as if it had been split open..." },
        { 
          id: 'chapter-2', 
          title: 'Chapter 2: Divination (VIP)', 
          order: 2, 
          isVip: true,
          // Here is the trick: The content is here, but wrapped in paywall HTML
          content: `Klein took out a silver coin from his pocket. It was a quarter pound note.
"The Fool that doesn't belong to this era..."
He chanted the honorific name.
Suddenly, the gray fog rose up.
Above the gray fog, a magnificent palace appeared.
He sat at the head of the long bronze table.
Wait, what is that inscription on the back of the chair?
flag{paywalls_are_just_css_illusions_7733}
He rubbed his eyes. The inscription vanished.`
        },
        { id: 'chapter-3', title: 'Chapter 3: The Seer', order: 3, content: "Coming soon..." },
      ]

      const targetChapter = chapters.find(c => c.id === chapterId)
      
      if (targetChapter) {
        return (
          <ReaderView 
            chapter={{...targetChapter, novel: { id: 'novel-lotm', title: 'Lord of the Mysteries' }}}
            chapters={chapters}
          />
        )
      }
    }

    notFound()
  }

  const chapters = await prisma.chapter.findMany({
    where: { 
      novelId,
      status: 'PUBLISHED'
    },
    select: { id: true, title: true, order: true, content: true, isVip: true },
    orderBy: { order: "asc" },
  })

  return (
    <ReaderView 
      chapter={chapter}
      chapters={chapters}
    />
  )
}
