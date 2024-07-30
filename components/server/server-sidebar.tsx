import { ServerHeader } from "@/components/server/server-header/server-header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ServerSearch } from "@/components/server/server-search"
import { Separator } from "@/components/ui/separator"
import { ServerSection } from "@/components/server/server-section"
import { ServerChannel } from "@/components/server/server-channel"

import {
  Hash,
  Mic,
  Video,
  ShieldCheck,
  ShieldAlert,
  ShieldEllipsis,
} from "lucide-react"

import { ChannelType, MemberRole } from "@prisma/client"
import type { ServerSidebarProps } from "@/types/server-sidebar.d"

import { currentProfile } from "@/lib/current-profile"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldCheck className="mr-2 h-4 w-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldAlert className="mr-2 h-4 w-4 text-purple-500" />
  ),
  [MemberRole.GUEST]: (
    <ShieldEllipsis className="mr-2 h-4 w-4 text-green-500" />
  ),
}

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
      <ScrollArea className="flex-1 px-3">
        {/* 搜索 */}
        <div className="mt-2">
          <ServerSearch
            searchData={[
              {
                label: "文本频道",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "语音频道",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "视频频道",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: "成员Members",
                type: "member",
                data: members?.map((member) => ({
                  icon: roleIconMap[member.role],
                  name: member.profile.name,
                  id: member.id,
                })),
              },
            ]}
          />
        </div>
        {/* 分隔线 */}
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {/* 文本频道展示栏 */}
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="文本频道"
              type="channels"
              channelType={ChannelType.TEXT}
              memberRole={role}
            />
            {textChannels.map((channel) => (
              <ServerChannel 
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {/* 语音频道展示栏 */}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="语音频道"
              type="channels"
              channelType={ChannelType.AUDIO}
              memberRole={role}
            />
            {audioChannels.map((channel) => (
              <ServerChannel 
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
        {/* 视频频道展示栏 */}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              label="视频频道"
              type="channels"
              channelType={ChannelType.VIDEO}
              memberRole={role}
            />
            {videoChannels.map((channel) => (
              <ServerChannel 
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
