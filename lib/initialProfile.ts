/** 
* 检查用户是否有profile，没有则创建一个新的profile
* 通过auth()获取当前用户的ID
* 通过Prisma的findUnique方法查询数据库中的个人资料信息
* 如果用户未登录，则返回null
* 如果用户已登录，则返回用户的个人资料信息
*/
import { currentUser, auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export const initialProfile = async () => {
  const user = await currentUser()

  if (!user) {
    return auth().redirectToSignIn()
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (profile) {
    return profile
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  })

  return newProfile
}
