import { ChannelType, Server, Channel } from "@prisma/client"

/**
 * 定义各个模型的类型
 * 1. 创造服务器
 * 2. 邀请
 * 3. 编辑服务器
 * 4. 管理成员
 */
export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "manageMembers"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "deleteMessage"

interface ModelData {
  server?: Server,
  channel?: Channel,
  channelType?: ChannelType
  apiUrl?: string,
  query?: Record<string, any>
}
export interface ModalStoreProps {
  type: ModalType | null
  data: ModelData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModelData) => void
  onClose: () => void
}
