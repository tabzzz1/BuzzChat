import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ServerIdPageProps } from "@/types/server-id-page"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return auth().redirectToSignIn()
  }

  const serverId = params.serverId

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channel: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  const initialChannel = server?.channel[0]

  if (initialChannel?.name !== "general") {
    return null
  }
  // 默认跳转至general页面
  return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`)
}

export default ServerIdPage
