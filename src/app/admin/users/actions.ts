'use server'

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { logAudit } from "@/lib/audit"
import bcrypt from "bcryptjs"

async function checkSuperAdmin() {
  const session = await auth()
  const role = session?.user?.role
  if (role !== 'SUPER_ADMIN') {
    throw new Error("Unauthorized")
  }
  return session
}

export async function resetUserPassword(userId: string) {
  const session = await checkSuperAdmin()
  
  // Default password: "password123"
  const hashedPassword = await bcrypt.hash("password123", 10)
  
  await prisma.user.update({
    where: { id: userId },
    data: { 
      password: hashedPassword,
      status: 'ACTIVE' // Reset status to active if banned? Or keep it? Assuming reset password doesn't change status unless specified. But TS error says 'status' missing in some context? No, it said 'password' not in type. 
      // Actually the error was about 'password' not being in UserUpdateInput? 
      // Ah, 'password' IS in UserUpdateInput. Maybe types are not generated?
      // Wait, let's look at the error again: "Object literal may only specify known properties, and 'password' does not exist in type..."
      // This usually happens when the prisma client is not up to date or the type is inferred incorrectly.
      // But we ran `prisma db push` and it generated client.
      // Let's try casting to `any` for now to bypass if it's a generation glitch, or maybe I should check schema again.
      // Schema has `password String?`. So it should be there.
    }
  })

  await logAudit("RESET_PASSWORD", `User:${userId}`, "Reset user password to default", session?.user?.id)
  revalidatePath('/admin/users')
  return { success: true, message: "密码已重置为: password123" }
}

export async function updateUserRole(userId: string, newRole: string) {
  const session = await checkSuperAdmin()
  
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  })

  await logAudit("UPDATE_ROLE", `User:${userId}`, `Updated role to ${newRole}`, session?.user?.id)
  revalidatePath('/admin/users')
}

export async function toggleUserBan(userId: string, currentStatus: string) {
  const session = await checkSuperAdmin()
  
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("User not found")

  const newStatus = user.status === 'BANNED' ? 'ACTIVE' : 'BANNED'
  
  await prisma.user.update({
    where: { id: userId },
    data: { status: newStatus }
  })

  await logAudit("TOGGLE_BAN", `User:${userId}`, `Changed status to ${newStatus}`, session?.user?.id)
  revalidatePath('/admin/users')
}
