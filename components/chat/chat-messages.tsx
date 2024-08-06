"use client"

import { ChatWelcome } from "@/components/chat/chat-welcome"
import { Fragment } from "react"

import { ChatMessagesProps } from "@/types/chat/chat-messages"
import {MessageWithMemberWithProfile} from "@/types/message-member-profile"

import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"

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
  const queryKey = `chat:${chatId}`

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  })

  if(status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-200 animate-spin my-4"/>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          加载信息中...
        </p>
      </div>
    )
  }
  if(status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-200 my-4"/>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          有一些意料之外的错误...
        </p>
      </div>
    )
  }


  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome 
        name={name}
        type={type}
      />
      {/* 渲染消息 */}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, item) => (
          <Fragment key={item}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <div key={message.id}>
                {message.content}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
