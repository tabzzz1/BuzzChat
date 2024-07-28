import { Server, Member, MemberRole } from "@prisma/client";
// 定义 ServerWithMembersWithProfile 类型
export type ServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[]
}