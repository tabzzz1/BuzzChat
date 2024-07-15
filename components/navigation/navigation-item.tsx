"use client"

import { ActionTooltip } from "@/components/action-tooltip"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { useRouter, useParams } from "next/navigation"
import type { NavigationItemProps } from "@/types/navigation-item"

export const NavigationItem = ({ 
  id, 
  name, 
  imageUrl 
}: NavigationItemProps) => {
  const router = useRouter()
  const params = useParams()
  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={name}
    >
      <div>
        <button 
          onClick={onClick}
          className="group relative flex items-center"
        >
          {/* 左侧栏 */}
          <div className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )} />
          {/* 服务器头像 */}
          <div
            className={cn(
              "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all group-hover:rounded-[16px] overflow-hidden",
              params?.serverId === id && "bg-primary/10 text-primary"
            )}
          >
            <Image 
              fill
              src={imageUrl} 
              alt={name} 
            />
          </div>
        </button>
      </div>
    </ActionTooltip>
  )
}
