'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "./actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await login(formData)
      
      if (result.success && result.redirectTo) {
        toast.success("登录成功")
        // Small delay to let user see the toast, or immediate redirect?
        // Immediate redirect is better UX usually, toast will persist if possible or just be quick.
        router.push(result.redirectTo)
        router.refresh() // Ensure server components update with new session
      } else {
        toast.error(result.error || "登录失败")
      }
    } catch (error) {
      console.error(error)
      toast.error("发生未知错误，请检查控制台")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">登录</CardTitle>
        <CardDescription>
          输入您的邮箱和密码以登录智汇阅读
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" name="password" type="password" required disabled={loading} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}