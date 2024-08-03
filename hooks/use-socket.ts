import type { SocketContextType } from "@/types/socket/socket-context"
import { useContext, createContext } from "react"

export const useBulidSocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => {
  return useContext(useBulidSocketContext)
}
