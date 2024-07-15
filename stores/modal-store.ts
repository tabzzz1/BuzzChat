import { create } from "zustand"
import { ModalStoreProps } from '@/types/modal-store'

export const ModalStore = create<ModalStoreProps>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => set({ type, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false })
}))