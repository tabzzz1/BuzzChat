"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { ModalStore } from "@/stores"
import { http } from "@/lib/http"
import { useRouter } from "next/navigation"

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = ModalStore()
  const router = useRouter()
  // 判断是否打开
  const open = type === "deleteServer" && isOpen
  const { server } = data

  const [isLoading, setIsLoading] = useState(false)

  // 删除服务器
  const onDelete = async () => {
    setIsLoading(true)
    try {
      await http.delete(`/servers/${server?.id}`)
      onClose()
      router.refresh()
      router.push("/")
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl">删除服务器</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            您确定要这么做吗？
            <span className="font-semibold text-rose-500">此操作不可逆！</span>
            <br />
            <span className="font-semibold ">{server?.name}</span>将会被删除！
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              继续观望
            </Button>
            <Button disabled={isLoading} onClick={onDelete} variant="primary">
              狠心抛弃
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
