import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Eye, FileClock } from "lucide-react"
import { getAiReviewEnabled, setAiReviewEnabled } from "@/lib/app-settings"
import { revalidatePath } from "next/cache"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default async function AdminDashboardPage() {
  const session = await auth()
  const role = session?.user?.role ?? ""
  const aiReviewEnabled = role === "SUPER_ADMIN" ? await getAiReviewEnabled() : false

  const totalArticles = await prisma.novel.count()
  const pendingArticles = await prisma.novel.count({ where: { status: 'PENDING' } })
  const totalUsers = await prisma.user.count()
  const totalViews = await prisma.novel.aggregate({ _sum: { views: true } })

  const stats = [
    { title: "总文章数", value: totalArticles, icon: BookOpen },
    { title: "待审核", value: pendingArticles, icon: FileClock },
    { title: "总用户", value: totalUsers, icon: Users },
    { title: "总阅读量", value: totalViews._sum.views || 0, icon: Eye },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">管理概览</h1>
      {role === "SUPER_ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">系统功能</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={async (formData: FormData) => {
                "use server"
                const session = await auth()
                if (session?.user?.role !== "SUPER_ADMIN") throw new Error("Unauthorized")
                const enabled = formData.get("aiReviewEnabled") === "on"
                await setAiReviewEnabled(enabled)
                revalidatePath("/admin")
                revalidatePath("/admin/articles")
              }}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <Label htmlFor="aiReviewEnabled">文章审核 AI 预审</Label>
                <p className="text-sm text-muted-foreground">开启后，作者首次提交章节会触发 AI 预审</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="aiReviewEnabled"
                  name="aiReviewEnabled"
                  type="checkbox"
                  defaultChecked={aiReviewEnabled}
                  className="h-4 w-4"
                />
                <Button type="submit" size="sm" variant="outline">
                  保存
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
