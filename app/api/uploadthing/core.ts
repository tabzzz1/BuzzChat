import { createUploadthing, type FileRouter } from "uploadthing/next"
// import { UploadThingError } from "uploadthing/server"
import { auth } from "@clerk/nextjs/server"

const f = createUploadthing()

// 验证用户是否登录
const handleAuth = () => {
  const { userId } = auth()
  if (!userId) throw new Error("Unauthorized/未经授权")
  return { userId: userId }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // 上传头像
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(({ metadata, file }) => {
      console.log("@@@", metadata, file)
    }),
  // 上传消息文件
  messageFile: f(["image", "pdf"])
    .middleware(handleAuth)
    .onUploadComplete(({ metadata, file }) => {
      console.log("###", metadata, file)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
