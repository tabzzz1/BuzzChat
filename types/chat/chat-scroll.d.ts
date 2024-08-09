export type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
  shouldLoadMoreMessages: boolean
  loadMoreMessages: () => void
  count: number
}