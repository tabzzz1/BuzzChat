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
import { useChatScroll } from "@/hooks/use-chat-scroll"

import { useEffect, useRef, ElementRef } from "react"

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

  const chatRef = useRef<ElementRef<"div">>(null)
  const bottomRef = useRef<ElementRef<"div">>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })

  useChatSocket({ queryKey, addKey, updateKey })

  useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMoreMessages: !isFetchingNextPage && hasNextPage,
    loadMoreMessages: fetchNextPage,
    count: data?.pages?.[0].items.length ?? 0,
  })

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
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={type} />}
      {/* 加载圈 */}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4"
            >
              加载更多消息...
            </button>
          )}
        </div>
      )}
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
      <div ref={bottomRef} />
    </div>
  )
}
