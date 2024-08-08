"use client"

import { ChatWelcome } from "@/components/chat/chat-welcome"
import { ChatItem } from "@/components/chat/chat-item"
import { Fragment } from "react"
import { Loader2, ServerCrash } from "lucide-react"

import { ChatMessagesProps } from "@/types/chat/chat-messages"
import { MessageWithMemberWithProfile } from "@/types/message-member-profile"

import { formatDate } from "@/utils/format-date"
import { useChatQuery } from "@/hooks/use-chat-query"
import { useChatSocket } from "@/hooks/use-chat-socket"

import { useEffect, useRef } from "react"

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  //* chatId 为 channelId
  const { serverId, channelId } = socketQuery
  const queryKey = `chat:${serverId}:${channelId}`
  const addKey = `chat:${serverId}:${channelId}:messages:add`
  const updateKey = `chat:${serverId}:${channelId}:messages:update`

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })

  useChatSocket({ queryKey, addKey, updateKey })

  // const messagesEndRef = useRef<HTMLDivElement>(null)
  // const scrollToBottom = () => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  //   }
  // }
  // useEffect(() => {
  //   scrollToBottom()
  // }, [data])

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-200 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          加载信息中...
        </p>
      </div>
    )
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-200 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          有一些意料之外的错误...
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />
      {/* 渲染消息 */}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, item) => (
          <Fragment key={item}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              /* 消息 */
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                currentMember={member}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={formatDate(message.createdAt)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
        {/* <div ref={messagesEndRef} /> */}
      </div>
    </div>
  )
}
