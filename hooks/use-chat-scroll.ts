import type { ChatScrollProps } from "@/types/chat/chat-scroll"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMoreMessages,
  loadMoreMessages,
  count,
}: ChatScrollProps) => {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)
  const { toast } = useToast()

  // 加载更多消息
  useEffect(() => {
    // 获取DOM
    const chatElement = chatRef?.current
    const handleScroll = () => {
      // 获取页面的垂直滚动位置
      const scrollTop = chatElement?.scrollTop
      if (scrollTop === 0 && shouldLoadMoreMessages) {
        loadMoreMessages()
        setTimeout(() => {
          toast({
            description: "消息已成功更新！"
          })
          // setIsAutoScrolling(false)
        }, 1000)
      }
    }
    // 添加监听器
    chatElement?.addEventListener("scroll", handleScroll)
    return () => {
      // 移除监听器
      chatElement?.removeEventListener("scroll", handleScroll)
    }
  }, [chatRef, shouldLoadMoreMessages, loadMoreMessages, toast])

  // 有新消息时自动滚动
  useEffect(() => {
    // 获取DOM
    const bottomElement = bottomRef?.current
    const chatElement = chatRef?.current
    // 判断是否应该自动滚动
    const shouldAutoScroll = () => {
      // 初次渲染或没有在滚动过程中并且有底部元素
      if (!isAutoScrolling && bottomElement) {
        setIsAutoScrolling(true)
        return true
      }
      // 没有消息框的元素
      if (!chatElement) {
        return false
      }
      const distanceFromBottomTo =
        chatElement.scrollHeight -
        chatElement.scrollTop -
        chatElement.clientHeight
      return distanceFromBottomTo <= 100
    }

    if (shouldAutoScroll()) {
      const scrollEvent = setTimeout(() => {
        bottomElement?.scrollIntoView({ behavior: "smooth" })
        // setIsAutoScrolling(false)
      }, 100)

      return () => {
        clearTimeout(scrollEvent)
      }
    }
  }, [bottomRef, chatRef, count, isAutoScrolling])
}
