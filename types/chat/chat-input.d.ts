export interface ChatInputProps {
  apiUrl: string,
  query: Record<string, any>,
  name: string,
  type: "channel" | "conversation"
}