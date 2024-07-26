import { ServerHeader } from "@/components/server/server-header"

import { ChannelType } from "@prisma/client"
import type { ServerSidebarProps } from "@/types/server-sidebar.d"

import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return redirect("/")
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channel: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  })

  const textChannels = server?.channel.filter(
    (channel) => channel.type === ChannelType.TEXT
  )
  const audioChannels = server?.channel.filter(
    (channel) => channel.type === ChannelType.AUDIO
  )
  const videoChannels = server?.channel.filter(
    (channel) => channel.type === ChannelType.VIDEO
  )
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  )

  if (!server) {
    return redirect("/")
  }
  // 确认当前用户的role
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
    </div>
  )
}
