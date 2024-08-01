"use client"

import { UserAvatar } from "@/components/user-avatar"

import { ShieldCheck, ShieldAlert, ShieldEllipsis } from "lucide-react"

import { ServerMemberProps } from "@/types/server-member.d"
import { MemberRole } from "@prisma/client"
import { useRouter, useParams } from "next/navigation"
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

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const router = useRouter()
  const params = useParams()
  const icon = roleIconMap[member.role]

  const handleMemberClick = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`)
  }
  return (
    <div>
      <button
        className={cn(
          "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
          params?.memberId === member.id &&
            "bg-zinc-700/20 dark:bg-zinc-700"
        )}
        onClick={handleMemberClick}
      >
        {/* 头像 */}
        <UserAvatar
          src={member.profile.imageUrl}
          className="h-8 w-8 md:h-8 md:w-8"
        />
        {/* 名字 */}
        <p
          className={cn(
            "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
            params?.memberId === member.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {member.profile.name}
        </p>
        {/* 图标 */}
        {icon}
      </button>
    </div>
  )
}
