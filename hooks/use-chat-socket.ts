import type { ChatSocketProps } from "@/types/chat/chat-socket"
import { MessageWithMemberWithProfile } from "@/types/message-member-profile"
import { useSocket } from "@/hooks/use-socket"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      //
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // 如果没有数据，直接返回
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData
        }
        // 更新数据
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                return message
              }
              return item
            }),
          }
        })
        // 返回数据
        return {
          ...oldData,
          pages: newData,
        }
      })
    })

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        // 如果没有数据，直接返回
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          }
        }

        const newData = [...oldData.pages]
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        }

        return {
          ...oldData,
          pages: newData,
        }
      })
    })

    return () => {
      socket.off(updateKey)
      socket.off(addKey)
    }
  }, [addKey, updateKey, queryKey, queryClient, socket])
}
