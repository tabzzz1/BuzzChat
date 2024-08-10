"use client"

import { Form, FormField, FormControl, FormItem } from "@/components/ui/form"
import { EmojiPicker } from "@/components/emoji-picker"
import { Input } from "@/components/ui/input"
import { Plus, Smile } from "lucide-react"

import { ChatInputProps } from "@/types/chat/chat-input"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { http } from "@/lib/http"
import qs from "query-string"
import { ModalStore } from "@/stores"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  content: z.string().min(1, "内容不能为空"),
})

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = ModalStore()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  const isLoading = form.formState.isSubmitting
  // 输入信息提交表单处理逻辑
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(value)
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })
      // 发送消息
      await http.post(url, values)
      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (!isLoading) {
      form.setFocus("content")
    }
  }, [isLoading, form])

  return (
    <Form {...form}>
      {/* 禁用表单填充 */}
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  {/* 发送附件功能按钮 */}
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "channel" ? "#" + name : name
                    }`}
                    {...field}
                  />
                  {/* 表情按钮 */}
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: any) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
