"use client"

import type { ServerSidebarProps } from "@/types/server-section.d"
import { MemberRole } from "@prisma/client"
import { ActionTooltip } from "@/components/action-tooltip"

import { Plus, Settings } from "lucide-react"

import { ModalStore } from "@/stores"

export const ServerSection = ({
  label,
  type,
  channelType,
  memberRole,
  server,
}: ServerSidebarProps) => {
  const { onOpen } = ModalStore()

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {/* 添加模块下的频道 */}
      {memberRole !== MemberRole.GUEST && type === "channels" && (
        <ActionTooltip label="添加频道" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("createChannel")}
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {/* 管理频道 */}
      {memberRole === MemberRole.ADMIN && type === "members" && (
        <ActionTooltip label="管理成员" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            onClick={() => onOpen("manageMembers", { server })}
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}
