import { Member, Profile } from "@prisma/client";

export interface ChatItemProps {
  id: string,
  content: string,
  member: Member & {
    profile: Profile
  },
  timestamp: string, // 定义时间戳
  fileUrl: string | null,
  deleted: boolean,
  currentMember: Member // 当前成员
  isUpdated: boolean, // 消息状态是否更新
  socketUrl: string,
  socketQuery: Record<string, string>,
}