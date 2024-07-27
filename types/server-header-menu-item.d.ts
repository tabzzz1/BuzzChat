// 定义 ServerWithMembersWithProfile 类型
type ServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[]
}

// 定义基本接口类型
interface BaseServerHeaderMenuItemProps {
  identity: boolean
  context: string
  Icon: React.ElementType
  iconType?: boolean
  server?: ServerWithMembersWithProfile
}

interface ExtendedServerHeaderMenuItemProps extends BaseServerHeaderMenuItemProps {
  invite?: boolean
  edit?: boolean
}

export type ServerHeaderMenuItemProps = ExtendedServerHeaderMenuItemProps & (
  { invite: true; server: ServerWithMembersWithProfile } |
  { edit: true; server: ServerWithMembersWithProfile } |
  { invite?: false; edit?: false; server?: never }
)
