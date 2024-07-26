type ServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile })[]
}
interface ServerHeaderMenuItemWithInvite extends BaseServerHeaderMenuItemProps {
  invite: true;
  server: ServerWithMembersWithProfile;  // 假设 server 是一个字符串类型，根据实际需要调整
}

interface ServerHeaderMenuItemWithoutInvite extends BaseServerHeaderMenuItemProps {
  invite?: false;
  server?: never;  // 当 invite 不为 true 时，server 属性不应存在
}

interface BaseServerHeaderMenuItemProps {
  identity: boolean,
  context: string,
  Icon: React.ElementType,
  iconType?: boolean
}

export type ServerHeaderMenuItemProps = ServerHeaderMenuItemWithInvite | ServerHeaderMenuItemWithoutInvite;
