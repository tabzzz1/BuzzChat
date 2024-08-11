import { MobileToggle } from "@/components/mobile-toggle"
import { SocketStatus } from "@/components/socket-status"
import { Hash } from "lucide-react"

import { ChatHeaderProps } from "@/types/chat/chat-header"
import { UserAvatar } from "@/components/user-avatar"
import { ChatVideoButton } from "./chat-video-button"

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      {/* 移动切换按钮 */}
      <MobileToggle serverId={serverId} />
      {/* 类型图标 */}
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar className="h-6 w-6 md:h-8 md:w-8 mr-2" src={imageUrl} />
      )}
      {/* 服务器/成员名称 */}
      <p className="font-semibold text-black dark:text-white">{name}</p>
      {/* 状态标识 */}
      <div className="ml-auto flex items-center">
        {/* 私聊对话添加视频标识 */}
        {type === "conversation" && (
          <ChatVideoButton />
        )}
        <SocketStatus />
      </div>
    </div>
  )
}
