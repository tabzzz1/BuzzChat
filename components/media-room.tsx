"use client"

import {
  LiveKitRoom,
  VideoConference,
  AudioConference,
} from "@livekit/components-react"
import { MediaRoomProps } from "@/types/media-room"
import "@livekit/components-styles"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser()
  const [token, setToken] = useState("")

  useEffect(() => {
    // 判断用户是否有姓氏和名字来确认用户是否登录
    if (!user?.firstName || !user?.lastName) return
    // 设定用户姓名
    const name = `${user.firstName} ${user.lastName}`

    ;(async () => {
      try {
        // qs
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
        const data = await res.json()
        setToken(data.token)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [user?.firstName, user?.lastName, chatId])

  if (token === "") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">加载中...</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-1",
        (video && audio) ? "overflow-y-hidden" : ""
      )}
    >
      <LiveKitRoom
        data-lk-theme="default" // 默认主题
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL} // livekit 服务器地址
        connect={true} // 是否自动连接
        token={token}
        video={video}
        audio={audio}
      >
        
        {/* 音频 */}
        {audio && !video && <AudioConference />}
        {/* 视频 */}
        {video && audio && <VideoConference />}
      </LiveKitRoom>
    </div>
  )
}
