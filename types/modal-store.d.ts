import { Server } from "@prisma/client"

/**
 * 定义各个模型的类型
 * 1. 创造服务器
 * 2. 邀请
 * 3. 编辑服务器
 * 4. 管理成员
 */
type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "manageMembers"
  | "createChannel"
  | "leaveServer"

interface ModelData {
  server?: Server
}
export interface ModalStoreProps {
  type: ModalType | null
  data: ModelData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModelData) => void
  onClose: () => void
}
