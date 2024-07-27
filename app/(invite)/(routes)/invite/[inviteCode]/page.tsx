import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { InviteCodePageProps } from "@/types/invite-code-page"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return auth().redirectToSignIn()
  }
  if (!params.inviteCode) {
    return redirect("/")
  }
  // 检查是否已经加入服务器
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })
  // 如果已经加入服务器，重定向到服务器页面
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`)
  }

  // 如果没有加入服务器，加入服务器
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  })
  // 如果服务器不存在，重定向到首页
  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return null
}

export default InviteCodePage
