/**
 * 用于获取当前用户的个人资料信息
 * 通过 Clerk 的 auth 函数获取当前用户的 ID
 * 然后通过 Prisma 的 findUnique 方法查询数据库中的个人资料信息
 * 如果用户未登录，则返回 null
 * 如果用户已登录，则返回用户的个人资料信息 
 */ 
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export const currentProfile = async () => {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  })

  return profile
}
