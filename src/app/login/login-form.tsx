'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login, register } from "./actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      if (isRegistering) {
        const result = await register(formData)
        if (result.success) {
          toast.success("注册成功，请登录")
          setIsRegistering(false)
        } else {
          toast.error(result.error || "注册失败")
        }
      } else {
        const result = await login(formData)
        
        if (result.success && result.redirectTo) {
          toast.success("登录成功")
          router.push(result.redirectTo)
          router.refresh()
        } else {
          toast.error(result.error || "登录失败")
        }
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
        <CardTitle className="text-2xl">{isRegistering ? "注册" : "登录"}</CardTitle>
        <CardDescription>
          {isRegistering ? "创建您的智汇阅读账号" : "输入您的邮箱和密码以登录智汇阅读"}
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {isRegistering && (
             <div className="space-y-2">
              <Label htmlFor="name">昵称</Label>
              <Input id="name" name="name" type="text" placeholder="您的昵称" required disabled={loading} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" name="password" type="password" required disabled={loading} />
          </div>
          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={loading} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (isRegistering ? "注册中..." : "登录中...") : (isRegistering ? "注册" : "登录")}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full" 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            {isRegistering ? "已有账号？去登录" : "没有账号？去注册"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}