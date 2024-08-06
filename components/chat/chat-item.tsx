"use client"

import { ChatItemProps } from "@/types/chat/chat-item.d"
import { UserAvatar } from "@/components/user-avatar"
import { ActionTooltip } from "@/components/action-tooltip"
import Image from "next/image"
import { ShieldCheck, ShieldAlert, ShieldEllipsis, FileIcon } from "lucide-react"

import { MemberRole } from "@prisma/client"
import { useState } from "react"
import { cn } from "@/lib/utils"

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldCheck className="mr-2 h-4 w-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldAlert className="mr-2 h-4 w-4 text-purple-500" />
  ),
  [MemberRole.GUEST]: (
    <ShieldEllipsis className="mr-2 h-4 w-4 text-green-500" />
  ),
}

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isSelf = currentMember.id === member.id
  const isPDF = fileUrl?.split(".").pop() === "pdf" && fileUrl
  const isImage = fileUrl && !isPDF
  // 是否允许删除消息
  const allowDeleteMessage: boolean =
    !deleted && (isAdmin || isModerator || isSelf)
  const allowEditMessage: boolean = !deleted && isSelf && fileUrl === null

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        {/* 头像 */}
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              {/* 名字 */}
              <p className="font-semibold text-sm hover:underline cursor-pointer mr-1">
                {member.profile.name}
              </p>
              {/* 身份提示 */}
              <ActionTooltip side="top" label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            {/* 事件 */}
            <span className="text-xs text-zinc-500 dark:text-zinc-400 -ml-3">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="relative aspect-square rounded-md overflow-hidden border flex items-center bg-secondary h-48 w-48 mt-2"
            >
              <Image 
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
            <a 
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              PDF File
            </a>
          </div>
          )}
          
        </div>
      </div>
    </div>
  )
}
