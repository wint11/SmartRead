import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'
import bcrypt from 'bcryptjs'

// Load .env file manually to ensure it's available
dotenv.config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient()

// Helper to generate long content
const generateLongContent = (title: string) => {
  const paragraph = `这里是${title}的正文内容。天行健，君子以自强不息；地势坤，君子以厚德载物。在这个充满灵气的世界里，强者为尊。
  
  （模拟正文内容……）
  
  科学研究表明，持续的努力是成功的关键。无论是撰写学术论文，还是创作文学作品，都需要严谨的态度和丰富的想象力。
  
  此处省略一千字……`;

  return Array(10).fill(paragraph).join('\n\n');
}

async function main() {
  console.log('正在重置数据库...')
  
  // Clean up existing data
  await prisma.readingHistory.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.novel.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.user.deleteMany()

  console.log('正在生成演示数据...')

  const passwordHash = await bcrypt.hash('123456', 10)

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: '超级管理员',
      password: passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    }
  })

  const author = await prisma.user.create({
    data: {
      email: 'author@example.com',
      name: '知名作家',
      password: passwordHash,
      role: 'AUTHOR',
      status: 'ACTIVE',
    }
  })

  const researcher = await prisma.user.create({
    data: {
      email: 'researcher@example.com',
      name: '科研人员',
      password: passwordHash,
      role: 'AUTHOR',
      status: 'ACTIVE',
    }
  })
  
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: '普通读者',
      password: passwordHash,
      role: 'USER',
      status: 'ACTIVE',
    }
  })

  // Create Novels
  await prisma.novel.create({
    data: {
      title: '斗破苍穹',
      author: '天蚕土豆',
      description: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！',
      category: '玄幻',
      type: 'NOVEL',
      coverUrl: 'https://placehold.co/400x600/png?text=DouPo',
      status: 'COMPLETED',
      rating: 4.8,
      views: 1000000,
      uploaderId: author.id,
      chapters: {
        create: Array.from({ length: 20 }).map((_, i) => ({
          title: `第${i + 1}章 陨落的天才`,
          content: generateLongContent(`第${i + 1}章`),
          order: i + 1,
        })),
      },
    },
  })

  await prisma.novel.create({
    data: {
      title: '诡秘之主',
      author: '爱潜水的乌贼',
      description: '蒸汽与机械的浪潮中，谁能触及非凡？历史和黑暗的迷雾里，又是谁在耳语？',
      category: '奇幻',
      type: 'NOVEL',
      coverUrl: 'https://placehold.co/400x600/png?text=LOTM',
      status: 'COMPLETED',
      rating: 4.9,
      views: 2000000,
      uploaderId: author.id,
      chapters: {
        create: Array.from({ length: 15 }).map((_, i) => ({
          title: `第${i + 1}章 绯红`,
          content: generateLongContent(`第${i + 1}章`),
          order: i + 1,
        })),
      },
    },
  })

  // Create Papers
  await prisma.novel.create({
    data: {
      title: 'Attention Is All You Need',
      author: 'Ashish Vaswani et al.',
      description: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
      category: '计算机科学',
      type: 'PAPER',
      coverUrl: 'https://placehold.co/400x600/png?text=Paper',
      status: 'PUBLISHED',
      rating: 5.0,
      views: 50000,
      uploaderId: researcher.id,
      chapters: {
        create: [
          { title: 'Abstract', content: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...', order: 1 },
          { title: 'Introduction', content: 'Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art...', order: 2 },
          { title: 'Model Architecture', content: 'Most competitive neural sequence transduction models have an encoder-decoder structure...', order: 3 },
        ]
      },
    },
  })

  // Create Autobiography
  await prisma.novel.create({
    data: {
      title: '我的前半生',
      author: '爱新觉罗·溥仪',
      description: '中国末代皇帝爱新觉罗·溥仪的回忆录，记录了他从登基到流亡，再到改造成为新公民的传奇经历。',
      category: '传记',
      type: 'AUTOBIOGRAPHY',
      coverUrl: 'https://placehold.co/400x600/png?text=Bio',
      status: 'PUBLISHED',
      rating: 4.5,
      views: 30000,
      uploaderId: author.id,
      chapters: {
        create: Array.from({ length: 5 }).map((_, i) => ({
          title: `第${i + 1}章 我的童年`,
          content: generateLongContent(`第${i + 1}章`),
          order: i + 1,
        })),
      },
    },
  })

  console.log('数据生成完成！')
  console.log('测试账号:')
  console.log('管理员: admin@example.com / 123456')
  console.log('作者: author@example.com / 123456')
  console.log('读者: user@example.com / 123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
