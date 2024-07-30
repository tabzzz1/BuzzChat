import { ChannelType } from "@prisma/client"
import * as z from "zod"

// 使用zod模式定义表单
export const baseForm = z.object({
  name: z
    .string()
    .min(1, {
      message: "频道名称不能为空",
    })
    /* 非法处理 */
    .refine((name) => name !== "默认", {
      message: "频道名称不能为'默认'",
    }),
  type: z.nativeEnum(ChannelType),
})
