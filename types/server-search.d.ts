export interface ServerSearchProps {
  searchData: {
    label: string,
    type: "channel" | "member"
    data: {
      icon: React.ReactNode
      name: string
      id: string
    }[] | undefined
  }[]
}
