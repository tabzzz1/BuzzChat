"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod" // 将zod模式转换为hookform验证器
import { baseForm } from "@/types/server-form.d" // 导入表单模式
import { useForm } from "react-hook-form"
import { http } from "@/lib/http"
import { useRouter } from "next/navigation"
import { ModalStore } from "@/stores"

export const CreateServerModal = () => {
  const { isOpen, onClose, type } = ModalStore()
  const router = useRouter()
  // 创建表单
  const form = useForm({
    // 使用zodResolver将zod模式转换为hookform验证器
    resolver: zodResolver(baseForm),
    // 设置表单的默认值
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  })
  // 从表单中提取方法
  const isLoding = form.formState.isSubmitting
  // 提交表单
  const onSubmit = async (values: z.infer<typeof baseForm>) => {
    // const { name, imageUrl } = values
    try {
      await http.post("/servers", values)
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
  const open = type === "createServer" && isOpen
  return (
    <Dialog open={open} onOpenChange={handleClose} >
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl">
            定制你的服务器
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            请为您的服务器设置名称和图片，以便您的朋友找到它
          </DialogDescription>
        </DialogHeader>
        {/* 表单区 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              {/* 图片上传区域 */}
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {/* 命名区域 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      服务器名称
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoding}
                        className="bg-zinc-300/50 border-0
                          focus-visible:ring-0
                          text-black
                          focus-visible:ring-offset-0"
                        placeholder="请输入服务器名称"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoding} variant="primary">
                创造
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
