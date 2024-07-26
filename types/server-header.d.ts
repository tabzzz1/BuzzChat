import { Server, Member, MemberRole } from "@prisma/client";

// 组合定义
type ServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[]
}

export interface ServerHeaderProps {
  server: ServerWithMembersWithProfile,
  role?: MemberRole
}