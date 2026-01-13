
import { prisma } from "./src/lib/prisma"

async function main() {
  console.log("Checking novels and chapters...")
  
  const novels = await prisma.novel.findMany({
    take: 1,
    include: {
      chapters: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, status: true, order: true }
      }
    }
  })

  if (novels.length === 0) {
    console.log("No novels found.")
    return
  }

  const novel = novels[0]
  console.log(`Novel: ${novel.title} (${novel.id})`)
  console.table(novel.chapters)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
