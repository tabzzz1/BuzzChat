import * as z from "zod"

// 使用zod模式定义表单
export const baseForm = z.object({
  fileUrl: z.string().min(1, {
    message: "文件不能为空",
  }),
})