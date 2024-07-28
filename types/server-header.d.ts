import type { ServerWithMembersWithProfile } from "@/types/server-members-profile"

export interface ServerHeaderProps {
  server: ServerWithMembersWithProfile,
  role?: MemberRole
}