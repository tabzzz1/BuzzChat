"use client"
import { ActionTooltip } from "@/components/action-tooltip"

import { Hash, Mic, Video, Edit, Trash, Lock } from "lucide-react"

import { ChannelType, MemberRole } from "@prisma/client"
import { ServerChannelProps } from "@/types/server-channel.d"
import { useRouter, useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModalStore } from "@/stores/modal-store"
import type { ModalType } from "@/types/modal-store"

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const { onOpen } = ModalStore()
  const router = useRouter()
  const params = useParams()

  const Icon = iconMap[channel.type] 

  // 处理点击频道事件
  const handleChannelClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }
  // 处理事件
  const handleActionClick = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { server, channel })
  }
  // 无限混乱的tailwindCss
  // 用cn拼接的原因是：判断当前处于的频道并为其添加相应的样式区分
  return (
    <button
      onClick={handleChannelClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {/* 频道图标 */}
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      {/* 频道名称 */}
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {/* 频道设置 */}
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="编辑">
            <Edit
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => handleActionClick(e, "editChannel")}
            />
          </ActionTooltip>
          <ActionTooltip label="删除">
            <Trash
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => handleActionClick(e, "deleteChannel")}
            />
          </ActionTooltip>
        </div>
      )}
      {/* 频道锁定 */}
      {channel.name === "general" && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400" />
      )}
      {/* 频道在线人数 */}
    </button>
  )
}
