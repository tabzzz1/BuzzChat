type ModalType = "createServer"

export interface ModalStoreProps {
  type: ModalType | null,
  isOpen: boolean,
  onOpen: (type: ModalType) => void,
  onClose: () => void
}
