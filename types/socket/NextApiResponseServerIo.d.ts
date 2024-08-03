import { Server as NetServer, Socket } from "net"
import { NextApiRequest } from "next"
import { Server as ServerIo } from "socket.io"

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: ServerIo
    }
  }
}