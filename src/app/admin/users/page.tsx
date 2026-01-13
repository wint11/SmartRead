import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserActions } from "./user-actions"

export default async function UsersPage() {
  const session = await auth()
  const role = session?.user?.role ?? ""
  if (role !== 'SUPER_ADMIN') redirect("/admin")

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>注册时间</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                <TableCell>
                  <Badge variant={user.status === 'BANNED' ? 'destructive' : 'default'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  {user.id !== session?.user?.id && (
                    <UserActions userId={user.id} currentRole={user.role} currentStatus={user.status} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
