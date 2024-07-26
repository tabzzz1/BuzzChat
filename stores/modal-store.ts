import { create } from "zustand"
import { ModalStoreProps } from '@/types/modal-store'

export const ModalStore = create<ModalStoreProps>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false })
}))