"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserAvatar } from "@/components/user-avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  ShieldEllipsis,
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  ShieldQuestion,
  Check,
  Gavel,
  Loader2,
} from "lucide-react"

import { useState } from "react"
import { ModalStore } from "@/stores"
import { ServerWithMembersWithProfile } from "@/types/server-members-profile"
import qs from "query-string"
import { http } from "@/lib/http"
import { useRouter } from "next/navigation"
import { Server } from "@prisma/client"

const roleIcon = {
  ADMIN: <ShieldCheck className=" h-4 w-4 text-rose-500" />,
  MODERATOR: <ShieldAlert className=" h-4 w-4 text-purple-500" />,
  GUEST: <ShieldEllipsis className=" h-4 w-4 text-green-500" />,
}

export const ManageMembersModal = () => {
  const router = useRouter()
  const { isOpen, onClose, type, data, onOpen } = ModalStore()
  const [loadingId, setLoadingId] = useState("")
  // 判断是否打开
  const open = type === "manageMembers" && isOpen
  const { server } = data as { server: ServerWithMembersWithProfile }

  // 更改成员身份函数
  const onRoleChange = async (memberId: string, role: string) => {
    try {
      setLoadingId(memberId)
      // 更改成员身份
      const url = qs.stringifyUrl({
        url: `members/${memberId}`,
        query: {
          serverId: server?.id,
          memberId,
        },
      })
      // 发送请求
      const res: Server = await http.patch(url, { role })
      router.refresh()
      // 重新打开更新规则后的管理成员模态框
      onOpen("manageMembers", { server: res })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId("")
    }
  }
  // 踢出成员函数
  const onKickOut = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      // 踢出成员
      const url = qs.stringifyUrl({
        url: `members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })
      // 发送请求
      const res: Server = await http.delete(url)
      router.refresh()
      // 重新打开更新规则后的管理成员模态框
      onOpen("manageMembers", { server: res })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl">管理成员</DialogTitle>
          <DialogDescription className="text-center text-zinc-500 pt-2">
            {server?.members?.length}个成员
            <div className="text-xs font-semibold flex items-center justify-center w-full pt-4">
              {roleIcon["ADMIN"]}为服务器创建者
              {roleIcon["MODERATOR"]}为管理员
              {roleIcon["GUEST"]}为普通成员
            </div>
          </DialogDescription>
        </DialogHeader>
        {/* 成员列表 */}
        <ScrollArea className="mt-6 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              {/* 成员头像 */}
              <UserAvatar src={member.profile.imageUrl} />
              {/* 成员信息 */}
              <div className="flex flex-col gap-y-1">
                {/* 成员名称和身份铭牌 */}
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIcon[member.role]}
                </div>
                {/* 邮箱信息 */}
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {/* 操作按钮 */}
              {server.profileId !== member.profile.id &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>身份</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <ShieldAlert className="w-4 h-4 mr-2" />
                                管理员
                                {member.role === "MODERATOR" && (
                                  <Check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <ShieldEllipsis className="w-4 h-4 mr-2" />
                                普通成员
                                {member.role === "GUEST" && (
                                  <Check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        {/* 分割 */}
                        <DropdownMenuSeparator />
                        {/* 分割 */}
                        <DropdownMenuItem onClick={() => onKickOut(member.id)}>
                          <Gavel className="w-4 h-4 mr-2" />
                          踢出服务器
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 h-4 w-4 ml-auto" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
