import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"

import { MemberIdPageProps } from "@/types/member-id-page"

import { currentProfile } from "@/lib/current-profile"
import { getConversation } from "@/lib/conversation"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const MemberIdPage = async ({
  params: { memberId, serverId },
}: MemberIdPageProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return auth().redirectToSignIn()
  }
  // 你本人在服务器中的成员信息
  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })
  if (!currentMember) {
    return redirect("/")
  }

  const conversation = await getConversation(currentMember?.id, memberId)
  if (!conversation) {
    return redirect(`/servers/${serverId}`)
  }

  const { memberOne, memberTwo } = conversation
  // 获取对方成员信息
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
      <ChatMessages
        name={otherMember.profile.name}
        member={currentMember}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/direct-messages"
        socketUrl="/socket/direct-messages"
        socketQuery={{ conversationId: conversation.id }}
        paramKey="conversationId"
        paramValue={conversation.id}
      />
      <ChatInput 
        name={otherMember.profile.name} 
        apiUrl="/socket/direct-messages" 
        type="conversation"
        query={{conversationId: conversation.id}}
      />
    </div>
  )
}

export default MemberIdPage
