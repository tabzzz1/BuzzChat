import { Member } from "@prisma/client";

export interface ChatMessagesProps {
  name: string,
  member: Member,
  chatId : string,
  apiUrl: string,
  socketUrl: string,
  socketQuery: Record<string, string>,
  paramKey: "channelId" | "conversationId"
  paramValue: string,
  type: "channel" | "conversation"
}