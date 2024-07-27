"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Check, Copy } from "lucide-react"

import { Server } from "@prisma/client"
import { useState } from "react"
import { ModalStore } from "@/stores"
import { useOrigin } from "@/hooks/use-origin"
import { http } from "@/lib/http"

export const InviteModal = () => {
  const { isOpen, onClose, type, data, onOpen } = ModalStore()
  // 判断是否打开
  const open = type === "invite" && isOpen
  const { server } = data

  const origin = useOrigin()
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const [copied, setCopied] = useState(false)
  const onCopy = () => {
    // 复制到剪贴板
    navigator.clipboard.writeText(inviteUrl)
    // 修改复制状态
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const [isLoading, setIsLoading] = useState(false)
  const createNewInvite = async () => {
    if (!server || !server.id) {
      console.error("服务器ID缺失或未定义")
      return
    }
    try {
      setIsLoading(true)
      const res: Server = await http.patch(`/servers/${server.id}/invite-code`)
      onOpen("invite", { server: res }) // 更新服务器信息后server内容被重新解构
    } catch (error) {
      console.error("请求错误：", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl">
            邀请你的朋友
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-sm font-bold text-zinc-500 dark:text-secondary/70 uppercase">
            服务器邀请链接
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              placeholder="invite-link"
              value={inviteUrl}
            />
            <Button size="icon" onClick={onCopy} disabled={isLoading}>
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
          <Button
            className="mt-6 w-full"
            variant="primary"
            disabled={isLoading}
            onClick={createNewInvite}
          >
            生成一个新的链接
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
