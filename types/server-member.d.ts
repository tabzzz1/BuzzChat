import { Member, Profile, Server } from "@prisma/client"

export interface ServerMemberProps {
  member: Member & { profile: Profile }
  server: Server
}
