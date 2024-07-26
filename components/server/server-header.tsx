import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronDown, 
  UserPlus, 
  Settings, 
  Users, 
  PlusCircle,
  Trash,
  LogOut
} from "lucide-react"
import { ServerHeaderMenuItem } from "@/components/server/server-header-menu-item"

import { ServerHeaderProps } from "@/types/server-header.d"
import { MemberRole } from "@prisma/client"

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN
  // 如果用户是管理员，那么他也是moderator
  const isModerator = isAdmin || role === MemberRole.MODERATOR
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      {/* 下拉菜单内容 */}
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-slate-400 space-y-[2px]">
        <ServerHeaderMenuItem identity={isModerator} context="添加新成员" Icon={UserPlus}/>
        <ServerHeaderMenuItem identity={isAdmin} context="设置服务器" Icon={Settings}/>
        <ServerHeaderMenuItem identity={isModerator} context="管理成员" Icon={Users}/>
        <ServerHeaderMenuItem identity={isModerator} context="创建新的频道" Icon={PlusCircle}/>
        { isModerator && <DropdownMenuSeparator />}
        <ServerHeaderMenuItem identity={isAdmin} context="删除服务器" Icon={Trash} iconType={true}/>
        <ServerHeaderMenuItem identity={!isAdmin} context="退出服务器" Icon={LogOut} iconType={true}/>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
