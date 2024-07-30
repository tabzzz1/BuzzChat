import { Channel, MemberRole, Server } from "@prisma/client"

export interface ServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}
