export interface ChatQueryProps {
  queryKey: string,
  apiUrl: string,
  paramKey: "channelId" | "conversationId",
  paramValue: string
}