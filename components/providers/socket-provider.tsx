"use client"

import { io as ClientIo } from "socket.io-client"

import { useEffect, useState } from "react"

import { useBulidSocketContext } from "@/hooks/use-socket"

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // 创建socket实例
    const socketInstance = new (ClientIo as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    )
    // 注册事件监听器
    // 当socket连接成功后修改isConnected的状态
    socketInstance.on("connect", () => {
      setIsConnected(true)
    })
    // 当socket断开连接后修改isConnected的状态
    socketInstance.on("disconnect", () => {
      setIsConnected(false)
    })
    // 将实例存储至组件状态中
    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <useBulidSocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </useBulidSocketContext.Provider>
  )
}
