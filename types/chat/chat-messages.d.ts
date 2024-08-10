import { Member } from "@prisma/client";

export interface ChatMessagesProps {
  name: string,
  member: Member, // 指当前成员
  chatId : string,
  apiUrl: string,
  socketUrl: string,
  socketQuery: Record<string, string>,
  paramKey: "channelId" | "conversationId"
  paramValue: string,
  type: "channel" | "conversation"
}