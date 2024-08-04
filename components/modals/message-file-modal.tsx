"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormField, FormControl, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod" // 将zod模式转换为hookform验证器
import { baseForm } from "@/types/message-file-form.d" // 导入表单模式
import { useForm } from "react-hook-form"
import { http } from "@/lib/http"
import { useRouter } from "next/navigation"
import { ModalStore } from "@/stores"
import qs from "query-string"

export const MessageFileModal = () => {
  const { isOpen, type, onClose, data } = ModalStore()
  const open = type === "messageFile" && isOpen
  const { apiUrl, query } = data
  const router = useRouter()
  // 创建表单
  const form = useForm({
    // 使用zodResolver将zod模式转换为hookform验证器
    resolver: zodResolver(baseForm),
    // 设置表单的默认值
    defaultValues: {
      fileUrl: "",
    },
  })

  // 从表单中提取方法
  const isLoding = form.formState.isSubmitting

  // 提交表单
  const onSubmit = async (values: z.infer<typeof baseForm>) => {
    // const { name, imageUrl } = values
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query,
    })
    console.log(url)
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      })
      console.log(url)
      await http.post(url, {
        fileUrl: values.fileUrl,
        content: values.fileUrl
      })
      form.reset() // 重置表单
      router.refresh() // 刷新页面
      handleClose() // 关闭模态框
    } catch (error) {
      console.log(error)
    }
  }

  // 退出关闭模态框
  const handleClose = () => {
    // 清除表单
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl">
            添加一个附件
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            发送一个文件做为信息
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
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoding} variant="primary">
                发送
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
