"use client"

import type { SocketContextType } from "@/types/socket/socket-context"
import { io as ClientIo } from "socket.io-client"

import { useEffect, useState, useContext, createContext } from "react"

import { useSocket, useBulidSocketContext } from "@/hooks/use-socket"

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // 创建socket实例
    const socketInstance = new (ClientIo as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/socket/io",
        addTrailingSlash: false,
      }
    )
    // 
    socketInstance.on("connect", () => {
      setIsConnected(true)
    })
    socketInstance.on("disconnect", () => {
      setIsConnected(false)
    })
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
