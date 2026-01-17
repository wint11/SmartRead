"use server"

import { cookies } from "next/headers"
import { createHash } from "crypto"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const SECRET_KEY = "smartread_shop_secret"
const COOKIE_NAME = "shop_session"

interface ShopSession {
  balance: number
  role: string
  userId: number
}

function sign(data: string): string {
  return createHash('md5').update(data + SECRET_KEY).digest('hex')
}

export async function getShopSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)

  if (!sessionCookie) {
    return { balance: 10, role: "guest", userId: 1001, isNew: true }
  }

  try {
    const rawValue = Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    const [jsonStr, signature] = rawValue.split('.')
    const data = JSON.parse(jsonStr) as ShopSession
    return { ...data, isNew: false }
  } catch (e) {
    return { balance: 0, role: "error", userId: 0, isNew: false }
  }
}

export async function initShopSession() {
    const cookieStore = await cookies()
    const defaultData = JSON.stringify({ balance: 10, role: "guest", userId: 1001 })
    const signature = sign(defaultData)
    const cookieValue = Buffer.from(`${defaultData}.${signature}`).toString('base64')
    cookieStore.set(COOKIE_NAME, cookieValue, { httpOnly: false, path: '/' })
}

export async function recharge() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)
    
    let data: ShopSession = { balance: 10, role: "guest", userId: 1001 }
    
    if (sessionCookie) {
        try {
            const rawValue = Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
            const [jsonStr] = rawValue.split('.')
            data = JSON.parse(jsonStr)
        } catch (e) {
            // Invalid cookie, reset
        }
    }

    // Increment balance
    data.balance += 1000

    // Sign and set
    const jsonStr = JSON.stringify(data)
    const signature = sign(jsonStr)
    const cookieValue = Buffer.from(`${jsonStr}.${signature}`).toString('base64')
    
    cookieStore.set(COOKIE_NAME, cookieValue, { httpOnly: false, path: '/' })
    
    revalidatePath("/profile")
    return { success: true, balance: data.balance }
}

export async function purchaseVip() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(COOKIE_NAME)

  if (!sessionCookie) {
     return { success: false, message: "钱包未初始化，请刷新页面" }
  }

  try {
    const rawValue = Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    const [jsonStr, signature] = rawValue.split('.')
    
    const expectedSignature = sign(jsonStr)
    
    // CTF Vulnerability: Allow 'none' or matching signature
    if (signature !== 'none' && signature !== expectedSignature) {
        return { success: false, message: "安全警告: 数据被篡改！" }
    }

    const data = JSON.parse(jsonStr) as ShopSession
    
    if (data.balance >= 1000000) {
      return { success: true, message: "flag{money_makes_the_world_go_round_8888}" }
    } else {
      return { success: false, message: `余额不足。当前余额: ${data.balance} 金币` }
    }
    
  } catch (e) {
    return { success: false, message: "会话无效" }
  }
}

const profileSchema = z.object({
    name: z.string().min(2, "昵称至少2个字符").max(20, "昵称最多20个字符"),
})

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "未登录" }

    const rawData = {
        name: formData.get("name"),
    }

    const validated = profileSchema.safeParse(rawData)
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.name?.[0] }
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name: validated.data.name }
        })
        revalidatePath("/profile")
        return { success: true, message: "个人资料已更新" }
    } catch (e) {
        console.error("Update profile error:", e)
        // Check for "Record to update not found" (Prisma error P2025)
        if ((e as any).code === 'P2025' || (e as Error).message.includes("Record to update not found")) {
            return { error: "用户不存在，请尝试退出登录后重试" }
        }
        return { error: "更新失败: " + (e as Error).message }
    }
}

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z.string().min(6, "新密码至少6个字符"),
    confirmPassword: z.string().min(1, "请确认新密码"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
})

export async function updatePassword(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return { error: "未登录" }

    const rawData = {
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    }

    const validated = passwordSchema.safeParse(rawData)
    if (!validated.success) {
        // Return the first error message found
        const errors = validated.error.flatten().fieldErrors
        return { error: errors.currentPassword?.[0] || errors.newPassword?.[0] || errors.confirmPassword?.[0] }
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user || !user.password) {
        return { error: "用户不存在" }
    }

    // Verify current password
    // Note: In seed.ts, password is hashed. In real app, we use bcrypt.compare
    // I need to import bcrypt. Check if bcryptjs is available or if I have a helper.
    // Looking at package.json, "bcryptjs": "^3.0.3" is there.
    // I should check imports. I'll use bcryptjs directly or a helper if exists.
    // I see "bcryptjs" used in seed.ts.
    // I'll assume I can import it.
    
    // Check seed.ts: import bcrypt from 'bcryptjs'
    // I'll use bcryptjs here.
    const passwordsMatch = await bcrypt.compare(validated.data.currentPassword, user.password)
    
    if (!passwordsMatch) {
        return { error: "当前密码错误" }
    }

    const hashedPassword = await bcrypt.hash(validated.data.newPassword, 10)

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        })
        return { success: true, message: "密码已修改" }
    } catch (e) {
        return { error: "修改失败" }
    }
}
