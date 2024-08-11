"use client"

import qs from "query-string"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Video, VideoOff } from "lucide-react"
import { ActionTooltip } from "@/components/action-tooltip"

export const ChatVideoButton = () => {
  const pathName = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const isVideo = searchParams?.get("video")

  // 图标
  const Icon = isVideo ? VideoOff : Video
  // 提示信息
  const tooltipLabel = isVideo ? "结束视频通话" : "开始视频通话"
  // 点击事件
  const handleClick = () => {
    // 
    const url = qs.stringifyUrl(
      {
        url: pathName || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    )

    // 跳转
    router.push(url)
  }

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button
        onClick={handleClick}
        className="hover:opacity-75 transition mr-4"
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  )
}
