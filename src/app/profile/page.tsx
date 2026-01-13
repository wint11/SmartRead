import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LogOut } from "lucide-react"
import { ReaderSettingsCard } from "@/app/profile/reader-settings"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const role = session.user.role ?? ""

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">个人中心</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>您的账号基本资料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user.image || ""} />
                <AvatarFallback className="text-xl">{session.user.name?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-medium">{session.user.name}</h3>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
                <div className="mt-2">
                  <Badge variant="outline">{role}</Badge>
                </div>
              </div>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">昵称</Label>
                <Input value={session.user.name || ""} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">邮箱</Label>
                <Input value={session.user.email || ""} disabled className="col-span-3" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">编辑资料</Button>
            <form action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}>
              <Button variant="destructive" type="submit">
                <LogOut className="mr-2 h-4 w-4" /> 退出登录
              </Button>
            </form>
          </CardFooter>
        </Card>

        <ReaderSettingsCard />

        <Card>
            <CardHeader>
                <CardTitle>账号安全</CardTitle>
                <CardDescription>修改密码与安全设置</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline">修改密码</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
