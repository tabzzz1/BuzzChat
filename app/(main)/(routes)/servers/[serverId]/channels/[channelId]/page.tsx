import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"

import { ChannelIdPageProps } from "@/types/channel-id-page"
import { currentProfile } from "@/lib/current-profile"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

const ChannelIdPage = async ({
  params: { serverId, channelId },
}: ChannelIdPageProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return auth().redirectToSignIn()
  }
  // 通过url的channelId找出指定的channel
  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  })
  // 获取位于此服务器的成员
  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  })
  // 表示用户正在访问其没有的频道
  if (!channel || !member) {
    redirect("/")
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader serverId={serverId} name={channel.name} type="channel" />
      <div className="flex-1">Body</div>
      <ChatInput 
        apiUrl="/api/socket/message"
        query={{
          channelId,
          serverId,
        }}
        name={channel.name}
        type="channel"
      />
    </div>
  )
}
export default ChannelIdPage
