import { Server } from "@prisma/client"

type ModalType = "createServer" | "invite"

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


