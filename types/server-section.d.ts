import { ChannelType, MemberRole } from "@prisma/client"
import { ServerWithMembersWithProfile } from "@/types/server-members-profile.d"

export interface ServerSidebarProps {
  label: string
  type: "channels" | "members"
  channelType?: ChannelType
  memberRole?: MemberRole
  server?: ServerWithMembersWithProfile
}
