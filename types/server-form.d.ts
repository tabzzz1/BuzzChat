import * as z from "zod"

// 使用zod模式定义表单
export const baseForm = z.object({
  name: z.string().min(1, {
    message: "服务器名称不能为空",
  }),
  imageUrl: z.string().min(1, {
    message: "服务器图片不能为空",
  }),
})