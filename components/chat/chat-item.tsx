"use client"

import { ChatItemProps } from "@/types/chat/chat-item.d"
import { UserAvatar } from "@/components/user-avatar"
import { ActionTooltip } from "@/components/action-tooltip"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  ShieldCheck,
  ShieldAlert,
  ShieldEllipsis,
  FileIcon,
  Edit,
  Trash,
} from "lucide-react"
import Image from "next/image"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { MemberRole } from "@prisma/client"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { http } from "@/lib/http"
import qs from "query-string"
import { ModalStore } from "@/stores/modal-store"
import { useRouter, useParams } from "next/navigation"

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldCheck className="mr-2 h-4 w-4 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldAlert className="mr-2 h-4 w-4 text-purple-500" />
  ),
  [MemberRole.GUEST]: (
    <ShieldEllipsis className="mr-2 h-4 w-4 text-green-500" />
  ),
}
// 使用zod模式定义表单纲要
const formSchema = z.object({
  content: z.string().min(1),
})

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const { onOpen } = ModalStore()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  })
  const isLoading = form.formState.isSubmitting
  // 修改消息的提交事件
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })
      await http.patch(url, values)
      form.reset()
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    form.reset({ content: content })
  }, [content, form])

  // 处理编辑信息的点击事件
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // 处理成员信息点击跳转私聊窗口
  const handleClickMember = () => {
    // 如果是自己则不跳转
    if(member.id === currentMember.id) {
      toast({
        title: "无法选择自己",
        description: "抱歉，您不能选择与自己进行私聊，请选择其他用户",
      })
      return
    }
    // 跳转到私聊窗口(每个服务器中私聊是独立的)
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isSelf = currentMember.id === member.id
  const isPDF = fileUrl?.split(".").pop() === "pdf" && fileUrl
  const isImage = fileUrl && !isPDF
  // 是否允许删除消息
  const allowDeleteMessage: boolean =
    !deleted && (isAdmin || isModerator || isSelf)
  // 是否允许编辑信息(PDF和Img不允许编辑)
  const allowEditMessage: boolean = !deleted && isSelf && fileUrl === null

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        {/* 头像 */}
        <div 
          onClick={handleClickMember}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        {/* 信息区域 */}
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              {/* 名字 */}
              <p 
                onClick={handleClickMember}
                className="font-semibold text-sm hover:underline cursor-pointer mr-1"
              >
                {member.profile.name}
              </p>
              {/* 身份提示 */}
              <ActionTooltip side="top" label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            {/* 事件 */}
            <span className="text-xs text-zinc-500 dark:text-zinc-400 -ml-3">
              {timestamp}
            </span>
          </div>
          {/* Img展示模块 */}
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="relative aspect-square rounded-md overflow-hidden border flex items-center bg-secondary h-48 w-48 mt-2"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {/* PDF展示模块 */}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF 文件
              </a>
            </div>
          )}
          {/* 消息内容区域 */}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300 mt-1",
                deleted &&
                  "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
              )}
            >
              {content}
              {/* 编辑后的消息显示(已更新) */}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (已更新)
                </span>
              )}
            </p>
          )}
          {/* 编辑信息模块 */}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="w-full p-2 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="编辑消息"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  // onClick={() => setIsEditing(false)}
                  // 表单的按钮自动有提交事件，无需重复绑定相关操作
                  size="sm"
                  variant="primary"
                  disabled={isLoading}
                >
                  确认
                </Button>
              </form>
              <p className="text-[10px] mt-1 text-zinc-400">
                按下<span className="text-rose-600">Esc</span>取消编辑...按下
                <span className="text-rose-600">确认</span>即为保存...
              </p>
            </Form>
          )}
        </div>
      </div>
      {allowDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {allowEditMessage && (
            <ActionTooltip label="编辑">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="删除">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
