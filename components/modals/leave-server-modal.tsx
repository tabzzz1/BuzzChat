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

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = ModalStore()
  const router = useRouter()
  // 判断是否打开
  const open = type === "leaveServer" && isOpen
  const { server } = data

  const [isLoading, setIsLoading] = useState(false)

  // 离开服务器
  const onLeave = async () => {
    setIsLoading(true)
    try {
      await http.patch(`/servers/${server?.id}/leave`)
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
          <DialogTitle className="text-center text-2xl">离开服务器</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            你确定你想要离开
            <span className="font-semibold text-rose-500">{server?.name}</span>
            ？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              继续观望
            </Button>
            <Button disabled={isLoading} onClick={onLeave} variant="primary">
              狠心离开
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
