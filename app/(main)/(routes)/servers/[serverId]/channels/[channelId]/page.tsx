import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { MediaRoom } from "@/components/media-room"

import { ChannelIdPageProps } from "@/types/channel-id-page"
import { currentProfile } from "@/lib/current-profile"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { ChannelType } from "@prisma/client"
import { Fragment } from "react"

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
      {/* 文字频道 */}
      {channel.type === ChannelType.TEXT && (
        <Fragment>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            type="channel"
            apiUrl="/messages"
            socketUrl="/socket/messages"
            socketQuery={{ serverId, channelId }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            apiUrl="/socket/messages"
            query={{
              channelId,
              serverId,
            }}
            name={channel.name}
            type="channel"
          />
        </Fragment>
      )}
      {/* 语音频道 */}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom 
          chatId={channel.id}
          audio={true}
          video={false}
        />
      )}
      {/* 视频频道 */}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom 
          chatId={channel.id}
          video={true}
          audio={true}
        />
      )}
    </div>
  )
}
export default ChannelIdPage
