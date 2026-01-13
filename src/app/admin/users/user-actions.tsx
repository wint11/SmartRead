'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Lock, Shield, Ban, CheckCircle } from "lucide-react"
import { resetUserPassword, updateUserRole, toggleUserBan } from "./actions"

interface UserActionsProps {
  userId: string
  currentRole: string
  currentStatus: string
}

export function UserActions({ userId, currentRole, currentStatus }: UserActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!confirm("确定要将该用户的密码重置为 'password123' 吗？")) return
    setLoading(true)
    try {
      const res = await resetUserPassword(userId)
      if (res.success) alert(res.message)
    } catch (error) {
      alert("操作失败")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (role: string) => {
    if (!confirm(`确定要将用户角色修改为 ${role} 吗？`)) return
    setLoading(true)
    try {
      await updateUserRole(userId, role)
    } catch (error) {
      alert("操作失败")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBan = async () => {
    const action = currentStatus === 'BANNED' ? '解封' : '封禁'
    if (!confirm(`确定要${action}该用户吗？`)) return
    setLoading(true)
    try {
      await toggleUserBan(userId, currentStatus)
    } catch (error) {
      alert("操作失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          <span className="sr-only">打开菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>用户操作</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleResetPassword}>
          <Lock className="mr-2 h-4 w-4" /> 重置密码
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>设置角色</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleUpdateRole('USER')} disabled={currentRole === 'USER'}>
          <UsersIcon className="mr-2 h-4 w-4" /> 普通用户
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUpdateRole('AUTHOR')} disabled={currentRole === 'AUTHOR'}>
          <Shield className="mr-2 h-4 w-4" /> 作者
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUpdateRole('ADMIN')} disabled={currentRole === 'ADMIN'}>
          <Shield className="mr-2 h-4 w-4 text-red-500" /> 管理员
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggleBan} className={currentStatus === 'BANNED' ? "text-green-600" : "text-red-600"}>
          {currentStatus === 'BANNED' ? (
            <><CheckCircle className="mr-2 h-4 w-4" /> 解除封禁</>
          ) : (
            <><Ban className="mr-2 h-4 w-4" /> 禁止发布/登录</>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UsersIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )
}
