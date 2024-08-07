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
import qs from "query-string"

export const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = ModalStore()
  // 判断是否打开
  const open = type === "deleteMessage" && isOpen
  const { apiUrl, query } = data

  const [isLoading, setIsLoading] = useState(false)

  // 删除频道
  const onDelete = async () => {
    setIsLoading(true)
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query
    })
    try {
      await http.delete(url)
      onClose()
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
          <DialogTitle className="text-center text-2xl">删除消息</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            这条消息将会被清除！
            <span className=" text-rose-500">此操作不可逆！</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              我不要
            </Button>
            <Button disabled={isLoading} onClick={onDelete} variant="primary">
              非删不可
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
