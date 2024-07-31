"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useEffect } from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod" // 将zod模式转换为hookform验证器
import { baseForm } from "@/types/channel-from.d" // 导入表单模式
import { useForm } from "react-hook-form"
import { http } from "@/lib/http"
import { useRouter } from "next/navigation"
import { ModalStore } from "@/stores"
import { ChannelType } from "@prisma/client"
import qs from "query-string"

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = ModalStore()
  const router = useRouter()
  const { server, channel } = data
  // 创建表单
  const form = useForm({
    // 使用zodResolver将zod模式转换为hookform验证器
    resolver: zodResolver(baseForm),
    // 设置表单的默认值
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
  })
  // 从表单中提取方法
  const isLoding = form.formState.isSubmitting
  // 提交表单
  const onSubmit = async (values: z.infer<typeof baseForm>) => {
    try {
      // 将服务器id添加到查询字符串中
      const url = qs.stringifyUrl({
        url: `/channels/${channel?.id}`,
        query: { serverId: server?.id },
      })
      await http.patch(url, values)
      form.reset() // 重置表单
      router.refresh() // 刷新页面
      onClose()
    } catch (error) {
      console.log(error)
    }
  }
  // 关闭模态框
  const handleClose = () => {
    onClose()
    form.reset()
  }
  // 判断是否打开
  const open = type === "editChannel" && isOpen

  // 判断频道类型，如果没有的话默认为TEXT
  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name)
      form.setValue("type", channel.type)
    }
  }, [form, channel])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl">
            修改你的频道
          </DialogTitle>
        </DialogHeader>
        {/* 表单区 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 px-6">
              {/* 命名区域 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      频道名称
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoding}
                        className="bg-zinc-300/50 border-0
                          focus-visible:ring-0
                          text-black
                          focus-visible:ring-offset-0"
                        placeholder="请输入频道名称"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* 类型区域 */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      频道类型
                    </FormLabel>
                    <Select
                      disabled={isLoding}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="选择一个频道类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                      <FormMessage />
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoding} variant="primary">
                确认修改
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
